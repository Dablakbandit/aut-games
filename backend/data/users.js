const bcrypt = require('bcrypt');

const users = [
	{
		name: 'Josh',
		email: 'josh@email.com',
		image: 'img/users/9.jpg',
		password: bcrypt.hashSync('123123', 10),
		role: 'Full Stack developer',
		description:
			'Software Developer with three years of experience in coding, testing and establishing system improvements. Equally at home with software development for PCs, online environments, and mobile devices.',
		age: 20,
	},
	{
		name: 'emily',
		image: 'img/users/8.jpg',
		email: 'emily@email.com',
		password: bcrypt.hashSync('123123', 10),
		description:
			'Focused and quick-learning Software Engineer with 3 years of experience in computer science, programming, and UX design for various projects and clients.',

		role: 'Frontend / UX UI Designer',
		age: 20,
	},
	{
		name: 'Mark',
		image: 'img/users/12.jpg',
		email: 'mark@email.com',
		password: bcrypt.hashSync('123123', 10),
		description:
			'Strong in design and integration problem-solving skills. Expert in Java, C#, .Net and T-SQL with database analysis and design.',
		role: 'Backend Developer ASP.Net',

		age: 20,
	},
	{
		name: 'Dave',
		image: 'img/users/13.jpg',
		email: 'dave@email.com',
		password: bcrypt.hashSync('123123', 10),
		role: 'Backend Developer Node.js',
		description:
			'Proven ability to leverage full-stack expertise to build interactive and user-centered website designs to scale.',
		age: 20,
	},
	{
		name: 'Lois',
		image: 'img/users/11.jpg',
		email: 'lois@email.com',
		password: bcrypt.hashSync('123123', 10),
		role: 'Jr Frontend React developer',
		description:
			'Just starting my journey in Hackathon competitions, looking for someone to help me build full stack applications =)',
		age: 20,
	},
	{
		name: 'Diana',
		image: 'img/users/10.jpg',
		email: 'diana@email.com',
		password: bcrypt.hashSync('123123', 10),
		role: 'Software Engineer, frontend/backend',
		description:
			'Comfortable in both frontend and backend, looking for another developer to win Hackathons',
		age: 20,
	},
];

module.exports = users;
