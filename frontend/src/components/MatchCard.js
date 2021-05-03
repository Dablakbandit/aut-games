import React from 'react';
import { Container, Card, Row, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const MatchCard = ({ person, choose }) => {
	const { name, age, image } = person;
	const imgStyle = {
		height: '500px',
		display: 'block',
		objectFit: 'cover',
		objectPosition: 'top center',
	};

	return (
		<Container className="d-flex justify-content-center">
			<Card style={{ width: '30rem' }}>
				<Card.Img variant="top" style={imgStyle} src={image} />
				<Card.Body>
					<Card.Title>
						{name}, <span>{age}</span>
					</Card.Title>
					<Card.Subtitle className="mb-2 text-muted">Role</Card.Subtitle>
					<LinkContainer to={`/profile/${person._id}`}>
						<Card.Link>More about {name}</Card.Link>
					</LinkContainer>
					<Row className="my-3 d-flex justify-content-around">
						<Button
							className="dislikeBtn"
							onClick={() => choose(person._id, 'DISLIKE_HACKER')}
						>
							Dislike Hacker
						</Button>
						<Button
							className="likeBtn"
							onClick={() => choose(person._id, 'LIKE_HACKER')}
						>
							Like Hacker
						</Button>
					</Row>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default MatchCard;
