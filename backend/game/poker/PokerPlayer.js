const PokerTable = require('./PokerTable');

// activeTables stores an array of all active poker tables
global.activeTables = {};

class PokerPlayer {
	constructor(socketio, gameSocket) {
		this.socketio = socketio;
		this.gameSocket = gameSocket;
		this.currentTable = undefined;
		this.currentSeat = undefined;

		// Run code when the client disconnects from their socket session.
		gameSocket.on('disconnect', this.disconnectFromTable);
		gameSocket.on('leaveTable', this.disconnectFromTable);

		// User creates new poker table
		gameSocket.on('createTable', this.createTable);

		// User wants to join an active table
		gameSocket.on('joinTable', this.joinActiveTable);

		// User wants to sit at active table
		gameSocket.on('sitTable', this.sitTable);

		// User wants to sit at active table
		gameSocket.on('foldTable', this.foldTable);

		// User wants to sit at active table
		gameSocket.on('checkTable', this.checkTable);

		// User wants to sit at active table
		gameSocket.on('callTable', this.callTable);

		// User wants to sit at active table
		gameSocket.on('raiseTable', this.raiseTable);

		// User wants to sit at active table
		gameSocket.on('betTable', this.betTable);

		this.setupVideoChat();
	}

	setupVideoChat = () => {
		this.gameSocket.on('videoCallTable', (data) => {
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
		var { tableId } = data;
		// Look up the room ID in the Socket.IO manager object.
		var tableRoom = this.socketio.sockets.adapter.rooms.get(tableId);

		// Fetch active table
		var table = activeTables[tableId];

		// If the room and table doesnt exist
		if (tableRoom === undefined || table === undefined) {
			this.gameSocket.emit('status', 'Unknown poker table');
			return;
		}

		// Check table constriants
		if (tableRoom.size < 2 && table.players.length < 2) {
			// Attach the socket id to the data object.
			data.mySocketId = this.id;
			// Join the room
			this.gameSocket.join(tableId);

			// Start betting when two players have sat down
			if (table.length === 2) {
				this.socketio.sockets.in(data.tableId).emit('startSomething', idData.userName);
			}

			// Emit an event notifying the clients that the player has joined the room.
			this.socketio.sockets.in(data.tableId).emit('playerJoinTable', data);

			// Set the current table
			table.joinTable(this);
			table.updatePlayers();
			this.currentTable = table;
		} else {
			// Otherwise, send an error message back to the player.
			this.gameSocket.emit('status', 'Unable to join active table.');
		}
	};

	sitTable = (data) => {
		if (!isNaN(data.chips) && this.currentTable) {
			this.currentSeat = this.currentTable.sit(this, data.chips);
		} else {
			this.gameSocket.emit('currentSeat', {});
		}

		if (this.currentSeat) {
			this.socketio.sockets.in(this.currentTable.tableId).emit('playerSitDown', {
				seatId: this.currentSeat,
				chips: data.chips,
			});
		}
	};

	foldTable = () => {
		if (this.currentTable && this.currentSeat != undefined) {
			this.currentTable.actionTable(this, 'fold');
		}
	};

	checkTable = () => {
		if (this.currentTable && this.currentSeat != undefined) {
			this.currentTable.actionTable(this, 'check');
		}
	};

	callTable = () => {
		if (this.currentTable && this.currentSeat != undefined) {
			this.currentTable.actionTable(this, 'call');
		}
	};

	raiseTable = (data) => {
		if (this.currentTable && this.currentSeat != undefined && !isNaN(data.raise)) {
			this.currentTable.actionTable(this, 'raise', data.raise);
		}
	};

	betTable = (data) => {
		if (this.currentTable && this.currentSeat != undefined && !isNaN(data.bet)) {
			this.currentTable.actionTable(this, 'bet', data.bet);
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
		newTable.joinTable(this);
		newTable.updatePlayers();
		this.currentTable = newTable;
	};

	disconnectFromTable = () => {
		console.log('Disconnect' + this.currentSeat);
		if (this.currentTable) {
			this.gameSocket.leave(this.currentTable.tableId);
			var { players } = this.currentTable;
			this.currentTable.leaveTable(this);
			if (players.length === 0) {
				delete activeTables[this.currentTable.tableId];
			}
		}

		// Cleanup
		this.currentTable = undefined;
		this.currentSeat = undefined;
		this.gameSocket.emit('currentSeat', {});
	};
}

module.exports = PokerPlayer;
