const axios = require('axios');

const KEY = 'iCsjLKTgn1JPvjTh1$WY0R-21BTPl_#rbgX!HY5TOo3GGy!qQrt@A%z!@FEN3%St';

const sheetUrl = 'https://api.sheetbest.com/sheets/6f03e89f-9aa1-43ed-a155-980fac8c4da4';
const headers = {
    'API-KEY': KEY
};

const createEvent = async (req, res) => {
    const obj = {
        Event_id: req.body.Event_id,
        Event_name: req.body.Event_name,
        Number_of_queues: req.body.Number_of_queues,
        Timestamp: req.body.Timestamp,
    };

    try {
        await axios.post(sheetUrl, obj, { headers });
        res.status(200).json({ message: 'Event created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event' });
    }
};

const getEvents = async (req, res) => {
    try {
        const response = await axios.get(sheetUrl, { headers });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events' });
    }
};

const deleteEvent = async (req, res) => {
    const Event_id = String(req.body.Event_id); // Ensure Event_id is a string
    const deleteUrl = `https://api.sheetbest.com/sheets/6f03e89f-9aa1-43ed-a155-980fac8c4da4/Event_id/*${Event_id}*`;

    try {
        const response = await axios.delete(deleteUrl, { headers });

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: 'Error deleting event' });
    }
};







module.exports = {
    createEvent,
    getEvents,
    deleteEvent
};
