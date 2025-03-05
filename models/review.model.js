const Mongoose = require("mongoose"); // Inkludera mongoose 

// Skapa schema för recensioner 
const reviewSchema = Mongoose.Schema({
    bookId: {
        type: String,
        required: true
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId, // Koppla ihop med användare baserat på id 
        ref: "User",
        required: true
    },
    reviewText: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now 
    }
}); 

// Skapa model för recensioner 
const Review = Mongoose.model("Review", reviewSchema);

// Exporta model 
module.exports = Review; 