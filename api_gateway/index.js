require('dotenv').config();
const express = require('express');
const cote = require('cote');



const app = express();
app.use(express.json());

// Requesters to communicate with microservices
const agentRequester = new cote.Requester({ name: 'agent-requester', key: 'customer' });
const salesRequester = new cote.Requester({ name: 'sales-requester', key: 'sales' });
const notificationRequester = new cote.Requester({ name: 'notification-requester', key: 'notification' });
const aggregatorRequester = new cote.Requester({ name: 'aggregator-requester', key: 'aggregator' });

/**
 * GET /agents
 * List all agents
 */
app.get('/agents', async (req, res) => {
    try {
        const agents = await agentRequester.send({ type: 'list' });
        res.send(agents);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch agents' });
    }
});

/**
 * GET /insurances
 * List all insurance sales
 */
app.get('/insurances', async (req, res) => {
    try {
        const insurances = await salesRequester.send({ type: 'list' });
        res.send(insurances);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch insurances' });
    }
});

/**
 * POST /addInsurance
 * Add insurance + agent + optionally notify
 */
app.post('/addInsurance', async (req, res) => {
    try {
        const insurance = await salesRequester.send({ type: 'update', info: req.body });
        const agent = await agentRequester.send({ type: 'update', info: req.body });

        // Optionally notify when target is reached — customize based on your logic
        // await notificationRequester.send({ type: 'sendReminder', info: req.body });

        res.send({ insurance, agent });
    } catch (error) {
        res.status(500).send({ error: 'Failed to add insurance and agent' });
    }
});

/**
 * GET /aggregated
 * Fetch aggregated sales info
 */
app.get('/aggregated', async (req, res) => {
    try {
        const data = await aggregatorRequester.send({ type: 'aggregate' });
        res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch aggregated data' });
    }
});

/**
 * POST /notify
 * Manually trigger a notification (optional utility)
 */
app.post('/notify', async (req, res) => {
    try {
        const response = await notificationRequester.send({
            type: 'sendNotification',
            ...req.body // ✅ directly spread the email, subject, message
        });
        res.send(response);
    } catch (error) {
        res.status(500).send({ error: 'Notification failed' });
    }
});

// Start API Gateway
app.listen(3000, () => {
    console.log('🌐 API Gateway running at http://localhost:3000');
});
