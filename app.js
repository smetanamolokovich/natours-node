const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello world!' })
})

app.post('/', (req, res) => {
    res.send('You can post to this endpoint')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running server on port ${port}...`);
});