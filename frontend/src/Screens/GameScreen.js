import React, { useState, useEffect } from 'react';
import { pokerPlayers, mainPlayer } from '../data';
import { Card, Button, Row, Col, FormControl, InputGroup } from 'react-bootstrap';
import { socket } from '../socket';

const backgroundStyle = {
	background: 'url("../img/table.jpg")',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	height: '100vh',
};

const imgStyle = {
	maxHeight: '150px',
	// display: 'block',
	objectFit: 'contain',
};

const activeCard = {
	width: '12rem',
	border: 'solid 3px black',
	backgroundColor: '#ff4d4d',
};

const textStyle = {
	fontSize: '0.8rem',
};
const GameScreen = ({ history, match }) => {
	const gameId = match.params.gameId;
	const [players, setPlayers] = useState([]);
	const [self, setSelf] = useState({});
	const [amount, setAmount] = useState(0);
	const [table, setTable] = useState({});

	// const data = socket.on('tableData');

	useEffect(() => {
		// if (gameId) {
		// 	alert('game id is ' + gameId);
		// }

		socket.on('tableData', (data) => {
			console.log(data);
		});

		setPlayers(pokerPlayers);
		setSelf(mainPlayer);

		console.log(self.numberOfChips);
		console.log(self);

		if (self) socket.emit('sitTable', { chips: self.numberOfChips });
	}, [self]);

	const handleLeave = () => {
		// socket.emit('createTable', { tableId: id });
	};
	const handleFold = () => {};
	const handleCheck = () => {};
	const handleCall = () => {};

	const handleBet = () => {};
	const handleRaise = () => {};

	return (
		<div style={backgroundStyle}>
			<Row className="d-flex mt-auto justify-content-around fixed-bottom">
				{players.map((player) => (
					<div key={player.name}>
						<div className="d-flex justify-content-center">
							<img
								className="playingCard"
								alt="card"
								src="../img/cards/BLUE_BACK.svg"
							/>
							<img
								className="playingCard"
								alt="card"
								src="../img/cards/BLUE_BACK.svg"
							/>
						</div>
						<Card style={player.isActive ? activeCard : { width: '12rem' }}>
							<Card.Img style={imgStyle} variant="top" src="../img/dices.png" />
							<Card.Body>
								<Card.Title style={textStyle}>Name: {player.name}</Card.Title>
								<Card.Text style={textStyle}>
									Number of chips: {player.numberOfChips}
								</Card.Text>
								{console.log(player.name + self.name)}
							</Card.Body>
						</Card>
					</div>
				))}
			</Row>
			<Row>
				<Col
					md={2}
					className="d-flex justify-content-center mt-5 flex-column"
					style={{ zIndex: 1031 }}
				>
					<Button className="ml-5 mt-5 " variant="danger">
						Leave
					</Button>
					<Button className="ml-5  my-3" variant="primary">
						Fold
					</Button>
					<Button className="ml-5" variant="primary">
						Check
					</Button>
					<Button className="ml-5 my-3" variant="primary">
						Call
					</Button>
					<Button className="ml-5" variant="primary">
						Raise
					</Button>
					<Button className="ml-5  my-3" variant="primary">
						Bet
					</Button>
					<InputGroup>
						<FormControl
							type="number"
							placeholder="Amount"
							aria-label="Username"
							className="ml-5"
							onChange={(e) => setAmount(e.target.value)}
							value={amount}
						/>
					</InputGroup>
				</Col>

				<Col md={8} className="d-flex align-items-center justify-content-center mt-5">
					<div className="d-flex mt-5 justify-content-around w-75">
						<img className="playingCard" alt="card" src="../img/cards/BLUE_BACK.svg" />

						<div className="d-flex justify-content-around w-75">
							<img className="playingCard" alt="card" src="../img/cards/KS.svg" />
							<img className="playingCard" alt="card" src="../img/cards/KS.svg" />
							<img className="playingCard" alt="card" src="../img/cards/KS.svg" />
							<img className="playingCard" alt="card" src="../img/cards/KS.svg" />
							<img className="playingCard" alt="card" src="../img/cards/KS.svg" />
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default GameScreen;
