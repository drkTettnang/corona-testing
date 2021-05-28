
const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8011;

const opts = {
	key: fs.readFileSync(path.join(__dirname, 'certs', 'server_key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'certs', 'server_cert.pem')),
	requestCert: true,
	ca: [
		fs.readFileSync(path.join(__dirname, 'certs', 'server_cert.pem'))
	]
};

const app = express();

app.use(express.json());

let counter = 0;

app.post('/api/v1/quicktest/results', (req, res) => {
	const cert = req.socket.getPeerCertificate();

	console.log(`Incoming request from ${cert.subject.CN}`, req.body);

    if (++counter % 3 === 0) {
        console.log('Respond with success');
        res.sendStatus(204);
    } else {
        console.log('Respond with error');
        res.sendStatus(500);
    }
});

https.createServer(opts, app).listen(PORT, () => {
	console.log(`Server listening on port ${PORT}...`);
});