import React, { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import MatchCard from '../components/MatchCard';
import MatchModal from '../components/MatchModal';
import axios from 'axios';
import { UserContext } from '../UserContext';

function HomeScreen({ history }) {
	const [people, setPeople] = useState([]);
	const [match, setMatch] = useState({});
	const [showModal, setShowModal] = useState(false);
	const { user } = useContext(UserContext);

	const config = {
		headers: {
			Authorization: `Bearer ${user?.token}`,
		},
	};

	const closeModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		if (!user) {
			history.push('/login');
		}

		const fetchData = async () => {
			if (user) {
				const { data } = await axios.get('/api/matching/search', config);
				await setPeople(data.unmatchedUsers);
			}
		};

		fetchData();
		// eslint-disable-next-line
	}, [history, user]);

	const choose = async (userId, action) => {
		console.log(userId);

		switch (action) {
			case 'LIKE_HACKER':
				{
					const { data } = await axios.put(
						'/api/matching/likedUsers',
						{ id: userId },
						config
					);

					if (data.match) {
						setShowModal(true);
						setMatch(people[0]);
					}
					const newPeople = [...people].filter((el) => el._id !== userId);
					setPeople(newPeople);
				}
				break;
			case 'DISLIKE_HACKER':
				{
					await axios.put('/api/matching/dislikedUsers', { id: userId }, config);
					const newPeople = [...people].filter((el) => el._id !== userId);
					setPeople(newPeople);
				}
				break;
			default:
				return people;
		}
	};
	return (
		<Container className="d-flex flex-column align-items-center my-3">
			<MatchModal show={showModal} person={match} closeModal={closeModal}></MatchModal>
			<h1 className="my-3">Find your Perfect Hackathon Match</h1>
			{people[0] ? (
				<MatchCard person={people[0]} choose={choose}></MatchCard>
			) : (
				<p>no people </p>
			)}
		</Container>
	);
}

export default HomeScreen;
