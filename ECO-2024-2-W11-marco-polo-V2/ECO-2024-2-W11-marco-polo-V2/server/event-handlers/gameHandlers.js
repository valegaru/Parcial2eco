// gameHandlers.js

const { assignRoles } = require('../utils/helpers');

// Assuming db and io are required or passed in some way to be accessible
const joinGameHandler = (socket, db, io) => {
	return (user) => {
		//se agrega el campo score, inicializandolo en 0
		db.players.push({ id: socket.id, ...user, score: 0 });
		console.log(db.players);
		io.emit('userJoined', db); // Broadcasts the message to all connected clients including the sender
	};
};

const startGameHandler = (socket, db, io) => {
	return () => {
		db.players = assignRoles(db.players);

		db.players.forEach((element) => {
			io.to(element.id).emit('startGame', element.role);
		});
	};
};

const notifyMarcoHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'polo' || user.role === 'polo-especial');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Marco!!!',
				userId: socket.id,
			});
		});
	};
};

const notifyPoloHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'marco');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Polo!!',
				userId: socket.id,
			});
		});
	};
};

//modificado para manejar los puntajes
const onSelectPoloHandler = (socket, db, io) => {
	return (userID) => {
		const marcoPlayer = db.players.find((user) => user.id === socket.id);
		const poloSelected = db.players.find((user) => user.id === userID);
    const poloEspecial = db.players.find((user) => user.role === 'polo-especial');

		if (poloSelected.role === 'polo-especial') {
			// Marco atrapó al polo especial, suma puntos. Y resta puntos al polo especial
			marcoPlayer.score += 50;
			poloSelected.score -= 10;

			// Notify all players that the game is over y actualizar puntajes
			db.players.forEach((element) => {
				io.to(element.id).emit('notifyGameOver', {
					message: `El marco ${marcoPlayer.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`,
				});
			});
		} else {
			// Marco no atrapó al polo especial, se resta puntos.
			marcoPlayer.score -= 10;

        // Si el polo especial no es seleccionado, gana 10 puntos
        if (poloEspecial) {
          poloEspecial.score += 10;
        }

			// Notify all players that the game is over and update scores
			db.players.forEach((element) => {
				io.to(element.id).emit('notifyGameOver', {
					message: `El marco ${marcoPlayer.nickname} ha perdido`,
				});
			});
		}

		// Emitir evento para actualizar las puntuaciones a todos los clientes
		io.emit('updateScore', {
			players: db.players.map((player) => ({
				name: player.nickname,
				score: player.score,
			})),
		});

		// Si alguno llega a 100 puntos, anunciar el ganador
		const winner = db.players.find((player) => player.score >= 100);
		if (winner) {
			io.emit('announceWinner', {
				winner: winner.nickname,
				players: db.players.map((player) => ({
					name: player.nickname,
					score: player.score,
				})),
			});
		}
	};
};

module.exports = {
	joinGameHandler,
	startGameHandler,
	notifyMarcoHandler,
	notifyPoloHandler,
	onSelectPoloHandler,
};
