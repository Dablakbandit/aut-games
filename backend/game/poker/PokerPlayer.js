const PokerTable = require('./PokerTable');

// activeTables stores an array of all active poker tables
global.activeTables = {};

class PokerPlayer {
	constructor(socketio, gameSocket) {
		this.socketio = socketio;
		this.gameSocket = gameSocket;
		this.currentTable = null;
		this.currentSeat = -1;

		// Run code when the client disconnects from their socket session.
		gameSocket.on('disconnect', this.disconnectFromTable);

		// User creates new poker table
		gameSocket.on('createTable', this.createTable);

		// User wants to join an active table
		gameSocket.on('joinTable', this.joinActiveTable);

		// User wants to sit at active table
		gameSocket.on('sitTable', this.sitTable);

		this.setupVideoChat();
	}

	setupVideoChat = () => {
		this.gameSocket.on('callTable', (data) => {
			this.socketio.to(data.userCalling).emit('callIncoming', {
				signal: data.signalData,
				from: data.from,
			});
		});

		this.gameSocket.on('callAccepted', (data) => {
			this.socketio.to(data.userCalling).emit('callAccepted', data.signal);
		});
	};

	joinActiveTable = (data) => {
		// Look up the room ID in the Socket.IO manager object.
		var tableRoom = this.socketio.sockets.adapter.rooms[data.tableId];

		// Fetch active table
		var table = activeTables[data.tableId];

		// If the room and table doesnt exist
		if (tableRoom === undefined || table == undefined) {
			this.gameSocket.emit('status', 'Unknown poker table');
			return;
		}

		// Check table constriants
		if (tableRoom.length < 2 && table.players.length < 2) {
			// Attach the socket id to the data object.
			data.mySocketId = this.id;

			// Join the room
			this.gameSocket.join(data.tableId);

			// Start betting when two players have sat down
			if (table.length === 2) {
				this.socketio.sockets.in(data.tableId).emit('startSomething', idData.userName);
			}

			// Emit an event notifying the clients that the player has joined the room.
			this.socketio.sockets.in(data.tableId).emit('playerJoinTable', data);

			// Set the current table
			this.currentTable = table;
		} else {
			// Otherwise, send an error message back to the player.
			this.gameSocket.emit('status', 'Unable to join active table.');
		}
	};

	sitTable = (data) => {
		if (!isNaN(data.chips) && this.currentTable) {
			this.currentSeat = this.currentTable.sit(this, data.chips);
			this.gameSocket.emit('currentSeat', { currentSeat: currentSeat });
			if (currentSeat != -1) {
				this.socketio.sockets.in(this.currentTable.tableId).emit('playerSitDown', {
					seatId: currentSeat,
					chips: data.chips,
				});
			}
		}
	};

	createTable = (data) => {
		var tableId = data.tableId;

		if (activeTables[tableId]) {
			this.gameSocket.emit('status', 'Poker table already exists');
			return;
		}

		// Return the Table ID and the socket ID to the sender
		this.gameSocket.emit('createTable', {
			tableId: tableId,
			mySocketId: this.gameSocket.id,
		});

		// Join the socket room
		this.gameSocket.join(tableId);

		// Create table object
		var newTable = new PokerTable(this.socketio, tableId);
		// Update active tables
		activeTables[tableId] = newTable;

		// Set the current table
		this.currentTable = newTable;
	};

	disconnectFromTable = () => {
		if (this.currentTable) {
			var { players } = this.currentTable;
			this.currentTable.leaveTable(this);
			if (players.length == 0) {
				delete activeTables[currentTable.tableId];
			}
		}

		// Cleanup
		this.currentTable = null;
		this.currentSeat = -1;
	};
}

module.exports = PokerPlayer;
