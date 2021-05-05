const poker = require('poker');
const PokerPlayer = require('./PokerPlayer');

// Set current max seats to allow upgrade-ability
const maxSeats = 2;

// Class object to hold a poker table
class PokerTable {
	// Construct with the socket connection and unique tableId
	constructor(socketio, tableId) {
		// Assign default variables
		this.socketio = socketio;
		this.tableId = tableId;
		this.players = [];

		// Construct new poker table
		this.table = new poker.Table({
			ante: 0,
			smallBlind: 10,
			bigBlind: 20,
		});
	}

	/**
	 * 	Join the current poker table
	 *
	 * 	@param {PokerPlayer} pokerPlayer - The player wishing to join
	 * 	@returns {boolean} if successfully joined table
	 */
	joinTable = (pokerPlayer) => {
		if (this.players.length < maxSeats) {
			this.players.push(pokerPlayer);
			return true;
		}
		return false;
	};

	/**
	 * Update all connected players regarding the state of the game
	 * Provides:
	 * seat information
	 * 	if(hand in progress)
	 *	card information
	 *	round information
	 *	community information
	 *	pot information
	 *	if(betting round in progress)
	 * 	active player
	 * 	button location
	 */
	updatePlayers = () => {
		var { table, socketio } = this;

		// Initialize table data with seat information
		var tableData = {
			seats: table.seats(),
		};

		this.players.forEach((player) => {
			if (player.currentSeat !== undefined && player.user) {
				tableData.seats[player.currentSeat].name = player.user.name;
				tableData.seats[player.currentSeat].image = player.user.image;
			}
		});

		// Check for current hand in progress
		if (table.isHandInProgress()) {
			// Assign table hand information
			tableData['cards'] = table.holeCards();
			tableData['round'] = table.roundOfBetting();
			tableData['community'] = table.communityCards();
			tableData['pot'] = table.pots()[0].size;

			// Check for current betting round in progress
			if (table.isBettingRoundInProgress()) {
				// Assign betting round information
				tableData['active'] = table.playerToAct();
				tableData['button'] = table.button();
			}
		}

		// Emit tableData to each connected player
		socketio.sockets.in(this.tableId).emit('tableData', tableData);
	};

	/**
	 * Check all table conditions then update all players accordingly.
	 *
	 */
	checkAndUpdate = () => {
		var { table } = this;

		// Check for current hand in progress
		if (table.isHandInProgress()) {
			// If betting has completed and round is incomplete
			if (!table.areBettingRoundsCompleted() && !table.isBettingRoundInProgress()) {
				console.log('Ending betting round');
				table.endBettingRound();
			}
			// If game is no longer valid or complete
			if (table.areBettingRoundsCompleted()) {
				console.log('Showdown');
				table.showdown();

				// Attempt to restart game
				setTimeout(this.attemptStart, 15 * 1000);
			}
		}
		// Update players
		this.updatePlayers();
	};

	/**
	 * 	Get the first available seat
	 *
	 * 	@returns {number} seat number or -1 if none available
	 */
	getFreeSeat = () => {
		var { table } = this;
		// Get seat information
		var seats = table.seats();
		// For each seat
		for (var seat = 0; seat < maxSeats; seat++) {
			// If seat is empty
			if (seats[seat] === null) {
				// Return seat
				return seat;
			}
		}
		return -1;
	};

	/**
	 * Sit a player down at the table with buy in chip amount
	 * 	@param {PokerPlayer} pokerPlayer - The player wishing to join
	 * 	@param {number} chips - The amount of chips to buy in
	 * 	@returns {number} seat number or -1 if none available
	 */
	sit = (pokerPlayer, chips) => {
		var { table } = this;

		// Get the first available seat
		var seat = this.getFreeSeat();

		// If seat is valid
		if (seat != -1) {
			// Sit down at table with chips
			table.sitDown(seat, chips);
		}

		// Emit current seat back to the player
		pokerPlayer.gameSocket.emit('currentSeat', {
			currentSeat: seat,
			forced: table.forcedBets(),
		});
		return seat;
	};

	/**
	 * Attempt to start the table for all players
	 *
	 */
	attemptStart = () => {
		var { table } = this;
		// If the table is already in progress
		if (!table.isHandInProgress()) {
			// Get all seat information
			var seats = this.table.seats();
			// Filter non null seats
			const activeSeats = seats.filter((el) => el !== null);

			// If we have 2 players
			if (activeSeats.length == 2) {
				//Start table
				console.log('Starting hand');
				table.startHand();
			}
		}

		// Check conditions and update players
		this.checkAndUpdate();
	};

	/**
	 * Attempt to leave the table
	 * 	@param {PokerPlayer} pokerPlayer - The player wishing to leave this table
	 */
	leaveTable = (pokerPlayer) => {
		// Get index of player
		var i = this.players.indexOf(pokerPlayer);
		// Remove from index
		this.players.splice(i, 1);

		// If they are currently sitting
		if (pokerPlayer.currentSeat !== undefined) {
			// Get all seat information
			var seats = this.table.seats();
			// Get current seat information
			var { stackSize } = seats[pokerPlayer.currentSeat];

			// Stand up from the table
			this.table.standUp(pokerPlayer.currentSeat);

			// TODO refund
			pokerPlayer.user.chips += stackSize;
			pokerPlayer.user.save();
			console.log('Refund ' + stackSize);

			// Emit player leave to all players
			this.socketio.sockets
				.in(this.tableId)
				.emit('playerLeaveTable', pokerPlayer.currentSeat);

			// Check conditions and update players
			this.checkAndUpdate();
		}
	};

	/**
	 * Perform an action with the current player
	 * @param {string} action - Action to perform
	 * @param {betSize} [betSize] - Chip amount if an aggressive action
	 */
	actionTable = (action, betSize) => {
		var { table } = this;
		try {
			if (betSize) {
				table.actionTaken(action, betSize);
			} else {
				table.actionTaken(action);
			}
			this.checkAndUpdate();
		} catch (e) {
			console.log(e);
		}
	};
}

// Export class
module.exports = PokerTable;
