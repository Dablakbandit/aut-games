import io from 'socket.io-client';

let URL = 'http://localhost:5000';

if (process.env.NODE_ENV === 'production') {
	URL = 'https://aut-games.herokuapp.com/';
}

const socket = io(URL);

var mySocketId;
// register preliminary event listeners here:

socket.on('createTable', (statusUpdate) => {
	console.log(
		'A new game has been created! Username: ' +
			statusUpdate.userName +
			', Game id: ' +
			statusUpdate.gameId +
			' Socket id: ' +
			statusUpdate.mySocketId
	);
	mySocketId = statusUpdate.mySocketId;
});

export { socket, mySocketId };
