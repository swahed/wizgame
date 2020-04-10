const express = require('express');
const app = express();

const port = 4000;

app.get("/", (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

app.get("/json", (req, res) => {
    res.status(200).json({ name: 'Hello world' });
});

const server = app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

module.exports = server;
