import { socket } from '../routes.js';

export default function renderScreen2() {
	const app = document.getElementById('app');
	app.innerHTML = `
    <h1>Winner</h1>
    <div id="winner"></div>
  `;

	// Escuchar el evento de anuncio de ganador
	socket.on('announceWinner', (data) => {
		const { winner, players } = data;

		// Ordenar jugadores por puntuación descendente
		const sortedPlayers = players.sort((a, b) => b.score - a.score);

		// Mostrar el ganador y la lista ordenada
		let resultHTML = `<h2>¡Ganador: ${winner}!</h2>`;
		resultHTML += '<ul>';

		sortedPlayers.forEach((player, index) => {
			resultHTML += `<li>${index + 1}. ${player.name} (${player.score} pts)</li>`;
		});

		resultHTML += '</ul>';
		document.getElementById('winner').innerHTML = resultHTML;
	});
}
