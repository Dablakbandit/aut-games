const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
var cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/error');
const http = require('http');
const socketio = require('socket.io');
const poker = require('poker');

const app = express();
const httpServer = http.createServer(app);
const socketServer = socketio(httpServer, {
    cors: {
        origin: '*',
    },
});

dotenv.config();
//connectDB();
// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

//ROUTES
// app.use('/api/articles', bookRoutes);
app.use('/api/users', userRoutes);

//Check production or dev
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(path.resolve(), '/frontend/build')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve('frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('Hello fellow HACKATHON the app is running yaay!!!!');
    });
}

app.use(notFound);

app.use(errorHandler);

socketServer.on('connection', (socket) => {
    socket.on('test', function (msg) {
        const table = new poker.Table({
            ante: 0,
            smallBlind: 10,
            bigBlind: 20,
            seats: 2,
        });
        table.sitDown(0, 1000); // seat a player at seat 0 with 1000 chips buy-in
        table.sitDown(1, 1500); // seat a player at seat 2 with 1500 chips buy-in
        table.startHand();
        console.log(table.handPlayers());
        console.log(table.holeCards());
        table.actionTaken('bet', 20);
        table.actionTaken('check');
        table.endBettingRound();
        console.log(table.pots());

        table.actionTaken('check');
        table.actionTaken('check');
        table.endBettingRound();

        table.actionTaken('check');
        table.actionTaken('check');
        table.endBettingRound();

        table.actionTaken('check');
        table.actionTaken('check');
        table.endBettingRound();
        table.showdown();

        table.startHand();

        console.log(table.seats());
        table.actionTaken('call');
        table.actionTaken('check');
        console.log(table);
    });
});

const port = process.env.PORT || 5000;

httpServer.listen(port, console.log(`Server is running on the port ${port}`));
