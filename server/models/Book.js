const { Schema, model } = require('mongoose');

// Define the Book schema
const bookSchema = new Schema(
  {
    bookId: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate book entries by bookId
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
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Book model
const Book = model('Book', bookSchema);

module.exports = Book;