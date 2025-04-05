const express = require('express');
const cors = require('cors');
const { createEvent, getEvents, deleteEvent} = require('./Api/Event');
const { saveQueue, getQueues } = require('./Api/Queue');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


app.post('/api/event', createEvent);
app.get('/api/events', getEvents);
app.delete('/api/event', deleteEvent);


app.post('/api/queue', saveQueue);
app.get('/api/queue', getQueues);