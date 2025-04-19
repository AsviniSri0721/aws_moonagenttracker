require('dotenv').config();
const connectToDatabase = require("./db/conn.js");
const cote = require('cote');


let db;
async function connectDB() {
    db = await connectToDatabase();
}
connectDB();

const salesResponder = new cote.Responder({ name: 'sales-responder', key: 'sales' });

salesResponder.on('list', async () => {
    const sales = await db.collection("sales").find().toArray();
    return sales;
});

salesResponder.on('update', async (req) => {
    const result = await db.collection("sales").insertOne(req.info);
    return result;
});
