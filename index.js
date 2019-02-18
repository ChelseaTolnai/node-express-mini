// implement your API here

const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());

server.post('/api/users', (req, res) => {
    const { name, bio, created_at, updated_at} = req.body;
    if (!name || !bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
        return
    } else {
        db
        .insert({ name, bio, created_at, updated_at})
        .then(resp => {
            res.status(201).json(resp);
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while saving the user to the database' });
        });
    }
});

server.get('/api/users', (req, res) => {
    db
    .find()
    .then(resp => {
        res.status(200).json(resp)
    })
    .catch(() => {
        res.status(500).json({ error: 'The users information could not be retrieved.' })
    });
});

server.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db
    .findById(userId)
    .then(resp => {
        if (!resp) {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' })
        } 
        res.status(200).json(resp);
    })
    .catch(() => {
        res.status(500).json({ error: 'The user information could not be retrieved.' })
    });
});


server.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db
    .findById(userId)
    .then(resp => {
        if (!resp) {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' })
        } 
        res.status(200).json(resp);
        db
        .remove(userId)
        .then(resp => {
            if(!resp) {
                res.status(404).json({ message: 'The user with the specified ID does not exist.' })
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'The user could not be removed' })
        });
    })
    .catch(() => {
        res.status(500).json({ error: 'The user could not be removed' })
    });
});

server.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, bio, created_at, updated_at} = req.body;
    if (!name || !bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
        return
    } else {
        db
        .update(userId, { name, bio, created_at, updated_at})
        .then(resp => {
            if(!resp) {
                res.status(404).json({ message: 'The user with the specified ID does not exist.' })
            }
            db
            .findById(userId)
            .then(resp => {
                res.status(200).json(resp);
            })
            .catch(() => {
                res.status(500).json({ error: 'The user information could not be retrieved.' })
            });
        })
        .catch(() => {
            res.status(500).json({ error: 'The user information could not be modified.' })
        });
    }
});

server.listen(8000, () => console.log('API running on port 8000'));