const axios = require('axios');

const KEY_q = 'w7KsL$LmiGNBeDnG-bphEfpYi4#qm9Q#bNYe7G-$_%x3gVAezwPNeq04E5r1bV@T';
const KEY_event = 'iCsjLKTgn1JPvjTh1$WY0R-21BTPl_#rbgX!HY5TOo3GGy!qQrt@A%z!@FEN3%St';

const sheetUrlQueue = 'https://api.sheetbest.com/sheets/11dd85cd-77c8-4b88-a313-8ae7079c3fbd';
const sheetUrlEvent = 'https://api.sheetbest.com/sheets/6f03e89f-9aa1-43ed-a155-980fac8c4da4';
const headersQueue = {
    'API-KEY': KEY_q
};
const headersEvent = {
    'API-KEY': KEY_event
}

const saveQueue = async (req, res) => {
    const { Event_id, Name } = req.body;

    if (!Event_id || !Name) {
        return res.status(400).json({ message: "ต้องระบุ Event_id และ Name" });
    }

    try {
        // 1. โหลดข้อมูลงานทั้งหมด
        const eventRes = await axios.get(sheetUrlEvent, { headersEvent });
        const events = eventRes.data;
        const selectedEvent = events.find(event => event.Event_id === Event_id);

        if (!selectedEvent) {
            return res.status(404).json({ message: "ไม่พบงานที่เลือก" });
        }

        const maxQueue = parseInt(selectedEvent.Number_of_queues);
        const Event_name = selectedEvent.Event_name;

        // 2. โหลด queue ทั้งหมด
        const queueRes = await axios.get(sheetUrlQueue, { headersQueue });
        const queues = queueRes.data;

        // 3. ตรวจสอบว่า Name ซ้ำหรือยัง (เฉพาะในงานเดียวกันเท่านั้น)
        const nameExists = queues.some(q => q.Event_name === Event_name && q.Name === Name);
        if (nameExists) {
            return res.status(409).json({ message: "ชื่อของคุณถูกใช้ไปแล้วในงานนี้ กรุณาเลือกชื่อใหม่" });
        }

        // 4. หาคิวที่ถูกจองไปแล้ว (เฉพาะในงานนี้)
        const takenQueues = new Set(
            queues
                .filter(q => q.Event_name === Event_name)
                .map(q => parseInt(q.Queue_number))
        );


        const allQueueNumbers = Array.from({ length: maxQueue }, (_, i) => i + 1);
        const availableQueues = allQueueNumbers.filter(q => !takenQueues.has(q));

        if (availableQueues.length === 0) {
            return res.status(409).json({ message: "คิวเต็มแล้ว" });
        }

        // 5. สุ่มคิว
        const randomIndex = Math.floor(Math.random() * availableQueues.length);
        const selectedQueue = availableQueues[randomIndex];

        // 6. บันทึกลง Google Sheet
        const Timestamp = new Date().toISOString();

        await axios.post(sheetUrlQueue, [{
            Event_name,
            Queue_number: selectedQueue,
            Name,
            Timestamp
        }], { headersQueue });

        // 7. ส่งคิวที่จองได้กลับไป
        res.status(201).json({ Queue_number: selectedQueue });

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการจองคิว" });
    }
};

const getQueues = async (req, res) => {
    try {
        const response = await axios.get(sheetUrlQueue, { headersQueue });
        res.status(200).json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ message: "Failed to fetch queues" });
    }
};


module.exports = {
    saveQueue, getQueues
};
