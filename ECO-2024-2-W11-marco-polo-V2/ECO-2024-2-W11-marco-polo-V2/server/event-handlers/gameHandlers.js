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

//para almacenar al ganador al pasarselo a las screen 2
let lastWinner = null;

// Nuevo evento para manejar cuando el cliente results al pasar de screen solicita los datos del ganador
const getWinnerDataHandler = (socket, db) => {
	return () => {
		// Si ya hay un ganador previo, enviarlo al cliente. Debe de haber porque asi se pasa de screen. Primero se ejecuta onSelectPoloHandler
		if (lastWinner) {
			socket.emit('announceWinner', {
				winner: lastWinner.nickname,
				//se mandan tmabien todos los jugadores con su score
				players: db.players.map((player) => ({
					name: player.nickname,
					score: player.score,
				})),
			});
		}
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

		// Si alguno llega a 100 puntos, hay un ganador. Si hay un ganador, anunciar al ganador.
		const winner = db.players.find((player) => player.score >= 100);
		if (winner) {
			lastWinner = winner;
			console.log('Winner:', winner);
			io.emit('announceWinner', {
				winner: winner.nickname,
				//tambien se envian los todos los jugadores y su puntaje
				players: db.players.map((player) => ({
					name: player.nickname,
					score: player.score,
				})),
			});
		}
	};
};

//ocurre al oprimir restartGame
const restartGameHandler = (socket, db, io) => {
	return () => {
		// Buscar un jugador que tenga una puntuación mayor o igual a 100, es el ganador
		const winner = db.players.find((player) => player.score >= 100);

		// Si no hay ganador, simplemente reiniciar el juego asignando roles, con startGame
		if (!winner) {
			// Llamar a startGameHandler para reiniciar el juego
			return startGameHandler(socket, db, io)();
		}

		// Verificamos si el jugador que ganó es "marco"
		if (winner.role === 'marco') {
			// Reiniciar las puntuaciones de todos los jugadores
			db.players.forEach((player) => {
				player.score = 0; // Reiniciar el puntaje a 0
			});

			// Emitir un evento a todos los jugadores que el juego ha sido reiniciado
			io.emit('gameRestarted', {
				message: 'El juego ha sido reiniciado. ¡Buena suerte a todos!',
				players: db.players.map((player) => ({
					name: player.nickname,
					score: player.score,
				})),
			});

			// Reiniciar el juego asignando roles nuevamente
			db.players = assignRoles(db.players);

			// Notificar a cada jugador que el juego ha comenzado
			db.players.forEach((element) => {
				io.to(element.id).emit('startGame', element.role);
			});
		} else {
			// Si no es "marco", solo reiniciar el juego asignando roles
			db.players = assignRoles(db.players);
			db.players.forEach((element) => {
				io.to(element.id).emit('startGame', element.role);
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
	getWinnerDataHandler,
	restartGameHandler,
};
