import { useState, useMemo } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SearchScreen from './Screens/SearchScreen';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import LoginScreen from './Screens/LoginScreen';
import { UserContext } from './UserContext';
import RegisterScreen from './Screens/RegisterScreen';
import LikedByScreen from './Screens/LikedByScreen';
import MatchesScreen from './Screens/MatchesScreen';

function App() {
	const userInfo = localStorage.getItem('userInfo')
		? JSON.parse(localStorage.getItem('userInfo'))
		: null;

	const [user, setUser] = useState(userInfo ? userInfo : null);

	const value = useMemo(() => ({ user, setUser }), [user, setUser]);

	return (
		<Router>
			<UserContext.Provider value={value}>
				<Header></Header>
				<main>
					<Container>
						<Route exact path="/" component={HomeScreen} />

						<Route exact path="/search" component={SearchScreen} />
						<Route exact path="/likedBy" component={LikedByScreen} />
						<Route exact path="/matches" component={MatchesScreen} />
						<Route exact path="/login" component={LoginScreen} />
						<Route exact path="/register" component={RegisterScreen} />
						<Route exact path="/profile/:id" component={ProfileScreen} />
					</Container>
				</main>
			</UserContext.Provider>
		</Router>
	);
}

export default App;
