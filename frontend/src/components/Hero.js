import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Hero = () => {
	const headerStyle = {
		fontSize: '4rem',
		fontWeight: '700',
		lineHeight: '1.3',
		marginBottom: '40px',
		color: '#fefefe',
		marginTop: '100px',
	};

	const containerStyle = {
		background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		height: '100vh',
	};

	const videoStyle = {
		objectFit: 'cover',
		width: '100%',
		height: '100%',
		background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))',

		position: 'absolute',
		zIndex: '-1',
	};

	return (
		<div style={containerStyle}>
			<video style={videoStyle} src="./img/dices.mp4" autoPlay loop muted />
			{/* <Header></Header> */}

			<Container className="vh-100 d-flex flex-column  align-items-center">
				<h1 style={headerStyle}>Your game awaits</h1>
				<Row className="d-flex justify-content-center flex-wrap align-items-center">
					<LinkContainer to="/register" className="mx-2 my-1">
						<Button className="heroBtn">Join now</Button>
					</LinkContainer>
					<LinkContainer to="/login" className="mx-2 my-1">
						<Button className="heroBtn">Start Playing</Button>
					</LinkContainer>
				</Row>
			</Container>
		</div>
	);
};
export default Hero;
