import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Slide from 'react-reveal';

const About = () => {
	const imgStyle = {
		maxHeight: '600px',
		display: 'block',
		objectFit: 'cover',
	};

	const headerStyle = {
		fontSize: '3rem',
		fontWeight: '700',
		lineHeight: '1.3',
		marginBottom: '40px',
		color: '#fefefe',
		maxWidth: '600px',
	};

	const textStyle = {
		color: '#707b8e',
		fontSize: '1.2rem',
		lineHeight: '30px',
		marginBottom: '15px',
		fontWeight: '400',
		maxWidth: '300px',
	};

	return (
		<div id="about" style={{ minHeight: '100vh', backgroundColor: '#150f0f' }}>
			<Container className="d-flex justify-content-center align-items-center h-100 mb-5">
				<Row className="mt-5">
					<Col md={7} sm={10} className="">
						<Slide left>
							<Image style={imgStyle} src="img/poker.png"></Image>
						</Slide>
					</Col>
					<Col md={5} sm={10} className="d-flex flex-column align-items-baseline my-5">
						<Slide right>
							<h2 style={headerStyle}>The best platform for playing poker online</h2>
							<div style={textStyle}>
								Hundreds of people already joined us and play poker with their
								friends. Play poker and see people's faces, you can play from any
								part of the world
							</div>
						</Slide>
					</Col>
				</Row>
			</Container>
		</div>
	);
};
export default About;
