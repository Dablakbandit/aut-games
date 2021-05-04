import React, { useState, useEffect, useContext } from 'react';
import { pokerPlayers, mainPlayer as mainPlayerSelf } from '../data';
import { Card, Button, Row, Col, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { socket } from '../socket';
import { UserContext } from '../UserContext';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { useLocation } from 'react-router-dom';

const backgroundStyle = {
	background: 'url("../img/table.jpg")',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	height: '100vh',
	width: '100vw',
	position: 'fixed',
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
	const [forcedBets, setForcedBets] = useState([]);

	const { user } = useContext(UserContext);

	useEffect(() => {
		if (!user) {
			history.push('/');
		}
	}, [user, history]);
	// const data = socket.on('tableData');

	useEffect(() => {
		socket.emit('joinTable', { tableId: gameId });
		socket.emit('sitTable', { token: user.token });
	}, [gameId, mainPlayer]);

	useEffect(() => {
		socket.removeEventListener('currentSeat');
		socket.on('currentSeat', (data) => {
			if (data.currentSeat === undefined) {
				history.push('/profile');
			} else {
				console.log(data);
				setCurrentPlayer(data.currentSeat);
				setForcedBets(data.forced);
			}
		});

		socket.removeEventListener('tableData');
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

				for (let i = 0; i < numOfSeats.length; i++) {
					mappedPlayers.push({ ...data?.seats[i], ...data?.cards[i] });
				}

				setPlayers(mappedPlayers);
				setTableCards(data.community);
				setActivePlayer(data.active);
				console.log(mappedPlayers);
			} else if (data) {
				var mappedPlayers = [...players];
				for (let i = 0; i < data.seats.length; i++) {
					if (data.seats[i] !== null) {
						mappedPlayers[i] = data.seats[i];
					} else {
						delete mappedPlayers[i];
					}
				}
				setPlayers(mappedPlayers);
				setTableCards([]);
				setActivePlayer(null);
				console.log(mappedPlayers);
			}
		});
	}, [history, players]);

	const handleLeave = () => {
		socket.emit('leaveTable');
	};

	const handleFold = () => {
		socket.emit('foldTable');
	};

	const handleCheck = () => {
		if (canCheck()) {
			socket.emit('checkTable');
		}
	};

	const handleCall = () => {
		socket.emit('callTable');
	};

	const handleRaise = () => {
		if (canRaise(amount)) {
			socket.emit('raiseTable', { raise: parseInt(amount) });
			setAmount(0);
		}
	};

	const handleBet = () => {
		if (canBet(amount)) {
			socket.emit('betTable', { bet: parseInt(amount) });
			setAmount(0);
		}
	};

	const getMaxBet = () => {
		return Math.max.apply(
			Math,
			players.filter((seat) => seat !== null).map((seat) => seat?.betSize)
		);
	};

	const getMinRaise = () => {
		return getMaxBet() + forcedBets.bigBlind;
	};

	const canCall = () => {
		if (players[currentPlayer] === undefined) {
			return false;
		}
		var { betSize } = players[currentPlayer];
		var maxBetSize = getMaxBet();
		return betSize !== maxBetSize;
	};

	const canCheck = () => {
		if (players[currentPlayer] === undefined) {
			return false;
		}
		var { betSize } = players[currentPlayer];
		var maxBetSize = getMaxBet();
		return betSize === maxBetSize;
	};

	const canRaise = (amount) => {
		if (amount < 0 || players[currentPlayer] === undefined) {
			return false;
		}

		var maxBetSize = getMaxBet();
		if (maxBetSize === 0) {
			return false;
		}

		var { totalChips } = players[currentPlayer];
		var minBet = maxBetSize + forcedBets.bigBlind;
		if (amount < minBet || amount > totalChips) {
			return false;
		}

		return amount >= minBet;
	};

	const canBet = (amount) => {
		if (amount < 0 || players[currentPlayer] === undefined) {
			return false;
		}

		var maxBet = getMaxBet();
		if (maxBet > 0) {
			return false;
		}

		var { totalChips } = players[currentPlayer];
		var minBet = forcedBets.bigBlind;
		if (amount < minBet || amount > totalChips) {
			return false;
		}

		return totalChips >= minBet;
	};

	return (
		<div style={backgroundStyle}>
			<Modal show={modal} onHide={() => {}}>
				<Modal.Header>
					<Modal.Title>Invite players</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ fontSize: '1rem', textAlign: 'center' }}>
					<div>
						Share this id:
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
						with your friends to play.
					</div>
					<FacebookShareButton url={useLocation().pathname} quote={'Play poker now!'}>
						<FacebookIcon size={32} round />
					</FacebookShareButton>
				</Modal.Body>
			</Modal>
			<Row className="d-flex mt-auto justify-content-around fixed-bottom">
				{players.map((player, index) => (
					<div key={index}>
						<div className="d-flex justify-content-center">
							{player.first && (
								<>
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
								</>
							)}
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
					style={{ zIndex: 1031, position: 'fixed' }}
				>
					<Button onClick={handleLeave} className="ml-5 mt-5 " variant="danger">
						Leave
					</Button>
					{activePlayer !== null ? (
						<>
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
								disabled={currentPlayer !== activePlayer || !canCheck()}
								className="ml-5"
								variant="primary"
							>
								Check
							</Button>
							<Button
								onClick={handleCall}
								disabled={currentPlayer !== activePlayer || !canCall()}
								className="ml-5 my-3"
								variant="primary"
							>
								Call
							</Button>
							{currentPlayer === activePlayer &&
								(canRaise(getMinRaise()) ? (
									<>
										<Button
											onClick={handleRaise}
											disabled={
												currentPlayer !== activePlayer || !canRaise(amount)
											}
											className="ml-5"
											variant="primary"
										>
											{amount < getMinRaise()
												? `Raise min ${getMinRaise()}`
												: 'Raise'}
										</Button>
										<InputGroup>
											<FormControl
												type="number"
												placeholder="Amount"
												aria-label="Username"
												className="ml-5 my-3"
												onChange={(e) => setAmount(e.target.value)}
												value={amount}
											/>
										</InputGroup>
									</>
								) : (
									canBet(forcedBets.bigBlind) && (
										<>
											<Button
												onClick={handleBet}
												disabled={
													currentPlayer !== activePlayer ||
													!canBet(amount)
												}
												className="ml-5"
												variant="primary"
											>
												{amount < forcedBets.bigBlind
													? `Bet min ${forcedBets.bigBlind}`
													: 'Bet'}
											</Button>
											<InputGroup>
												<FormControl
													type="number"
													placeholder="Amount"
													aria-label="Username"
													className="ml-5 my-3"
													onChange={(e) => setAmount(e.target.value)}
													value={amount}
												/>
											</InputGroup>
										</>
									)
								))}
						</>
					) : (
						!modal && (
							<div className="ml-5 mt-5">
								<CountdownCircleTimer
									isPlaying
									duration={15}
									colors={[
										['#004777', 0.33],
										['#F7B801', 0.33],
										['#A30000', 0.33],
									]}
								>
									{({ remainingTime }) => remainingTime}
								</CountdownCircleTimer>
							</div>
						)
					)}
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
