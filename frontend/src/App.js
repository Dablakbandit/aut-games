import { useState, useMemo } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import LoginScreen from './Screens/LoginScreen';
import { UserContext } from './UserContext';
import RegisterScreen from './Screens/RegisterScreen';
import GameScreen from './Screens/GameScreen';

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
					<Route exact path="/" component={HomeScreen} />
					<Route exact path="/profile" component={ProfileScreen} />
					<Route exact path="/game/:gameId" component={GameScreen} />

					<Route exact path="/login" component={LoginScreen} />
					<Route exact path="/register" component={RegisterScreen} />
				</main>
			</UserContext.Provider>
		</Router>
	);
}

export default App;
