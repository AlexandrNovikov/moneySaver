const Book = require('./models/Book');
const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const _ = require('lodash');
const { secret } = require('./config');
const authSrv = require('./services/authSrv');
const { errorName } = require('./services/constants');
const seed = require('./services/seedData');

const resolvers = {

  books: async (_, args) => {
    if (!args.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }
    let books = await Book.find();
    return books;
  },

  addBook: async (args) => {
    var newBook = new Book({
      title: args.title,
      author: args.author
    });

    var err = await newBook.save();

    if (err) return err;
    return newBook
  },
  removeBook: async (args) => {
    var doc = await Book.findOneAndRemove({
      title: args.title
    });

    return doc
  },

  async categories (args, user) {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    return await Category.find({userId: user.user.id});
  },

  addCategory: async (args, user) => {
      if (!user.user) {
        throw new Error(errorName.NOT_AUTHORIZED);
      }

      if (!args.name || !args.description) {
        throw new Error(errorName.BAD_REQUEST);
      }

      let category = await new Category({
        id: authSrv.generateId(),
        userId: user.user.id,
        name: args.name,
        description: args.description,
        isIncome: args.isIncome,
      });

      try {
        await category.save();
      } catch (error) {
        throw new Error(errorName.UNKNOWN_ERROR);
      }

      return category;
  },

  removeCategory: async (args, user) => {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    if (!args.id) {
      throw new Error(errorName.BAD_REQUEST);
    }

    return await Category.findOneAndRemove({
      id: args.id
    });
  },

  updateCategory: async (args, user) => {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    if (!args.id || (!args.name && !args.description)) {
      throw new Error(errorName.BAD_REQUEST);
    }

    let updatedData = (!args.name) ? {description: args.description} :
        (!args.description) ? {name: args.name} :
        {name: args.name, description: args.description};

    return await Category.findOneAndUpdate({id: args.id}, {$set:updatedData}, {new: true}, (err) => {
        if (err) throw new Error(errorName.UNKNOWN_ERROR);
      });
  },

  async transactions (args, user) {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    if(args.categoryId && !_.isUndefined(args.isIncome)) {
       return await Transaction.find({ userId: user.user.id, categoryId: args.categoryId, isIncome: args.isIncome });
    } else if (args.categoryId)  {
      return await Transaction.find({ userId: user.user.id, categoryId: args.categoryId });
    } else if (!_.isUndefined(args.isIncome)) {
      return await Transaction.find({ userId: user.user.id, isIncome: args.isIncome });
    }

    return await Transaction.find({ userId: user.user.id });
  },

  addTransaction: async (args, user) => {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    category = await Category.findOne({ id: args.categoryId, userId: user.user.id });

    if (!category || !args.amount || _.isUndefined(args.isIncome)) {
      throw new Error(errorName.BAD_REQUEST); //TODO check getting this and same in all endpoints
    }

    let transaction = await new Transaction({
      id: authSrv.generateId(),
      userId: user.user.id,
      categoryId: args.categoryId,
      amount: args.amount,
      description: args.description || '',
      isIncome: args.isIncome,
    });

    try {
      await transaction.save();
    } catch (error) {
      throw new Error(errorName.UNKNOWN_ERROR);
    }

    return transaction;
  },

  // FINALIZED Handles getting current user data
  async me (_, args) { //TODO  Model.findById read about it in mongoose docs https://mongoosejs.com/docs/queries.html
    if (!args.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    return await User.findOne({ id: args.user.id });
  },

  // FINALIZED Handles user signup
  async signup (args) {
    if (!authSrv.isEmailValid(args.email)){
      throw new Error(errorName.INVALID_EMAIL);
    }
    const emailUsed = await User.findOne({ email: args.email});
    if (emailUsed){
      throw new Error(errorName.ALREADY_USED_EMAIL);
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = await bcrypt.hashSync(args.password, salt);
    let user = await new User({
        id: authSrv.generateId(),
        username: args.username,
        email: args.email,
        password: hash
      });

    try {
      await user.save();
    } catch (error) {
      throw new Error(errorName.UNKNOWN_ERROR);
    }

    try {
      await seed.seedDefaultCategories(user.id);
    } catch (error) {
      throw new Error(errorName.UNKNOWN_ERROR);
    }

    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: '1d' }
    )
  },

  // FINALIZED Handles user login
  async login (args) {
    const user = await User.findOne({ email: args.email});
    if (!user) {
      throw new Error(errorName.NOT_REGISTERED_EMAIL);
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if (!valid) {
      throw new Error(errorName.INVALID_PASSWORD);
    }

    // return json web token
    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: '1d' }
    )
  }

};


module.exports = resolvers;
