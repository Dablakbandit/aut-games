import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
	return (
		<footer className="p-3 mb-2" style={{ backgroundColor: 'transparenet' }}>
			<Container>
				<Row>
					<Col md={4} className="text-center py-3">
						Copyright &copy; Aldar & Ashley
					</Col>
					<Col md={4} className="text-center py-3">
						<div>Author:</div>
						<div>Aldar</div>
						<div>Ashley</div>
					</Col>
					<Col md={4} className="text-center py-3">
						Made for AUT GAME HACKATHON
					</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
