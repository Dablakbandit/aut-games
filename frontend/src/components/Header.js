import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AiOutlineUser } from 'react-icons/ai';
import { UserContext } from '../UserContext';
import { socket } from '../socket';

const Header = () => {
	const { user, setUser } = useContext(UserContext);
	const { chips, setChips } = useState(0);

	const scrollTo = (id) => {
		const element = document.getElementById(id);

		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
			});
		}
	};

	useEffect(() => {
		setChips(user.chips);
	}, [setChips, user]);
	useEffect(() => {
		socket.on('chipUpdate', (update) => {
			setChips(update.chips);
		});
	}, [chips, setChips]);

	const logoutHandler = () => {
		localStorage.removeItem('userInfo');
		setUser(null);
	};

	return (
		<Navbar
			className="navbar"
			variant="dark"
			collapseOnSelect
			expand="md"
			// style={{ position: 'fixed' }}
			// style={{ background: 'linear-gradient(to right, #c31432, #240b36)' }}
		>
			<Container>
				<Navbar.Brand>
					<LinkContainer style={{ cursor: 'pointer' }} to="/">
						<div className="nav-logo">Poker Skills</div>
					</LinkContainer>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse className="justify-content-end">
					{user ? (
						<>
							<Nav className="ml-auto mr-4">
								<LinkContainer className="mx-1" to="/leaderboard">
									<Nav.Link>Leader Board</Nav.Link>
								</LinkContainer>
								<LinkContainer className="mx-1" to="/store">
									<Nav.Link>Store</Nav.Link>
								</LinkContainer>
								<LinkContainer className="mx-1" to="/play">
									<Nav.Link>Play</Nav.Link>
								</LinkContainer>
							</Nav>
							<Nav>
								<Nav.Link>
									<Image
										src="./img/chips.svg"
										className="chipsImage"
										alt="stackSize"
									></Image>
									{chips}
								</Nav.Link>
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
							<Nav className="ml-auto mr-4">
								<LinkContainer to="/">
									<Nav.Link onClick={() => scrollTo('root')}>Home</Nav.Link>
								</LinkContainer>
								<LinkContainer to="/">
									<Nav.Link onClick={() => scrollTo('about')}>About</Nav.Link>
								</LinkContainer>
								<LinkContainer to="/">
									<Nav.Link onClick={() => scrollTo('team')}>Team</Nav.Link>
								</LinkContainer>
								<LinkContainer className="mx-1" to="/leaderboard">
									<Nav.Link>Leader Board</Nav.Link>
								</LinkContainer>
							</Nav>
							<Nav>
								<LinkContainer to="/login">
									<Nav.Link>Sign in</Nav.Link>
								</LinkContainer>
							</Nav>
						</>
					)}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
