const { MongoClient } = require('mongodb');
const assert = require('assert');
const { dbURL } = require('../config');
const { addIds } = require('./defaultData');

const seedData = {

  seedDefaultCategories(userId) {
    let categories = addIds(userId);

    MongoClient.connect(dbURL, function(err, client) {
      assert.equal(null, err);
      console.log('Connected successfully to server');

      const db = client.db('admin');
      const collection = db.collection('categories');

      collection.insertMany(categories, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Categories inserted!')
        }

      });
      client.close()
    });
  },
};


module.exports = seedData;
