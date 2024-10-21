// const { assignRoles } = require('../utils/helpers');
// const { players } = require('../db/index');

// // Nuevo evento para manejar cuando el cliente solicita los datos del ganador
// const getWinnerDataHandler = (socket, db) => {
// 	return () => {
// 		// Filtrar los jugadores que tienen un score mayor o igual a 100
// 		const players = db.players.map((player) => ({
// 			name: player.nickname,
// 			score: player.score,
// 		}));

// 		// Determinar si hay un ganador (puntuación mayor o igual a 100)
// 		const winner = players.find((player) => player.score >= 100);
// 		console.log('Ganador encontrado:', winner);
//     if (winner) {
// 			socket.emit('announceWinner', {
// 				winner: winner.name, // Enviar el nombre del ganador
// 				score: winner.score, // Enviar el score del ganador
// 				players: players, // Enviar la lista de todos los jugadores y sus puntuaciones
// 			});
// 		}
// 	};
// };

// module.exports = {
// 	getWinnerDataHandler,
// };
