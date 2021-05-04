const poker = require('poker');
const maxSeats = 2;

//table.holeCards();

var socketio;
var tableId;
var players = [];
var table;

const setupTable = (socketio, tableId) => {
    this.socketio = socketio;
    this.tableId = tableId;
    this.table = new poker.Table({
        ante: 0,
        smallBlind: 10,
        bigBlind: 20,
    });
};

function joinTable(pokerPlayer) {
    this.players.push(pokerPlayer);
}

function leaveTable(pokerPlayer) {
    var i = players.indexOf(pokerPlayer);
    players.splice(i, 1);
    if (pokerPlayer.currentSeat != -1) {
        //TODO check if current action?
        table.standUp(pokerPlayer.currentSeat);
        socketio.sockets.in(tableId).emit('playerLeaveTable', pokerPlayer.currentSeat);
    }
    //TODO refund tokens
}

function updatePlayers() {
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
}

function checkRoundEnd() {
    if (!table.areBettingRoundsCompleted() && !table.isBettingRoundInProgress()) {
        table.endBettingRound();
    }
}

function checkGameEnd() {
    if (table.areBettingRoundsCompleted()) {
        table.showdown();
    }
}

function sit(pokerPlayer, chips) {
    var seats = table.seats();
    var sit = -1;
    for (var seat = 0; seat < maxSeats; seat++) {
        if (seats[seat] === null) {
            sit = seat;
            table.sitDown(seat, chips);
        }
    }
    return sit;
}

function attemptStart() {
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
}
