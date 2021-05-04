const pokerTable = require('./PokerTable');

// activeTables stores an array of all active poker tables
global.activeTables = {};

var socketio;
var gameSocket;
var currentTable;
var currentSeat = -1;

const setupSocket = (socketio, socket) => {
    this.socketio = socketio;
    this.gameSocket = socket;

    // Run code when the client disconnects from their socket session.
    gameSocket.on('disconnect', onDisconnect);

    // User creates new poker table
    gameSocket.on('createTable', createTable);

    // User wants to join an active table
    gameSocket.on('joinTable', joinActiveTable);

    // User wants to sit at active table
    gameSocket.on('sitTable', sitTable);

    setupVideoChat();
};

function setupVideoChat() {
    gameSocket.on('callTable', (data) => {
        io.to(data.userCalling).emit('callIncoming', {
            signal: data.signalData,
            from: data.from,
        });
    });

    gameSocket.on('callAccepted', (data) => {
        io.to(data.userCalling).emit('callAccepted', data.signal);
    });
}

function joinActiveTable(data) {
    // Look up the room ID in the Socket.IO manager object.
    var tableRoom = socketio.sockets.adapter.rooms[data.tableId];

    // Fetch active table
    var table = activeTables[data.tableId];

    // If the room and table doesnt exist
    if (tableRoom === undefined || table == undefined) {
        this.emit('status', 'Unknown poker table');
        return;
    }

    // Check table constriants
    if (tableRoom.length < 2 && table.players.length < 2) {
        // Attach the socket id to the data object.
        data.mySocketId = this.id;

        // Join the room
        this.join(data.tableId);

        // Start betting when two players have sat down
        if (table.length === 2) {
            socketio.sockets
                .in(data.tableId)
                .emit('startSomething', idData.userName);
        }

        // Emit an event notifying the clients that the player has joined the room.
        socketio.sockets.in(data.tableId).emit('playerJoinedTable', data);
    } else {
        // Otherwise, send an error message back to the player.
        this.emit('status', 'Unable to join active table.');
    }
}

function createTable(data) {
    var tableId = data.tableId;

    if (activeTables[tableId]) {
        this.emit('status', 'Poker table already exists');
        return;
    }

    // Return the Table ID and the socket ID to the sender
    this.emit('createTable', { tableId: tableId, mySocketId: this.id });

    // Join the socket room
    this.join(tableId);

    // Create table object
    var newTable = pokerTable.createTable(tableId);
    // Update active tables
    activeTables[tableId] = newTable;

    // Set the current table
    this.currentTable = newTable;
}

function disconnectFromTable() {
    if (currentTable) {
        currentTable.leaveTable(this);
        if (currrentTable.players.length == 0) {
            delete activeTables[currentTable.tableId];
        }
    }

    // Cleanup
    currentTable = null;
    currentSeat = -1;
}
