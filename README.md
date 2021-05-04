<h1 align="center">
	<br>
	<a height="200" href="#" target="_blank" alt="Link to application"><img src="https://aut-games.herokuapp.com/logo512.png" alt="Random image" width="200"></a>
	<br>
	<br>
	<p>Aut Games</p>
</h1>

<h4 align="center">An open source poker game website made for the <a href="https://beta.myskillsme.com/" target="_blank" alt="Link to skills me">Skillsme</a> Auckland Student Coding Hackathon</h4>

<p align="center">
        <img src="https://img.shields.io/badge/Express%20Version-%5E4.17.1-green" >
        <img src="https://img.shields.io/badge/react%20Version-%5E17.0.2-green" >
        <img src="https://img.shields.io/badge/socket.io%20Version-%5E4.0.1-green" >
        <img src="https://img.shields.io/github/package-json/v/AUT-HACKATHON/aut-games/main?label=Stable%20Version&color=blueviolet">
        <img src="https://img.shields.io/github/package-json/v/AUT-HACKATHON/aut-games/swagger?label=Next%20Version&color=lightgrey">

</p>

<p align="center">
		<a href="#demo">Demo</a> •
		<a href="#how-to-use">How To Use</a> •
		<a href="#key-features">Key Features</a> •
		<a href="#local-instance">Local Instance</a> •
		<a href="#license">License</a> •
		<a href="#credits">Credits</a>
</p>

## Demo

Swagger API Docs: <a href="https://perfectmatchbackend.herokuapp.com/api-docs/">https://perfectmatchbackend.herokuapp.com/api-docs/</a><br>
Front end Demo: <a href="https://youtube.com">https://youtube.com</a>

## How To Use

Go to <a href="https://aut-games.herokuapp.com/">https://aut-games.herokuapp.com/</a> create an account / login.

Click create a game or get a link/game id from a friend and click join a game.<br />
Play poker with a friend and enjoy!<br />
There is 15 seconds inbetween games for players to leave, or leave anytime to be refunded your tokens.<br />
View the leader board by clicking it in the header.

## Key Features

<ul>
<li>Join from url link</li>
<li>Share to Facebook/Twitter/Whatsapp</li>
</ul>

## Local Instance

```sh
git clone https://github.com/AUT-HACKATHON/aut-games.git ./games
```

and then

```
cd ./games && yarn;
cd ./frontend && yarn
cd ..
cp .env.example .env
```

then fill out the .env providing your mongodb information and jwt secret

```
npm run dev
```

## License

<p> 
<strong>The MIT License</strong><br>

Copyright 2021 AUT Games

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

</p>

## Credits

> Discord [@Mac#7445](http://urlecho.appspot.com/echo?status=200&Content-Type=text%2Fhtml&body=%40Mac%237445) &nbsp;&middot;&nbsp;
> Github [@MrGeet](https://github.com/MrGeet) &nbsp;&middot;&nbsp;<br>
> Discord [@Dablakbandit#0001](http://urlecho.appspot.com/echo?status=200&Content-Type=text%2Fhtml&body=Dablakbandit%230001) &nbsp;&middot;&nbsp;
> Github [@AshleyThew](https://github.com/AshleyThew)
