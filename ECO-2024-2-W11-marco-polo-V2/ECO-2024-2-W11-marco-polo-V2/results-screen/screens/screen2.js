import { socket, router } from '../routes.js';

export default function renderScreen2() {
	const app = document.getElementById('app');
	app.innerHTML = `
    <h1>There is a winner!</h1>
    <p id="winnerMessage"></p>
		<div id="container">
    <h2>Final Ranking</h2>
    <ul id="finalPlayers"></ul>
    <button id="sortAlphabeticallyBtn">Sort Alphabetically</button>
		</div>
  `;

	// Solicitar datos del ganador y los jugadores al servidor
	socket.emit('getWinnerData');

	// Escuchar el evento 'announceWinner' para recibir los datos del ganador y jugadores
	socket.on('announceWinner', (data) => {
		const { winner, players } = data;

		// Mostrar el mensaje del ganador en la screen
		document.getElementById('winnerMessage').textContent = `The winner is ${winner}!`;

		// Ordenar los jugadores por puntuación de mayor a menor y renderizarlos
		renderPlayers(players);
	});

	// Función para renderizar la lista de jugadores
	function renderPlayers(players) {
		// Ordenar por puntuación de mayor a menor
		players.sort((a, b) => b.score - a.score);

		// Crear la lista de posiciones con los jugadores
		let playersList = '';
		players.forEach((player, index) => {
			playersList += `<li>${index + 1}. ${player.name} (${player.score} pts)</li>`;
		});

		// Renderizar la lista de jugadores en el HTML
		document.getElementById('finalPlayers').innerHTML = playersList;
	}

	// Agregar evento para el botón "Ordenar alfabéticamente"
	document.getElementById('sortAlphabeticallyBtn').addEventListener('click', () => {
		// Obtener la lista actual de jugadores
		const playersListElement = document.getElementById('finalPlayers');
		const playersItems = Array.from(playersListElement.getElementsByTagName('li'));

		// Ordenar alfabéticamente
		playersItems.sort((a, b) => {
			const nameA = a.textContent.split('.')[1].trim(); // Obtener el nombre
			const nameB = b.textContent.split('.')[1].trim(); // Obtener el nombre
			return nameA.localeCompare(nameB); // Comparar alfabéticamente
		});

		// Limpiar la lista y agregar los elementos ordenados
		playersListElement.innerHTML = '';
		playersItems.forEach((item) => playersListElement.appendChild(item));
	});

	socket.on('gameRestarted', (data) => {
		console.log(data.message);
		router.navigateTo('/');
	});
}
