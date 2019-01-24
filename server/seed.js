const { MongoClient } = require('mongodb');
const assert = require('assert');
const { dbURL, dbName, collectionName } = require('./config');

let books = [
    {
        'title': 'David and Goliath',
        'author': 'Malcolm Gladwell'
    },
    {
        'title': 'Steve Jobs',
        'author': 'Walter Isaacson'
    }
];

let user = {
    'id': 1,
    'username': 'admin',
    'email': 'admin@test.com',
    'password': '$2a$10$pxTXuSslfmZA/SLIfu7QlOm6c8KI2TGDWwhQ68P6bPlzH4fbtdyQC' //123
  };

// Connect to the server
MongoClient.connect(dbURL, function(err, client) {
    assert.equal(null, err);
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const collectionUser = db.collection('user');

    collection.insertMany(books, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Documents inserted!')
        }

    });

  collectionUser.insert(user, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Users inserted!')
      }

      client.close()
    })
});
