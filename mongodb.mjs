import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI

export const client = new MongoClient(uri)

async function run() {
    try {
        await client.connect()
        console.log("successfully connected")
    } catch (err) {
        console.log(err.stack)
        await client.close()
        process.exit(1)
    }
}

run().catch(console.dir)

process.on('SIGNINT', async function() {
    console.log("app is terminating")
    await client.close()
    process.exit(0)
})
