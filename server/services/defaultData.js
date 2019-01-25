const authSrv = require('./authSrv');

const categories = [
  {
    'name': 'local_taxi',
    'description': 'Taxi',
  },
  {
    'name': 'restaurant',
    'description': 'Food',
  },
  {
    'name': 'train',
    'description': 'Transport'
  },
  {
    'name': 'flight',
    'description': 'Vacation'
  },
  {
    'name': 'fitness_center',
    'description': 'Sport'
  },
  {
    'name': 'school',
    'description': 'Education'
  },
  {
    'name': 'home',
    'description': 'Home'
  },
  {
    'name': 'pets',
    'description': 'Pets'
  },
  {
    'name': 'local_pharmacy',
    'description': 'Health'
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
