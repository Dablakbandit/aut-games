import React, { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../UserContext';
import UserCards from '../components/UserCards';

const LikedByScreen = ({ history }) => {
	const { user } = useContext(UserContext);
	const [likedByPeople, setLikedByPeople] = useState([]);

	useEffect(() => {
		if (!user) {
			history.push('/');
		}

		const config = {
			headers: {
				Authorization: `Bearer ${user?.token}`,
			},
		};

		axios
			.get(`/api/users/profile/${user._id}`, config)
			.then(({ data }) => {
				console.log(data);
				setLikedByPeople(data.likedByUsers);
			})
			.catch((error) => console.log(error));
	}, [history, user]);

	return (
		<Container className="mt-5">
			{likedByPeople?.length === 0 && <h4>No one liked you yet</h4>}
			{likedByPeople ? <UserCards people={likedByPeople}></UserCards> : <h4>Loading...</h4>}
		</Container>
	);
};

export default LikedByScreen;
