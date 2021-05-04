const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
	'./backend/routes/userRoutes.js',
	'./backend/server.js',
	'./backend/controllers/userController.js',
];

swaggerAutogen(outputFile, endpointsFiles);
