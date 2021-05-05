import React, { useState, useEffect, useContext } from 'react';
import { Container, Col, Row, Image, Button, Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../socket';
import { UserContext } from '../UserContext';

const imgStyle = {
	width: '200px',
	// display: 'block',
	objectFit: 'cover',
};

const backgroundStyle = {
	background:
		'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)),url("./img/game.jpg")',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	height: '100vh',
	width: '100vw',
	position: 'fixed',
};

const Profile = ({ history, match }) => {
	const [gameId, setGameId] = useState('');
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (!user) {
			history.push('/');
		}
		socket.emit('leaveTable');
	}, [user, history]);

	const submitHandler = (e) => {
		e.preventDefault();

		if (gameId?.length !== 0) {
			history.push(`/game/${gameId}`);
		} else {
			alert('Please enter game id');
		}
	};

	const handleCreate = () => {
		const id = uuidv4();
		const result = socket.emit('createTable', { tableId: id });

		if (result.connected) {
			history.push(`/game/${id}`);
		} else {
			alert('failed to connect');
		}
		// console.log(id);
	};

	return (
		<div style={backgroundStyle}>
			<Container className="mb-5 d-flex flex-column">
				<Row className="mx-auto mt-5 ">
					<Col md={7}></Col>
					<Image style={imgStyle} src="./img/cards.png"></Image>
				</Row>
				<Form onSubmit={submitHandler} className="my-5">
					<Row className="justify-content-md-center">
						<Col md={8} sm={8} className="align-items-center justify-content-center">
							<Form.Group controlId="formBasicEmail">
								<Form.Label className="test-style ">Game id</Form.Label>
								<Form.Control
									type="text"
									name="gameId"
									placeholder="Enter Game ID"
									value={gameId}
									onChange={(e) => setGameId(e.target.value)}
								></Form.Control>
							</Form.Group>
						</Col>
					</Row>
					<Row className="d-flex justify-content-center">
						<Col sm={3}></Col>
						<Col sm className="m-auto d-flex align-items-center justify-content-center">
							<Button className="heroBtn mt-1" onClick={() => handleCreate()}>
								Create a game
							</Button>
						</Col>
						<Col sm className="d-flex align-items-center justify-content-center">
							<Button className="heroBtn mt-1" type="submit" variant="primary">
								Join a game
							</Button>
						</Col>
						<Col sm={3}></Col>
					</Row>
				</Form>
			</Container>
		</div>
	);
};

export default Profile;
