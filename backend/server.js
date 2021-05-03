const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
var cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/error');
const matchingRoutes = require('./routes/matchingRoutes');

const app = express();

dotenv.config();
connectDB();
// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

//ROUTES
// app.use('/api/articles', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchingRoutes);

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

const port = process.env.PORT || 5000;

app.listen(port, console.log('Server is running on the port 8000'));
