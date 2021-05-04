const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
var cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/error');
const http = require('http');
const socketio = require('socket.io');
const PokerPlayer = require('./game/poker/PokerPlayer');

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

	app.get('*', (req, res) => res.sendFile(path.resolve('frontend', 'build', 'index.html')));
} else {
	app.get('/', (req, res) => {
		res.send('Hello fellow HACKATHON the app is running yaay!!!!');
	});
}

app.use(notFound);

app.use(errorHandler);

socketServer.on('connection', (socket) => {
	new PokerPlayer(socketServer, socket);
});

const port = process.env.PORT || 5000;

httpServer.listen(port, console.log(`Server is running on the port ${port}`));
