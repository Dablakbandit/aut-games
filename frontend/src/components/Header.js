import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AiOutlineUser } from 'react-icons/ai';
import { UserContext } from '../UserContext';

const Header = () => {
	const { user, setUser } = useContext(UserContext);

	const scrollTo = (id) => {
		const element = document.getElementById(id);

		element.scrollIntoView({
			behavior: 'smooth',
		});
	};

	const logoutHandler = () => {
		localStorage.removeItem('userInfo');
		setUser(null);
	};

	return (
		<header>
			<Navbar
				className="navbar"
				// style={{ background: 'linear-gradient(to right, #c31432, #240b36)' }}
			>
				<Container>
					<LinkContainer style={{ cursor: 'pointer' }} to="/">
						<div className="nav-logo">Perfect Match</div>
					</LinkContainer>
					{user ? (
						<>
							<Nav className="ml-auto mr-4">
								<LinkContainer className="mx-1" to="/search">
									<Nav.Link>Search Matches</Nav.Link>
								</LinkContainer>

								<LinkContainer className="mx-1" to="/likedBy">
									<Nav.Link>People Who Liked You</Nav.Link>
								</LinkContainer>
								<LinkContainer className="mx-1" to="/matches">
									<Nav.Link>Matches</Nav.Link>
								</LinkContainer>
							</Nav>
							<Nav>
								<NavDropdown
									className="mx-1"
									title={<AiOutlineUser />}
									id="username"
								>
									<LinkContainer to="/">
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							</Nav>
						</>
					) : (
						<>
							<Nav className="ml-auto mr-4 ">
								<LinkContainer to="/">
									<Nav.Link onClick={() => scrollTo('home')}>Home</Nav.Link>
								</LinkContainer>
								<LinkContainer to="/">
									<Nav.Link onClick={() => scrollTo('about')}>About</Nav.Link>
								</LinkContainer>

								<LinkContainer to="/">
									<Nav.Link onClick={() => scrollTo('team')}>Team</Nav.Link>
								</LinkContainer>
							</Nav>
							<Nav>
								<LinkContainer to="/login">
									<Nav.Link>Sign in</Nav.Link>
								</LinkContainer>
							</Nav>
						</>
					)}
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
