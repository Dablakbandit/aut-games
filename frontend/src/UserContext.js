import { createContext } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const login = async (email, password) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const { data } = await axios.post('/api/users/login', { email, password }, config);
	localStorage.setItem('userInfo', JSON.stringify(data));

	return data;
};

export const register = async (name, email, age, password) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const { data } = await axios.post('/api/users/', { email, name, password, age }, config);
	localStorage.setItem('userInfo', JSON.stringify(data));

	console.log(data + ' login');

	console.log(data);

	return data;
};
