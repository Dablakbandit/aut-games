import React from 'react';
import { Container, Card, Col, ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const imgStyle = {
	height: '200px',
	width: '100%',
	display: 'block',
	objectFit: 'contain',
	objectPosition: 'top center',
};

const UserCards = ({ people }) => {
	return (
		<Container className="mt-5">
			<ListGroup variant="flush">
				{people.map((user) => (
					<Col md={6} key={user._id}>
						<ListGroup.Item>
							<Card>
								<Card.Body className="d-flex justify-content-start align-items-center">
									<div style={{ width: '150px' }}>
										<Card.Img variant="top" style={imgStyle} src={user.image} />
									</div>
									<div className="d-flex flex-column ml-5">
										<Card.Title>
											{user.name}, <span>{user.age}</span>
										</Card.Title>

										<Card.Subtitle className="mb-2 text-muted">
											Role: {user.role}
										</Card.Subtitle>
										<LinkContainer to={`/profile/${user.user}`}>
											<Card.Link>More about {user.name}</Card.Link>
										</LinkContainer>
									</div>
								</Card.Body>
							</Card>
						</ListGroup.Item>
					</Col>
				))}
			</ListGroup>
		</Container>
	);
};

export default UserCards;
