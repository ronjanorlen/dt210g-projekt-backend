const Review = require("../models/review.model"); // Inkludera recension-model 

// Hämta alla recensioner 
exports.getAllReviews = async (request, h) => {
    // const { bookId } = request.query; // bokId 
    // // om bokId inte finns 
    // if (!bookId){
    //     return h.response({ error: "Du måste ange bookId" }).code(400);
    // }

    try {
        const reviews = await Review.find().populate("userId", "username"); // Hämta användare 
        // om det inte finns några recensioner 
        if (reviews.length === 0) {
            return h.response("Hittade inga recensioner").code(404);
        }
        // Annars returnera recensioner 
        return reviews;
        // fånga fel 
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

// Hämta recension baserat på id 
exports.getSingleReview = async (request, h) => {
    try {
        const review = await Review.findById(request.params.id).populate("userId", "username");
        return review || h.response("Hittade inte recensionen").code(404);
        // fånga fel 
    } catch (error) {
        return h.response({ error: error.message }).code(500);
    }
};

// Lägg till ny recension 
exports.createReview = async (request, h) => {
    try {
        const review = new Review(request.payload); // Ta data från payload 
        return await review.save(); // Spara recension 
        // Fånga fel 
    } catch (error) {
        console.error("Något gick fel vid skapande av recension: ", error);
        return h.response(error).code(500);
    }
};

// Uppdatera en recension 
exports.updateReview = async (request, h) => {
    try {
        const { id } = request.params; 
        const updating = request.payload;
       // const userId = request.auth.credentials.id; // Hämta id från inloggad användare 

        // kontrollera att recension finns och korrekt användare 
       // const review = await Review.findOneAndUpdate({ _id: id, userId }, updating, {new: true });

       const review = await Review.findByIdAndUpdate(id, updating, { new: true });

       // om recension inte hittas eller fel användare 
       if (!review) return h.response("Recensionen hittades inte eller så har du inte behörighet att uppdatera").code(404);

       // Annars returnera uppdaterad recension
       return h.response(review).code(200);

        // Fånga fel 
    } catch (error) {
        return h.response({ error: error.message }).code(500);
    }
};

// Ta bort recension 
exports.deleteReview = async (request, h) => {
    try {
        const review = await Review.findById(request.params.id); // Hämta id på recension 
        // om recension inte finns 
        if (!review) 
            return h.response("Hittade inte recensionen").code(404);

        // Kontrollera användare 
        // if (review.userId.toString() !== request.auth.credentials.id) {
        //     return h.response("Du kan inte ta bort någon annans recension").code(403);
        // }

        await review.deleteOne(); // Ta bort recension 
        return h.response({ message: "Recensionen togs bort" }).code(204);

        // Frånga fel 
    } catch (error) {   
       return h.response({ error: error.message }).code(500);
    }
};

