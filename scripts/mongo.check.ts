import { MongoClient } from "mongodb";

// One-time Atlas round-trip proof: connect, ping, insert, read, delete.
// Run: npx tsx --env-file=.env.local scripts/mongo.check.ts
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "lantern");
  await db.command({ ping: 1 });
  const col = db.collection("_healthcheck");
  const r = await col.insertOne({ at: Date.now(), by: "mongo.check" });
  const found = await col.findOne({ _id: r.insertedId });
  await col.deleteOne({ _id: r.insertedId });
  await client.close();
  console.log(`mongo.check: connect+ping+insert+read+delete OK (roundtrip=${!!found}, db=${db.databaseName})`);
}
main().catch((e) => { console.error("mongo.check FAILED:", e.message); process.exit(1); });
