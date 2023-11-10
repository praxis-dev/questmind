import { Module, Global } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Global()
@Module({
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async () => {
        const uri = process.env.MDB_URI;
        const client = new MongoClient(uri, {
          /* options */
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class DatabaseModule {}
