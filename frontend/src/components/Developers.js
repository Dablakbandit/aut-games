import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Fade from 'react-reveal';

const Developers = () => {
	const headerStyle = {
		fontSize: '3rem',
		fontWeight: '700',
		lineHeight: '1.3',
		marginBottom: '40px',
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

	const cardHeader = {
		background: 'transparent',
	};

	const cardTitle = {
		fontSize: '1rem',
	};

	return (
		<div id="team" style={{ minHeight: '100vh' }}>
			<Container className="d-flex flex-column justify-content-center align-items-center h-100 my-5">
				<h2 style={headerStyle}>Our team</h2>
				<Row className="d-flex justify-content-center">
					<Col sm={8} md={4}>
						<Fade bottom>
							<Card style={{ boxShadow: '3px 5px red', background: 'transparent' }}>
								<Card.Img
									variant="top"
									src="img/devTeam/team1.jpg"
									style={{ height: '350px' }}
								/>
								<Card.Header style={cardHeader}>Aldar Batomunkuev</Card.Header>

								<Card.Body>
									<Card.Title style={cardTitle}>Frontend </Card.Title>
									<Card.Text style={textStyle}>
										Just a student with a part time job and who wants to win,
										this Hackathon!! Seriously this was really stressful. I
										wanna WIN
									</Card.Text>
								</Card.Body>
							</Card>
						</Fade>
					</Col>

					<Col sm={8} md={4}>
						<Fade bottom>
							<Card style={{ boxShadow: '3px 5px red', background: 'transparent' }}>
								<Card.Img
									variant="top"
									src="img/devTeam/team4.jpg"
									style={{ height: '350px' }}
								/>

								<Card.Header style={cardHeader}>Ashley Thew</Card.Header>

								<Card.Body>
									<Card.Title style={cardTitle}>Backend Engineer</Card.Title>

									<Card.Text style={textStyle}>
										Gotta love taking apart c++ code in a node package, just to
										find a method not in the documentation.
									</Card.Text>
								</Card.Body>
							</Card>
						</Fade>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Developers;
