// import React, { useState, useEffect, useContext } from 'react';
// import { Container, Card, Col, Row, Image, ListGroup, Button, Form } from 'react-bootstrap';
// import axios from 'axios';
// import { UserContext } from '../UserContext';

// const imgStyle = {
// 	maxWidth: '100%',
// 	maxHeight: '100%',
// 	// height: '300px',
// 	// width: '200px',
// 	display: 'block',
// 	objectFit: 'contain',
// 	objectPosition: 'top center',
// 	borderRadius: '10%',
// 	boxShadow: '3px 5px #6dd5ed',
// };

// const nameStyle = {
// 	textTransform: 'uppercase',
// };

// const Profile = ({ history }) => {
// 	const { user } = useContext(UserContext);
// 	const [profile, setProfile] = useState(null);

// 	const [email, setEmail] = useState('');
// 	const [name, setName] = useState('');
// 	const [role, setRole] = useState('');
// 	const [description, setDescription] = useState('');
// 	const [age, setAge] = useState('');
// 	const [edit, setEdit] = useState(false);

// 	const config = {
// 		headers: {
// 			Authorization: `Bearer ${user?.token}`,
// 		},
// 	};

// 	useEffect(() => {
// 		const fetchUserProfile = async () => {
// 			const { data } = await axios.get('/api/users/profile/', config);
// 			console.log(data);
// 			setProfile(data);
// 		};

// 		fetchUserProfile();

// 		if (profile) {
// 			setEmail(profile.email);
// 			setName(profile.name);
// 			setAge(profile.age);
// 			setDescription(profile.description);
// 			setRole(profile.role);
// 		}
// 	}, [edit]);

// 	const submitHandler = async (e) => {
// 		e.preventDefault();

// 		try {
// 			const config = await {
// 				headers: {
// 					'Content-Type': 'application/json',
// 					Authorization: `Bearer ${user?.token}`,
// 				},
// 			};

// 			const { data } = await axios.put(
// 				'/api/users/profile',
// 				{ email, name, role, age, description },
// 				config
// 			);
// 			setEdit(false);
// 		} catch (error) {
// 			console.log(
// 				error.response && error.response.data.message
// 					? error.response.data.message
// 					: error.message
// 			);
// 		}
// 	};

// 	return (
// 		<Container className="mt-5">
// 			{profile ? (
// 				<Row>
// 					<Col md={4} className="mb-3">
// 						<Card>
// 							<Card.Body className="d-flex flex-column justify-content-center align-items-center">
// 								<Image style={imgStyle} src={profile.image}></Image>
// 								<div className="mt-4">
// 									<h4 style={nameStyle}>
// 										{profile.name}, {profile.age}
// 									</h4>
// 									<Card.Subtitle className="my-3 text-muted">
// 										Role: {profile.role}
// 									</Card.Subtitle>
// 									<Row className="d-flex justify-content-start">
// 										<Card.Subtitle className="text-muted mx-2">
// 											Matches: {profile.matchedUsers?.length}
// 										</Card.Subtitle>
// 										<Card.Subtitle className="text-muted mx-2">
// 											Likes: {profile.likedByUsers?.length}
// 										</Card.Subtitle>
// 									</Row>
// 								</div>
// 							</Card.Body>
// 						</Card>
// 						{/* <Card className="mt-3">ds</Card> */}
// 					</Col>
// 					<Col md={8}>
// 						<Card className="mb-3">
// 							<Card.Body>
// 								{!edit ? (
// 									<>
// 										<ListGroup variant="flush">
// 											<ListGroup.Item>Name: {profile.name}</ListGroup.Item>
// 											<ListGroup.Item>Email: {profile.email}</ListGroup.Item>
// 											<ListGroup.Item>Age: {profile.age}</ListGroup.Item>
// 											<ListGroup.Item>Role: {profile.role}</ListGroup.Item>
// 											<ListGroup.Item>
// 												Description:{' '}
// 												<p className="text-muted mt-2">
// 													{profile.description.length !== 0
// 														? profile.description
// 														: 'There is no description yet'}
// 												</p>
// 											</ListGroup.Item>
// 										</ListGroup>

// 										{_id === profile._id && (
// 											<Button
// 												className="profileBtn"
// 												onClick={() => setEdit(true)}
// 											>
// 												Edit
// 											</Button>
// 										)}
// 									</>
// 								) : (
// 									<Form onSubmit={submitHandler} className="my-5">
// 										<Form.Group className="my-3" controlId="formName">
// 											<Form.Label>Name</Form.Label>
// 											<Form.Control
// 												type="text"
// 												placeholder="Enter your Name"
// 												value={name}
// 												onChange={(e) => setName(e.target.value)}
// 											></Form.Control>
// 										</Form.Group>

// 										<Form.Group controlId="formBasicEmail">
// 											<Form.Label>Email address</Form.Label>
// 											<Form.Control
// 												type="email"
// 												placeholder="Enter email"
// 												value={email}
// 												onChange={(e) => setEmail(e.target.value)}
// 											></Form.Control>
// 										</Form.Group>

// 										<Form.Group controlId="age">
// 											<Form.Label>Age</Form.Label>
// 											<Form.Control
// 												type="number"
// 												placeholder="Enter your age"
// 												value={age}
// 												onChange={(e) => setAge(e.target.value)}
// 											></Form.Control>
// 										</Form.Group>

// 										<Form.Group controlId="role">
// 											<Form.Label>Role</Form.Label>
// 											<Form.Control
// 												type="text"
// 												placeholder="Your role"
// 												value={role}
// 												onChange={(e) => setRole(e.target.value)}
// 											></Form.Control>
// 										</Form.Group>

// 										<Form.Group controlId="description">
// 											<Form.Label>Description</Form.Label>
// 											<Form.Control
// 												as="textarea"
// 												placeholder="Your description"
// 												value={description}
// 												style={{ minHeight: '6rem' }}
// 												onChange={(e) => setDescription(e.target.value)}
// 											></Form.Control>
// 										</Form.Group>
// 										<Button
// 											onClick={() => setEdit(false)}
// 											className="profileBtn my-2 mx-2"
// 										>
// 											Cancel
// 										</Button>
// 										<Button type="submit" className="profileBtn my-2 mx-2">
// 											Change
// 										</Button>
// 									</Form>
// 								)}
// 							</Card.Body>
// 						</Card>
// 					</Col>
// 				</Row>
// 			) : (
// 				<h4>Loading...</h4>
// 			)}
// 		</Container>
// 	);
// };

// export default Profile;
