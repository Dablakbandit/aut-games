import React, { useContext, useEffect } from 'react';
import About from '../components/About';
import Developers from '../components/Developers';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { UserContext } from '../UserContext';
// import './Buttons.css';

const HomeScreen = ({ history }) => {
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (user) {
			history.push(`/play`);
		}
	}, [user, history]);

	return (
		<>
			<Hero></Hero>
			<About></About>
			<Developers></Developers>
			<Footer></Footer>
		</>
	);
};

export default HomeScreen;
