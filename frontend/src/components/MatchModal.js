import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const MatchModal = ({ show, closeModal, person }) => {
	const imgStyle = {
		height: '300px',
		display: 'block',
		objectFit: 'contain',
		objectPosition: 'top center',
	};
	const { name, desc, image } = person ? person : {};
	return (
		<Modal show={show} onHide={closeModal} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title>You are matched with {name}</Modal.Title>
			</Modal.Header>
			<Image src={image} style={imgStyle} />
			<Modal.Body>{desc}</Modal.Body>
			<Modal.Footer className="d-flex justify-content-lg-around">
				<Button variant="secondary" onClick={closeModal}>
					Keep Searching
				</Button>
				<LinkContainer to={`/profile/${person._id}`}>
					<Button variant="primary">View {name}'s profile</Button>
				</LinkContainer>
			</Modal.Footer>
		</Modal>
	);
};

export default MatchModal;
