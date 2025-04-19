require('dotenv').config();
const cote = require('cote');
const { MongoClient } = require('mongodb');



const responder = new cote.Responder({ name: 'aggregator-responder', key: 'aggregator' });

responder.on('aggregate', async (req, cb) => {
    const client = new MongoClient("mongodb://mongo:27017");

    try {
        await client.connect();
        const db = client.db("insuranceDB");

        const result = await db.collection("sales").aggregate([
            { $group: { _id: "$agent", totalSales: { $sum: "$sales" } } }
        ]).toArray();

        cb(null, result); // Success: send result back
    } catch (err) {
        console.error("❌ AggregatorService error:", err.message);
        cb({ error: "Aggregation failed" }); // Error: send failure back
    } finally {
        await client.close();
    }
});
