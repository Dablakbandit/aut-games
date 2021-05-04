import React, { useState, useEffect, useContext } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { login, UserContext } from '../UserContext';

const backgroundStyle = {
	background:
		'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)),url("../img/casino.jpg")',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	height: '100vh',
};

const LoginScreen = ({ history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const { user, setUser } = useContext(UserContext);

	// const redirect = location.search ? location.search.split('=')[1] : '/';

	useEffect(() => {
		if (user) {
			history.push('/');
		}
	}, [history, user]);

	const submitHandler = async (e) => {
		e.preventDefault();

		try {
			const user = await login(email, password);
			setUser(user);
			history.push('/');
		} catch (error) {
			setError(
				error.response && error.response.data.message
					? error.response.data.message
					: error.message
			);
		}
	};

	return (
		<div style={backgroundStyle}>
			<Container>
				<Row className="d-flex justify-content-center ">
					<Col md={8} xs={12}>
						<Form onSubmit={submitHandler} className="my-5">
							<Form.Group controlId="formBasicEmail">
								<Form.Label className="text-style  ">Email address</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group className="my-3" controlId="formBasicPassword">
								<Form.Label className="text-style  ">Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Enter password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Button type="submit" variant="primary" className="my-2">
								Sign in
							</Button>
							{error && <Alert variant="info">{error}</Alert>}

							<Row className="py-3">
								<Col className="text-style  ">
									Don't have an account?
									<Link to="/register"> Register</Link>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default LoginScreen;
