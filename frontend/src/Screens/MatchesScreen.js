import React, { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../UserContext';
import UserCards from '../components/UserCards';

const MatchesScreen = ({ history }) => {
	const { user } = useContext(UserContext);
	const [matches, setMatches] = useState([]);

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
				setMatches(data.matchedUsers);
			})
			.catch((error) => console.log(error));
	}, [history, user]);

	return (
		<Container className="mt-5">
			{matches?.length === 0 && <h4>No matches</h4>}
			{matches ? <UserCards people={matches}></UserCards> : <h4>Loading...</h4>}
		</Container>
	);
};

export default MatchesScreen;
