const db = require("../db")
const {
  joinGameHandler,
  startGameHandler,
  notifyMarcoHandler,
  notifyPoloHandler,
  onSelectPoloHandler,
  getWinnerDataHandler,
  restartGameHandler
} = require("../event-handlers/gameHandlers")
const { assignRoles } = require("../utils/helpers")

const gameEvents = (socket, io) => {
  socket.on("joinGame", joinGameHandler(socket, db, io))

  socket.on("startGame", startGameHandler(socket, db, io))

  socket.on("notifyMarco", notifyMarcoHandler(socket, db, io))

  socket.on("notifyPolo", notifyPoloHandler(socket, db, io))

  socket.on("onSelectPolo", onSelectPoloHandler(socket, db, io))

  socket.on('getWinnerData', getWinnerDataHandler(socket, db))  //para obtener la data de la db y decidir quien es el ganador

  socket.on("restartGame", restartGameHandler(socket, db, io)); //para reiniciar los puntajes
}

module.exports = { gameEvents }
