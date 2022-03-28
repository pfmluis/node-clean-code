import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect(connectionUrl: string) {
    this.client = await MongoClient.connect(connectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect() {
    await this.client.close()
  },

  getConnection(name: string): Collection {
    return this.client.db().collection(name)
  },
}