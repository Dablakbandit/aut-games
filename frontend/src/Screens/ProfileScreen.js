import React, { useState, useEffect, useContext } from 'react';
import { Container, Col, Row, Image, Button, Form } from 'react-bootstrap';
import axios from 'axios';
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
};

const Profile = ({ history, match }) => {
	const id = match.params.id;
	const [gameId, setGameId] = useState([]);

	const submitHandler = async (e) => {
		e.preventDefault();
	};

	return (
		<div style={backgroundStyle}>
			<Container className="mb-5 d-flex flex-column">
				<Row className="mx-auto mt-5 ">
					<Col md={7}></Col>
					<Image style={imgStyle} src="./img/cards.png"></Image>
				</Row>
				<Row className="d-flex">
					<Col md={7} className="m-auto d-flex align-items-center justify-content-center">
						<Form onSubmit={submitHandler} className="my-5">
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
							<Button className="mx-3 heroBtn">Create a game</Button>

							<Button className="mx-3 heroBtn" type="submit" variant="primary">
								Join a game
							</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Profile;
