import express from 'express';

const app = express();

app.get('/sensor', (req, res) => {
    const params = req.params
    res.send("Success");
})

app.get('/positions', (req, res) => {
    const positions = {
        "MAC1": {x: 1, y: 5},
        "MAC2": {x: -2, y: 3}
    }
    res.send(positions);
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
