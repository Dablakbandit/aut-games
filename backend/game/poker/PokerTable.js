const poker = require('poker');
const maxSeats = 2;

//table.holeCards();
class PokerTable {
	socketio;
	tableId;
	players = [];
	table;
	constructor(socketio, tableId) {
		this.socketio = socketio;
		this.tableId = tableId;
		this.table = new poker.Table({
			ante: 0,
			smallBlind: 10,
			bigBlind: 20,
		});
	}

	joinTable = (pokerPlayer) => {
		this.players.push(pokerPlayer);
	};

	leaveTable = (pokerPlayer) => {
		var i = this.players.indexOf(pokerPlayer);
		this.players.splice(i, 1);
		if (pokerPlayer.currentSeat != -1) {
			//TODO check if current action?
			this.table.standUp(pokerPlayer.currentSeat);
			this.socketio.sockets.in(tableId).emit('playerLeaveTable', pokerPlayer.currentSeat);
		}
		//TODO refund tokens
	};

	updatePlayers = () => {
		var { table, socketio } = this;
		if (table.isBettingRoundInProgress()) {
			socketio.sockets.in(tableId).emit('tableActive', { act: table.playerToAct() });
		}
		var tableData = {
			button: table.button(),
			seats: table.seats(),
			cards: table.holdCards(),
			round: table.roundOfBetting(),
			community: table.communityCards(),
		};
		socketio.sockets.in(tableId).emit('tableData', JSON.stringify(tableData));
	};

	checkRoundEnd = () => {
		var { table, socketio } = this;
		if (!table.areBettingRoundsCompleted() && !table.isBettingRoundInProgress()) {
			table.endBettingRound();
		}
	};

	checkGameEnd = () => {
		var { table, socketio } = this;
		if (table.areBettingRoundsCompleted()) {
			table.showdown();
		}
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
		return sit;
	};

	attemptStart = () => {
		var { seats, table } = this;
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
			updatePlayers();
		}
	};
}

module.exports = PokerTable;
