const Book = require('./models/Book');
const User = require('./models/User');
const Category = require('./models/Category');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const { secret } = require('./config');
const authSrv = require('./services/authSrv');
const { errorName } = require('./services/constants');
const seed = require('./services/seedData');
ObjectId.prototype.valueOf = function () {
  return this.toString();
};

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

  async category(args, user) {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    if (!args.id) {
      throw new Error(errorName.BAD_REQUEST);
    }

    return await Category.find({ userId: user.user.id, _id: args.id });
  },

  async categories(args, user) {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    const filters = (!_.isUndefined(args.isIncome)) ? { userId: user.user.id, isIncome: args.isIncome } : { userId: user.user.id };

    return await Category.find(filters);
  },

  addCategory: async (args, user) => {
      if (!user.user) {
        throw new Error(errorName.NOT_AUTHORIZED);
      }

      if (!args.name || !args.description) {
        throw new Error(errorName.BAD_REQUEST);
      }

      let category = await new Category({
        userId: user.user.id,
        name: args.name,
        description: args.description,
        isIncome: args.isIncome,
      });

      try {
        return await category.save();
      } catch (error) {
        throw new Error(errorName.UNKNOWN_ERROR);
      }
  },

  removeCategory: async (args, user) => {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    if (!args.id) {
      throw new Error(errorName.BAD_REQUEST);
    }

    return await Category.findOneAndRemove({
      _id: args.id
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

    return await Category.findOneAndUpdate({_id: args.id, userId: user.user.id}, {$set: updatedData}, {new: true}, (err) => {
        if (err) throw new Error(errorName.UNKNOWN_ERROR);
      });
  },

  addTransaction: async (args, user) => {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    category = await Category.findOne({ _id: args.categoryId, userId: user.user.id });

    if (!category || !args.amount) {
      throw new Error(errorName.BAD_REQUEST);
    }

    const index = category.transactions.push({amount: args.amount, description: args.description || ''});

    try {
      const test = await category.save();
      return test.transactions[index - 1];
    } catch (error) {
      throw new Error(errorName.UNKNOWN_ERROR);
    }
  },

  removeTransaction: async (args, user) => {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    if (!args.id) {
      throw new Error(errorName.BAD_REQUEST);
    }

    category = await Category.findOne({ 'transactions._id': args.id, userId: user.user.id });

    let removed = category.transactions.id(args.id).remove();

    try {
      await category.save();
    } catch (error) {
      throw new Error(errorName.UNKNOWN_ERROR);
    }

    return removed;
  },

  updateTransaction: async (args, user) => {
    let {id, amount, description, createdAt} = args.input;

    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    if (!id || (!amount && !description && !createdAt)) {
      throw new Error(errorName.BAD_REQUEST);
    }

    category = await Category.findOne({ 'transactions._id': id, userId: user.user.id });
    let updating = category.transactions.id(id);

    const test = await Category.findOneAndUpdate({ userId: user.user.id, 'transactions._id': id },
      { $set: { "transactions.$.amount": amount || updating.amount, "transactions.$.description": description || updating.description,
          "transactions.$.createdAt": createdAt || updating.createdAt }}, { new: true }, (err) => {
      if (err) throw new Error(errorName.UNKNOWN_ERROR);
    });

    return test.transactions.id(id);
  },

  async me(args, user) {
    if (!user.user) {
      throw new Error(errorName.NOT_AUTHORIZED);
    }

    return await User.findById(user.user.id)
  },

  async signup(args) {
    let {email, password, username} = args;

    if (!authSrv.isEmailValid(email)){
      throw new Error(errorName.INVALID_EMAIL);
    }
    const emailUsed = await User.findOne({ email: email});
    if (emailUsed){
      throw new Error(errorName.ALREADY_USED_EMAIL);
    }

    let hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    let user = await new User({ username, email, password: hash });

    try {
      await user.save();
    } catch (error) {
      throw new Error(errorName.UNKNOWN_ERROR);
    }

    try {
      await seed.seedDefaultCategories(user._id);
    } catch (error) {
      throw new Error(errorName.UNKNOWN_ERROR);
    }

    return jsonwebtoken.sign(
      { id: user._id, email: user.email },
      secret,
      { expiresIn: '1d' }
    )
  },

  async login (args) {
    const user = await User.findOne({ email: args.email});
    if (!user) {
      throw new Error(errorName.NOT_REGISTERED_EMAIL);
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if (!valid) {
      throw new Error(errorName.INVALID_PASSWORD);
    }

    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: '1d' }
    )
  }

};

module.exports = resolvers;
