const { MongoClient, ObjectId } = require('mongodb');

// Get database info via ID
async function getDocumentById(id) {
  const client = await MongoClient.connect('mongodb+srv://michael:12345@cluster0.6zrrdun.mongodb.net/test');
  const db = client.db('test');
  const collection = db.collection('todos');
  const document = await collection.findOne({ _id: ObjectId(id) });
  await client.close();
  return document;
}

// define the main function
async function main() {
  const document = await getDocumentById('63f0e440bd5925de63595359');
  console.log(document);
}

// call the main function
main();


  
