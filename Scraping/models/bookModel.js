const mongoose=require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true
        },
        stock:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;