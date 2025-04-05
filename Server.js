const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { createEvent, getEvents, deleteEvent } = require('./Event');
const { saveQueue, getQueues } = require('./Queue');

const app = express();

app.use(cors());
app.use(express.json());

// Define routes
app.post('/api/event', createEvent);
app.get('/api/events', getEvents);
app.delete('/api/event', deleteEvent);

app.post('/api/queue', saveQueue);
app.get('/api/queue', getQueues);

// Export the app wrapped in serverless-http
module.exports.handler = serverless(app);
