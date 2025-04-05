const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const { createEvent, getEvents, deleteEvent } = require('./Event');
const { saveQueue, getQueues } = require('./Queue');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/event', createEvent);
app.get('/events', getEvents);
app.delete('/event', deleteEvent);

app.post('/queue', saveQueue);
app.get('/queue', getQueues);

module.exports.handler = serverless(app);
