import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Slide from 'react-reveal';

const About = () => {
	const imgStyle = {
		// width: '600px',
		height: '600px',
		display: 'block',
		objectFit: 'cover',
	};

	const headerStyle = {
		fontSize: '3rem',
		fontWeight: '700',
		lineHeight: '1.3',
		marginBottom: '40px',
		color: '#2b044d',
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
		<div id="about" style={{ minHeight: '100vh' }}>
			<Container className="d-flex justify-content-center align-items-center h-100 my-5">
				<Row>
					<Col md={7} className="">
						<Slide left>
							<Image style={imgStyle} src="img/hero3.png"></Image>
						</Slide>
					</Col>
					<Col md={5} className="d-flex flex-column align-items-baseline my-5">
						<Slide right>
							<h2 style={headerStyle}>More than 80% of coders found their match</h2>
							<div style={textStyle}>
								More than 300 coders found their match and win successfully
								Hackathons. A good team is key to success.
							</div>
						</Slide>

						{/* <Button id="heroBtn">Join now</Button> */}
					</Col>
				</Row>
			</Container>
		</div>
	);
};
export default About;
