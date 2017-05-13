const Game = require('../models/Game');
const updateGame = require('./updateGame');

module.exports = io => {
	const lobbySocket = io.of('/lobby');
	const loadingSocket = io.of('/loading');
	const gameSocket = io.of('/game');
	lobbySocket.on('connection', socket => {
		socket.on('update game list', () => {
			socket.broadcast.emit('update game list');
		});
	});
	loadingSocket.on('connection', socket => {
        /* Join the user to the correct game room */
		socket.on('room', room => {
            // Leave room if user joins different room
			if (socket.room) {
				socket.leave(socket.room);
			}
			socket.room = room;
			socket.join(room);
		});
		socket.on('begin game', () => {
			socket.broadcast.emit('begin game');
		});
	});
	gameSocket.on('connection', socket => {
        /* Join the user to the correct game room */
		socket.on('room', room => {
            // Leave room if user joins different room
			if (socket.room) {
				socket.leave(socket.room);
			}
			socket.room = room;
			socket.join(room);
		});
		/* Update a game's moves */
		socket.on('update moves', async data => {
			try {
				await Game.updateGameMoves(data.id, data.moves);
				socket.broadcast.to(socket.room).emit('update moves', data.moves);
			} catch (err) {
				console.log(`Error while performing update moves via Socket.io: ${err}`);
			}
		});
        /* Update a game's reserve */
		socket.on('update reserve', async data => {
			try {
				await Game.updateGameReserve(data.id, data.reserve, data.pieces);
				// send to all clients in 'game' room(channel) except sender
				socket.broadcast.to(socket.room).emit('update reserve', data);
			} catch (err) {
				console.log(`Error while performing update reserve via Socket.io: ${err}`);
			}
		});
        /* Validate move and update game */
		socket.on('update game', data => {
			updateGame(data, socket, gameSocket, io);
		});
	});
};
