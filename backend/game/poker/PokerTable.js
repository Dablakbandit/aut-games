const poker = require('poker');
const maxSeats = 2;

//table.holeCards();
class PokerTable {
	constructor(socketio, tableId) {
		this.socketio = socketio;
		this.tableId = tableId;
		this.players = [];
		this.table = new poker.Table({
			ante: 0,
			smallBlind: 10,
			bigBlind: 20,
		});
	}

	joinTable = (pokerPlayer) => {
		this.players.push(pokerPlayer);
	};

	updatePlayers = () => {
		var { table, socketio } = this;
		var tableData = {
			seats: table.seats(),
		};
		if (table.isHandInProgress()) {
			tableData['cards'] = table.holeCards();
			tableData['round'] = table.roundOfBetting();
			tableData['community'] = table.communityCards();
			if (table.isBettingRoundInProgress()) {
				tableData['active'] = table.playerToAct();
				tableData['button'] = table.button();
			}
		}
		socketio.sockets.in(this.tableId).emit('tableData', tableData);
	};

	checkAndUpdate = () => {
		var { table } = this;
		if (!table.areBettingRoundsCompleted() && !table.isBettingRoundInProgress()) {
			table.endBettingRound();
		}
		if (table.areBettingRoundsCompleted()) {
			table.showdown();
		}
		this.updatePlayers();
	};

	sit = (pokerPlayer, chips) => {
		var { table, socketio } = this;
		var seats = table.seats();
		var sit = -1;
		for (var seat = 0; seat < maxSeats; seat++) {
			if (seats[seat] === null) {
				sit = seat;
				table.sitDown(seat, chips);
			}
		}
		this.attemptStart();
		return sit;
	};

	attemptStart = () => {
		var { table } = this;
		var seats = this.table.seats();
		var activeSeats = 0;
		for (var seat = 0; seat < maxSeats; seat++) {
			if (seats[seat] === null) {
				activeSeats++;
			} else {
				activeSeats++;
			}
		}
		if (activeSeats == 2) {
			table.startHand();
			this.checkAndUpdate();
		}
	};

	leaveTable = (pokerPlayer) => {
		var i = this.players.indexOf(pokerPlayer);
		this.players.splice(i, 1);
		if (pokerPlayer.currentSeat) {
			//TODO check if current action?
			this.table.standUp(pokerPlayer.currentSeat);
			this.socketio.sockets
				.in(this.tableId)
				.emit('playerLeaveTable', pokerPlayer.currentSeat);
		}
		//TODO refund tokens
	};

	fold = (pokerPlayer) => {
		if (table.isBettingRoundInProgress() && table.playerToAct() == pokerPlayer.currentSeat) {
			table.actionTaken('fold');
		}
	};

	check = (pokerPlayer) => {
		if (table.isBettingRoundInProgress() && table.playerToAct() == pokerPlayer.currentSeat) {
			table.actionTaken('fold');
		}
	};

	call = (pokerPlayer) => {
		if (table.isBettingRoundInProgress() && table.playerToAct() == pokerPlayer.currentSeat) {
			table.actionTaken('call');
		}
	};

	raise = (pokerPlayer, rait) => {
		if (table.isBettingRoundInProgress() && table.playerToAct() == pokerPlayer.currentSeat) {
			table.actionTaken('raise', raise);
		}
	};

	bet = (pokerPlayer, bet) => {
		if (table.isBettingRoundInProgress() && table.playerToAct() == pokerPlayer.currentSeat) {
			table.actionTaken('fold', bet);
		}
	};
}

module.exports = PokerTable;
