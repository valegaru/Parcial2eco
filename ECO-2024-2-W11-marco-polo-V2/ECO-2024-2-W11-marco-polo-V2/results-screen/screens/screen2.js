import { socket, router } from '../routes.js';

export default function renderScreen2() {
	const app = document.getElementById('app');
	app.innerHTML = `
    <h1>¡Tenemos un ganador!</h1>
    <p id="winnerMessage"></p>
    <h2>Posiciones finales</h2>
    <ul id="finalPlayers"></ul>
  `;

	// Solicitar datos del ganador y los jugadores al servidor si no se reciben inicialmente
	socket.emit('getWinnerData');

	// Escuchar el evento 'announceWinner' para recibir los datos del ganador y jugadores
	socket.on('announceWinner', (data) => {
		const { winner, players } = data;

		// Mostrar el mensaje del ganador
		document.getElementById('winnerMessage').textContent = `¡El ganador es ${winner}!`;

		// Ordenar los jugadores por puntuación de mayor a menor
		players.sort((a, b) => b.score - a.score);

		// Crear la lista de posiciones con los jugadores
		let playersList = '';
		players.forEach((player, index) => {
			playersList += `<li>${index + 1}. ${player.name} (${player.score} pts)</li>`;
		});

		// Renderizar la lista de jugadores en el HTML
		document.getElementById('finalPlayers').innerHTML = playersList;
	});
}
