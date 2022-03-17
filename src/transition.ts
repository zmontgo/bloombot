// Database requirements - Connection created at end
import { MongoClient } from 'mongodb';
import config from './config';
import { prisma } from './databaseFiles/connect';

async function transition() {
  // Create connection
  const client = new MongoClient(config.mongodbURI);

  await client.connect();

  // Make sure MongoDB can be accessed outside of this file
  const Keys = client.db(config.mongodbDatabase).collection('Keys');
  const Prefixes = client
    .db(config.mongodbDatabase)
    .collection('Prefixes');
  const Tags = client.db(config.mongodbDatabase).collection('Tags');
  const Announcements = client
    .db(config.mongodbDatabase)
    .collection('Announcements');
  const Current = client
    .db(config.mongodbDatabase)
    .collection('CurrentMeditators');
  const Meditations = client
    .db(config.mongodbDatabase)
    .collection('Meditations');
  const BotStats = client
    .db(config.mongodbDatabase)
    .collection('BotStats');
  const ServerSetup = client
    .db(config.mongodbDatabase)
    .collection('ServerSetup');
  const Stars = client.db(config.mongodbDatabase).collection('Starboard');
  const PickMessages = client
    .db(config.mongodbDatabase)
    .collection('PickMessages');

  var meditations: {
    usr: string,
    date: string,
    time: number,
    guild: string,
  }[] = [];
    
  const data5 = await Meditations.find({}, { projection: { _id:0 }}).toArray();
  console.log(data5)
  await prisma.meditations.createMany({data: meditations, skipDuplicates: true});
  /*const data7: any = await ServerSetup.find().toArray();
  await prisma.tags.createMany({data: data7});
  const data8: any = await Stars.find().toArray();
  await prisma.tags.createMany({data: data8});
  const data9: any = await PickMessages.find().toArray();
  await prisma.tags.createMany({data: data9});
  const data0: any = await Keys.find().toArray();
  await prisma.tags.createMany({data: data0});*/
}

transition()