const PokerTable = require('./PokerTable');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// activeTables store an array of all active poker tables
global.activeTables = {};

class PokerPlayer {
	constructor(socketio, gameSocket) {
		this.socketio = socketio;
		this.gameSocket = gameSocket;
		this.currentTable = undefined;
		this.currentSeat = undefined;
		this.user = undefined;

		// Remove player from table on disconnect or button press
		gameSocket.on('disconnect', this.disconnectFromTable);
		gameSocket.on('leaveTable', this.disconnectFromTable);

		// Player creates new poker table
		gameSocket.on('createTable', this.createTable);

		// Player wants to join an active table
		gameSocket.on('joinTable', this.joinActiveTable);

		// Player wants to sit at active table
		gameSocket.on('sitTable', this.sitTable);

		// Player wants to fold at active table
		gameSocket.on('foldTable', this.foldTable);

		// Player wants to check at active table
		gameSocket.on('checkTable', this.checkTable);

		// Player wants to call at active table
		gameSocket.on('callTable', this.callTable);

		// Player wants to raise at active table
		gameSocket.on('raiseTable', this.raiseTable);

		// Player wants to bet at active table
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

	// TABLE SETUP //

	/**
	 * 	Join an active poker table
	 *
	 * 	@param  {Object} data - Data passed from the socket
	 * 	@param  {string} data.tableId - Tableid of the table attempting to join
	 */
	joinActiveTable = (data) => {
		// Disconnect from any active table
		this.disconnectFromTable();
		var { tableId } = data;

		// Look up the room ID in the Socket.IO
		var tableRoom = this.socketio.sockets.adapter.rooms.get(tableId);

		// Fetch active table from storage
		var table = activeTables[tableId];

		// If the room or table doesnt exist
		if (tableRoom === undefined || table === undefined) {
			this.gameSocket.emit('status', 'Unknown poker table');
			return;
		}

		// If able to join the table
		if (table.joinTable(this)) {
			// Attach the socket id to the data object.
			data.mySocketId = this.id;
			// Join the room
			this.gameSocket.join(tableId);

			// Emit an event notifying the clients that the player has joined the room.
			this.socketio.sockets.in(data.tableId).emit('playerJoinTable', data);

			// Set the current table
			table.updatePlayers();
			this.currentTable = table;
		} else {
			// Otherwise, send an error message back to the player.
			this.gameSocket.emit('status', 'Unable to join active table.');
		}
	};

	/**
	 * 	Create and join a new poker table
	 *
	 * 	@param  {Object} data - Data passed from the socket
	 * 	@param  {string} data.tableId - Tableid of the table attempting to create
	 */
	createTable = (data) => {
		// Disconnect from any active table
		this.disconnectFromTable();
		var tableId = data.tableId;

		// If table already exists
		if (activeTables[tableId]) {
			// Emit event to notify player table already exists
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
		// Insert into active tables
		activeTables[tableId] = newTable;
	};

	/**
	 * 	Sit the player at the current table with predefined chip amount
	 *
	 * 	@param  {Object} data - Data passed from the socket
	 * 	@param  {string} data.token - Token of the user
	 */
	sitTable = async (data) => {
		// If token is set and has current table
		if (data.token && this.currentTable) {
			var token = data.token;

			// Check token validity
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			this.user = await User.findById(decoded.id).select('-password');
			console.log(this.user);

			// Get users chips
			var { chips } = this.user;

			if (chips === undefined || chips === 0) {
				// Unable to sit down emitting empty seat redirects player
				this.disconnectFromTable();
				return;
			}
			chips = Math.min(chips, 2000);

			this.user.chips -= chips;

			await this.user.save();

			this.gameSocket.emit('chipUpdate', { chips: this.user.chips });

			// Sit down at the table and assign current seat
			this.currentSeat = this.currentTable.sit(this, chips);

			// Attempt to start the table if not currently running
			this.currentTable.attemptStart();

			console.log(this.currentSeat, this.user.name);

			// Alert all players of the player sitting down
			this.socketio.sockets.in(this.currentTable.tableId).emit('playerSitDown', {
				seatId: this.currentSeat,
				chips: chips,
			});
		} else {
			// Unable to sit down emitting empty seat redirects player
			this.gameSocket.emit('currentSeat', {});
		}
	};

	/**
	 * 	Disconnect player from the current table
	 *
	 */
	disconnectFromTable = () => {
		// If we have a current table
		if (this.currentTable) {
			// Leave the table room
			this.gameSocket.leave(this.currentTable.tableId);

			// Leave the table
			this.currentTable.leaveTable(this);

			// Get current players
			var { players } = this.currentTable;
			// If table is empty
			if (players.length === 0) {
				// Remove index of table
				delete activeTables[this.currentTable.tableId];
			}

			// Emit empty current seat redirecting user
			this.gameSocket.emit('currentSeat', {});

			// Cleanup variables
			this.currentTable = undefined;
			this.currentSeat = undefined;
		}
	};

	// TABLE ACTIONS //

	/**
	 * Fetch the maximum current bet from the table
	 * @param {Object[]} seats - Array of all seats at a table
	 */
	getMaxBet = (seats) => {
		// Filter empty seats, map to current bet size then apply Math.max
		return Math.max.apply(
			Math,
			seats.filter((seat) => seat !== null).map((seat) => seat.betSize)
		);
	};

	/**
	 * Ensure the current table is active and actions are possible
	 * @returns {boolean} if the table is valid
	 */
	ensureActiveTable = () => {
		if (this.currentTable === undefined || this.currentSeat === undefined) {
			return false;
		}
		if (!this.currentTable.table.isHandInProgress()) {
			return false;
		}
		if (!this.currentTable.table.isBettingRoundInProgress()) {
			return false;
		}
		if (this.currentTable.table.playerToAct() != this.currentSeat) {
			return false;
		}
		return true;
	};

	/**
	 * Perform the fold action on the current table
	 *
	 */
	foldTable = () => {
		if (this.ensureActiveTable()) {
			this.currentTable.actionTable('fold');
		}
	};

	/**
	 * Perform the check action on the current table
	 *
	 */
	checkTable = () => {
		if (this.ensureActiveTable()) {
			var seats = this.currentTable.table.seats();
			var { betSize } = seats[this.currentSeat];
			var maxBetSize = this.getMaxBet(seats);
			if (betSize == maxBetSize) {
				this.currentTable.actionTable('check');
			}
		}
	};

	/**
	 * Perform the call action on the current table
	 *
	 */
	callTable = () => {
		if (this.ensureActiveTable()) {
			var seats = this.currentTable.table.seats();
			var { betSize } = seats[this.currentSeat];
			var maxBetSize = this.getMaxBet(seats);
			if (betSize < maxBetSize) {
				this.currentTable.actionTable('call');
			}
		}
	};

	/**
	 * Perform the raise action on the current table
	 * 	@param  {Object} data - Data passed from the socket
	 * 	@param  {number} data.raise - Amount of chips to raise
	 */
	raiseTable = (data) => {
		if (this.ensureActiveTable() && !isNaN(data.raise)) {
			var raise = data.raise;
			var seats = this.currentTable.table.seats();
			var { totalChips } = seats[this.currentSeat];
			var maxBetSize = this.getMaxBet(seats);
			var minBet = maxBetSize + this.currentTable.table.forcedBets().bigBlind;
			if (raise >= minBet && raise <= totalChips) {
				this.currentTable.actionTable('raise', raise);
			}
		}
	};

	/**
	 * Perform the bet action on the current table
	 * 	@param  {Object} data - Data passed from the socket
	 * 	@param  {number} data.bet - Amount of chips to bet
	 */
	betTable = (data) => {
		if (this.ensureActiveTable() && !isNaN(data.bet)) {
			var bet = data.bet;

			var seats = this.currentTable.table.seats();
			var maxBetSize = this.getMaxBet(seats);
			if (maxBetSize > 0) {
				return;
			}

			var { totalChips } = seats[this.currentSeat];
			if (bet > 0 && bet < totalChips) {
				this.currentTable.actionTable('bet', bet);
			}
		}
	};
}

// Export class
module.exports = PokerPlayer;
