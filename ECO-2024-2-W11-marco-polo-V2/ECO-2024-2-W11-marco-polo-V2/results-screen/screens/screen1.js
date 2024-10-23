import { socket, router } from '../routes.js';

export default function renderScreen1() {
	const app = document.getElementById('app');
	app.innerHTML = `
    <h1>Scores</h1>
		<div id="container"><ul id="players"></ul></div>
  `;

	// Función para actualizar la lista de jugadores
	const updatePlayerList = (players) => {
		let playersList = '';

		players.forEach((player, index) => {
			playersList += `<li>${index + 1}. ${player.nickname} (${player.score} pts)</li>`;
		});

		document.getElementById('players').innerHTML = playersList;
	};

	// Escuchar las actualizaciones de puntuación
	socket.on('updateScore', (data) => {
		const { players } = data;
		updatePlayerList(players); // Actualizar la lista de jugadores
	});

	// Escuchar cuando un nuevo jugador se une y renderizar los jugadores
	socket.on('userJoined', (db) => {
		console.log('userJoined', db);
		const { players } = db;
		updatePlayerList(players); 
	});

	// Escuchar el anuncio del ganador y redirigir a la pantalla de ganador
	socket.on('announceWinner', (data) => {
		console.log('Winner announced:', data.winner);
		router.navigateTo('/screen2'); // Redirigir a la pantalla 2
	});
}
