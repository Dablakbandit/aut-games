import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../UserContext';

const cardHeader = {
	background: 'transparent',
};

const cardImgStyle = {
	maxHeight: '100px',
	maxWidth: '100px',
	objectFit: 'contain',
};

const StoreScreen = ({ history }) => {
	const [products, setProducts] = useState([]);
	const { user, setUser } = useContext(UserContext);
	const [bought, setBought] = useState(user.image);

	useEffect(() => {
		if (!user) {
			history.push('/');
		}

		const config = {
			headers: {
				Authorization: `Bearer ${user?.token}`,
			},
		};

		const fetch = async () => {
			const { data } = await axios.get('/api/users/store', config);
			console.log(data);

			setProducts(data.images);
		};

		fetch();
	}, [user, history, bought]);

	const handleBuy = async (key) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user?.token}`,
			},
		};

		const { data } = await axios.post('/api/users/store', { image: key }, config);
		if (data.image === key) {
			localStorage.setItem('userInfo', JSON.stringify(data));
			setUser(data);
			setBought(key);
		}

		console.log(data);
	};

	return (
		<Container className="d-flex flex-column">
			<h2 className="text-style" style={{ margin: '30px auto' }}>
				Store
			</h2>
			{products.length === 0 && (
				<h2 className="text-style" style={{ margin: 'auto' }}>
					Loading..
				</h2>
			)}

			<Row className="d-flex flex-wrap justify-content-start align-items-center">
				{Object.keys(products).map((key, index) => (
					<Col key={key} sm={6} md={3}>
						<Card
							className="my-2 d-flex justify-items-center align-items-center"
							style={{ backgroundColor: 'rgb(255,255,255,0.5)' }}
						>
							<Card.Img
								variant="top"
								className="my-2"
								style={cardImgStyle}
								src={`${key}`}
							></Card.Img>
							<Card.Text style={cardHeader}>Price: ${products[key]}</Card.Text>
							<Button
								disabled={bought === key}
								className="mb-2"
								onClick={() => handleBuy(key)}
							>
								{bought === key ? 'Bought' : 'Buy'}
							</Button>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
};

export default StoreScreen;
