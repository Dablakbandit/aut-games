import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import Slide from 'react-reveal';
import { LinkContainer } from 'react-router-bootstrap';
import {socket} from '../connection/socket'

const Hero = () => {
	const imgStyle = {
		width: '600px',
		display: 'block',
		objectFit: 'cover',
	};

	const headerStyle = {
		fontSize: '4rem',
		fontWeight: '700',
		lineHeight: '1.3',
		marginBottom: '40px',
		color: '#2b044d',
		maxWidth: '600px',
	};

	const textStyle = {
		color: '#707b8e',
		fontSize: '1rem',
		lineHeight: '30px',
		marginBottom: '15px',
		fontWeight: '400',
		maxWidth: '300px',
	};

	function testButton(){
		socket.emit('test', 'hello');
	};

	return (
		<div id="home" style={{ minHeight: '100vh' }}>
			<Container className="d-flex justify-content-center align-items-center h-100 my-5">
				<Row>
					<Col md={5} className="d-flex flex-column align-items-baseline my-5">
						<Slide left>
							<h1 style={headerStyle}>Hackathon Match</h1>
							<div style={textStyle}>
								It can be a struggle to find a teammate that you get along with.
								Sign up and build amazing projects with your perfect hackathon
								match.
							</div>						
							<Button id="heroBtn" onClick={testButton}>Join now</Button>
						</Slide>
					</Col>
					<Col md={7} className="">
						<Slide right>
							<Image style={imgStyle} src="img/hero4.png"></Image>
						</Slide>
					</Col>
				</Row>
			</Container>
		</div>
	);
};
export default Hero;
