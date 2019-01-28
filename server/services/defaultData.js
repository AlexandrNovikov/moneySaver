const authSrv = require('./authSrv');

const categories = [
  {
    'name': 'local_taxi',
    'description': 'Taxi',
    'isIncome': false,
  },
  {
    'name': 'restaurant',
    'description': 'Food',
    'isIncome': false,
  },
  {
    'name': 'train',
    'description': 'Transport',
    'isIncome': false,
  },
  {
    'name': 'flight',
    'description': 'Vacation',
    'isIncome': false,
  },
  {
    'name': 'fitness_center',
    'description': 'Sport',
    'isIncome': false,
  },
  {
    'name': 'school',
    'description': 'Education',
    'isIncome': false,
  },
  {
    'name': 'home',
    'description': 'Home',
    'isIncome': false,
  },
  {
    'name': 'pets',
    'description': 'Pets',
    'isIncome': false,
  },
  {
    'name': 'local_pharmacy',
    'description': 'Health',
    'isIncome': false,
  },
  {
    'name': 'attach_money',
    'description': 'Salary',
    'isIncome': true,
  },
  {
    'name': 'account_balance',
    'description': 'Deposit',
    'isIncome': true,
  },
  {
    'name': 'account_balance_wallet',
    'description': 'Savings',
    'isIncome': true,
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
