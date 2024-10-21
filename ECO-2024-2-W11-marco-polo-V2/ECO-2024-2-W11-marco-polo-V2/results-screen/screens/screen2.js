import { socket, router } from '../routes.js';

export default function renderScreen2() {
	const app = document.getElementById('app');
	let winner = '';
	let players = [];

	function renderWinnerScreen() {
		if (winner && players.length > 0) {
			app.innerHTML = `
                <h1>¡Tenemos un ganador!</h1>
                <p id="winnerMessage">¡El ganador es ${winner}!</p>
                <h2>Posiciones finales</h2>
                <ul id="finalPlayers"></ul>
            `;

			players.sort((a, b) => b.score - a.score);

			let playersList = '';
			players.forEach((player, index) => {
				playersList += `<li>${index + 1}. ${player.name} (${player.score} pts)</li>`;
			});

			document.getElementById('finalPlayers').innerHTML = playersList;
		} else {
			console.log('Esperando datos del ganador y jugadores.');
		}
	}

	app.innerHTML = '<p>Cargando resultados...</p>';

	//socket.emit('getWinnerData');

	socket.on('announceWinner', (data) => {
		console.log('Datos recibidos en Screen2:', data); // Verificar datos
		if (data && data.winner) {
			winner = data.winner;
			players = data.players;
			renderWinnerScreen();
		} else {
			console.log('No se recibieron datos del ganador o no hay un ganador.');
		}
	});
}
