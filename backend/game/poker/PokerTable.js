const poker = require('poker');

var tableId;
var players = [];
var table;

const setupTable = (tableId) => {
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

    //TODO refund tokens
}
