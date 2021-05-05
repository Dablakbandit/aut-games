import React, { useState, useEffect } from 'react';
import { Container, Row, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const headerStyle = {
	fontSize: '4rem',
	fontWeight: '700',
	lineHeight: '1.3',
	marginBottom: '20px',
	color: '#fefefe',
	marginTop: '30px',
};

const containerStyle = {
	background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	minHeight: '100vh',
	maxHeight: 'auto',
};

const videoStyle = {
	objectFit: 'cover',
	width: '100%',
	height: '100%',
	position: 'fixed',
	zIndex: '-1',
};

const LeaderBoardScreen = () => {
	const [players, setPlayers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await axios.get('/api/users/leaderboard');
			await setPlayers(data.chips);
		};

		fetchData();

		// eslint-disable-next-line
	}, []);

	return (
		<div style={containerStyle}>
			<video style={videoStyle} src="./img/chips.mp4" autoPlay loop muted />

			<Container className="d-flex flex-column  align-items-center">
				<h1 style={headerStyle}>Leader Board</h1>
				{players && players.length > 0 ? (
					<ListGroup variant="flush">
						{players.map((player, index) => (
							<ListGroup.Item
								key={index}
								style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'white' }}
							>
								{`${index + 1}. ${player.name}: ${player.chips} chips`}
							</ListGroup.Item>
						))}
					</ListGroup>
				) : (
					<h2 className="text-style">Loading...</h2>
				)}
			</Container>
		</div>
	);
};

export default LeaderBoardScreen;
