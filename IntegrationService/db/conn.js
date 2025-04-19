const { MongoClient } = require('mongodb');

const connectionString = "mongodb://mongo:27017";
const client = new MongoClient(connectionString);
let db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("insuranceDB");
        console.log("✅ IntegrationService connected to insuranceDB");
        return db;
    } catch (e) {
        console.error("❌ IntegrationService DB error:", e);
    }
}

module.exports = connectToDatabase;
