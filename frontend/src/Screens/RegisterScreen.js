import React, { useState, useEffect, useContext } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext, register } from '../UserContext';

const backgroundStyle = {
	background:
		'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)),url("../img/casino.jpg")',

	backgroundPosition: 'center',
	backgroundSize: 'cover',
	height: '100vh',
};

const RegisterScreen = ({ history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const { user, setUser } = useContext(UserContext);

	// const redirect = location.search ? location.search.split('=')[1] : '/';

	useEffect(() => {
		if (user) {
			history.push('/');
		}
	}, [user, history]);

	const submitHandler = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
		} else {
			try {
				setMessage(null);
				const user = await register(name, email, password);
				setUser(user);
			} catch (error) {
				setError(
					error.response && error.response.data.message
						? error.response.data.message
						: error.message
				);
			}
		}
	};

	return (
		<div style={backgroundStyle}>
			<Container>
				<Row className="d-flex justify-content-center ">
					<Col md={8} xs={12}>
						<Form onSubmit={submitHandler} className="my-5">
							<Form.Group controlId="name">
								<Form.Label className="text-style  ">Name</Form.Label>
								<Form.Control
									type="name"
									placeholder="Enter your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								></Form.Control>
							</Form.Group>

							<Form.Group controlId="formBasicEmail">
								<Form.Label className="text-style  ">Email address</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								></Form.Control>
							</Form.Group>
							<Form.Group className="my-3" controlId="formBasicPassword">
								<Form.Label className="text-style  ">Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Enter password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								></Form.Control>
							</Form.Group>

							<Form.Group controlId="confirmPassword">
								<Form.Label className="text-style  ">Confirm Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Confirm password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								></Form.Control>
							</Form.Group>

							<Button type="submit" variant="primary" className="my-2">
								Register
							</Button>
							{message && <Alert variant="info">{message}</Alert>}
							{error && <Alert variant="info">{error}</Alert>}

							<Row className="py-3">
								<Col className="text-style  ">
									Got an account?
									<Link to="/login"> Login</Link>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default RegisterScreen;
