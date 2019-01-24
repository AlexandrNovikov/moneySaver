const authSrv = require('./authSrv');

const categories = [
  {
    'name': 'taxi',
    'description': 'Taxi',
  },
  {
    'name': 'food-variant',
    'description': 'Food',
  },
  {
    'name': 'bus',
    'description': 'Transport'
  },
  {
    'name': 'beach',
    'description': 'Vacation'
  },
  {
    'name': 'dumbbell',
    'description': 'Sport'
  },
  {
    'name': 'hanger',
    'description': 'Clothes'
  },
  {
    'name': 'home',
    'description': 'Home'
  },
  {
    'name': 'paw',
    'description': 'Pets'
  },
];

module.exports = {
  addIds: function(userId) {
    categories.forEach(function (elem) {
      elem['id'] = authSrv.generateId();
      elem['userId'] = userId
    });

    return categories
  }
};
