require('dotenv').config();
const connectToDatabase = require("./db/conn.js");
const cote = require('cote');



let db;
async function connectDB() {
    db = await connectToDatabase();
}
connectDB();

const agentResponder = new cote.Responder({ name: 'agent-responder', key: 'customer' });

agentResponder.on('list', async () => {
    const agents = await db.collection("agents").find().toArray();
    return agents;
});

agentResponder.on('update', async (req) => {
    const agent = { name: req.info.customer, products: req.info.products || [] };
    const result = await db.collection("agents").insertOne(agent);
    return result;
});
/**finish */