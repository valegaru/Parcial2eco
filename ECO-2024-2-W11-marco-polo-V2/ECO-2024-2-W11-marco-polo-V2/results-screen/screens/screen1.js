import { socket, router } from '../routes.js';

export default function renderScreen1() {
	const app = document.getElementById('app');
	app.innerHTML = `
    <h1>Score</h1>
    <ul id="players"></ul>
  `;

	// Escuchar las puntuaciones iniciales de los jugadores
	socket.on('initialPlayers', (data) => {
		const { players } = data;
		let playersList = '';

		players.forEach((player, index) => {
			playersList += `<li>${index + 1}. ${player.name} (${player.score} pts)</li>`;
		});

		document.getElementById('players').innerHTML = playersList;
	});

	// Escuchar las actualizaciones de puntuación
	socket.on('updateScore', (data) => {
		const { players } = data;
		let playersList = '';

		players.forEach((player, index) => {
			playersList += `<li>${index + 1}. ${player.name} (${player.score} pts)</li>`;
		});

		document.getElementById('players').innerHTML = playersList;
	});

	// Escuchar el anuncio del ganador y redirigir a la pantalla de ganador
	socket.on('announceWinner', (data) => {
		console.log('Winner announced:', data.winner);
		router.navigateTo('/screen2'); // Redirigir a la pantalla 2
	});
}
