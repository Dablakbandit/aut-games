import React, { useState, useEffect } from 'react';
import { pokerPlayers, mainPlayer as mainPlayerSelf } from '../data';
import { Card, Button, Row, Col, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { socket } from '../socket';
import { v4 as uuidv4 } from 'uuid';

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

const getCardImgUrl = (card) => {
	return `../img/cards/${card?.rank}${card?.suit.charAt(0).toUpperCase()}.svg`;
};

const GameScreen = ({ history, match }) => {
	const gameId = match.params.gameId;
	const [players, setPlayers] = useState([]);
	const [amount, setAmount] = useState(0);
	const [mainPlayer, setMainPlayer] = useState(mainPlayerSelf);
	const [currentPlayer, setCurrentPlayer] = useState(null);
	const [modal, setModal] = useState(false);
	const [tableCards, setTableCards] = useState([]);
	const [activePlayer, setActivePlayer] = useState(null);
	// const data = socket.on('tableData');

	useEffect(() => {
		// socket.on('currentSeat', (data) => {
		// 	if (data.currentSeat === undefined) {
		// 		history.push('/profile');
		// 	} else {
		// 		console.log(data);
		// 		setCurrentPlayer(data.currentSeat);
		// 	}
		// });

		console.log('Current player is ' + currentPlayer);
		socket.on('tableData', (data) => {
			console.log(data);
			const numOfSeats = data.seats.filter((el) => el !== null);
			if (numOfSeats.length <= 1) {
				setModal(true);
			} else {
				setModal(false);
			}

			//if game started
			if (data.cards) {
				const mappedPlayers = [];

				for (var i = 0; i < numOfSeats.length; i++) {
					mappedPlayers.push({ ...data?.seats[i], ...data?.cards[i] });
				}
				console.log(mappedPlayers);
				setPlayers(mappedPlayers);
				setTableCards(data.community);
				setActivePlayer(data.active);
			}
		});

		socket.emit('sitTable', { chips: mainPlayer.numberOfChips });
	}, [mainPlayer, history]);

	const handleLeave = () => {
		socket.emit('leaveTable');
	};
	const handleFold = () => {
		socket.emit('foldTable');
	};
	const handleCheck = () => {
		socket.emit('checkTable');
	};
	const handleCall = () => {
		socket.emit('callTable');
	};

	const handleBet = () => {
		if (amount > 0) {
			socket.emit('betTable', { bet: amount });
			setAmount(0);
		}
	};
	const handleRaise = () => {
		if (amount > 0) {
			socket.emit('raiseTable', { raise: amount });
			setAmount(0);
		}
	};

	const disableCheck = () => {
		if (players[currentPlayer] === undefined) {
			return true;
		}
		var { betSize } = players[currentPlayer];
		var maxBetSize = Math.max.apply(
			Math,
			players.filter((seat) => seat !== null).map((seat) => seat?.betSize)
		);
		return betSize !== maxBetSize;
	};

	return (
		<div style={backgroundStyle}>
			<Modal show={modal} onHide={() => {}}>
				<Modal.Header>
					<Modal.Title>Invite players</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ fontSize: '1rem', textAlign: 'center' }}>
					Please send this:
					<div className="d-flex align-items-center justify-content-center">
						<strong>{gameId}</strong>
						<img
							onClick={() => {
								window.navigator.clipboard.writeText(gameId);
							}}
							style={{ cursor: 'pointer' }}
							src="../img/clipboard.png"
							id="clipboard"
							alt="clipboard"
						/>
					</div>
					to your friends.
				</Modal.Body>
			</Modal>
			<Row className="d-flex mt-auto justify-content-around fixed-bottom">
				{players.map((player, index) => (
					<div key={index}>
						<div className="d-flex justify-content-center">
							<img
								className="playingCard"
								alt="card"
								// src="../img/cards/BLUE_BACK.svg"
								src={
									currentPlayer === index
										? getCardImgUrl(player.first)
										: '../img/cards/BLUE_BACK.svg'
								}
							/>
							<img
								className="playingCard"
								alt="card"
								// src="../img/cards/BLUE_BACK.svg"
								src={
									currentPlayer === index
										? getCardImgUrl(player.second)
										: '../img/cards/BLUE_BACK.svg'
								}
							/>
						</div>
						<Card style={activePlayer === index ? activeCard : { width: '12rem' }}>
							<Card.Img style={imgStyle} variant="top" src="../img/dices.png" />
							<Card.Body>
								{/* CHANGE INDEX TO NAME */}
								<Card.Title style={textStyle}>Name: {index}</Card.Title>
								<Card.Text style={textStyle}>
									Stack:
									<img
										className="chipsImage"
										src="../img/chips.svg"
										alt="stack"
									/>
									{player.stackSize}
									<br />
									Bet Size:
									<img className="chipsImage" src="../img/bet.svg" alt="stack" />
									{player.betSize}
								</Card.Text>
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
					<Button onClick={handleLeave} className="ml-5 mt-5 " variant="danger">
						Leave
					</Button>
					<Button
						onClick={handleFold}
						disabled={currentPlayer !== activePlayer}
						className="ml-5  my-3"
						variant="primary"
					>
						Fold
					</Button>
					<Button
						onClick={handleCheck}
						disabled={currentPlayer !== activePlayer || disableCheck()}
						className="ml-5"
						variant="primary"
					>
						Check
					</Button>
					<Button
						onClick={handleCall}
						disabled={currentPlayer !== activePlayer}
						className="ml-5 my-3"
						variant="primary"
					>
						Call
					</Button>
					<Button
						onClick={handleRaise}
						disabled={currentPlayer !== activePlayer}
						className="ml-5"
						variant="primary"
					>
						Raise
					</Button>
					<Button
						onClick={handleBet}
						disabled={currentPlayer !== activePlayer}
						className="ml-5  my-3"
						variant="primary"
					>
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
							{tableCards.map((card, index) => (
								<img
									key={index}
									className="playingCard"
									alt="card"
									src={getCardImgUrl(card)}
								/>
							))}
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default GameScreen;
