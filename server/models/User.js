const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Book schema for embedded documents
const bookSchema = new Schema(
  {
    bookId: {
      type: String,
      required: true,
    },
    authors: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match a valid email address!'],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  savedBooks: [bookSchema],
});

// Pre-save middleware to hash passwords
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Instance method to check password validity
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;