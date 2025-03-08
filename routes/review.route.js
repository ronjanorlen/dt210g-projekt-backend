const reviewController = require("../controllers/review.controller"); // Inkludera recension-controller 
const { reviewValidation } = require("../middleware/validatereview"); // Inkludera middleware för recensioner 
// const auth = require("../auth"); // inkluera autentisering 

// Routes 
module.exports = (server) => {
    server.route([
        // Startpunkt 
        {
            method: "GET",
            path: "/",
            handler: (request, h) => {
                return h.response({ message: "Projekt DT210G" });
            },
            options: {
                auth: false
            }
        },
        // Hämta alla recensioner 
        {
            method: "GET",
            path: "/reviews",
            handler: reviewController.getAllReviews,
            options: {
                auth: false
            }
        },
        // Hämta en recension
        {
            method: "GET",
            path: "/reviews/{id}",
            handler: reviewController.getSingleReview,
            options: {
                auth: false
            }
        },
        // Hämta inloggad användares recensioner 
        {
            method: "GET",
            path: "/reviews/user",
            handler: reviewController.getUserReviews
        },
        // Lägg till recension 
        {
            method: "POST",
            path: "/reviews",
            handler: reviewController.createReview,
             options: {
                auth: false,
                validate: {
                     payload: reviewValidation,
                     failAction: (request, h, err) => {
                         throw err;
                     }
                 },
             }
        },
        // Uppdatera recension 
        {
            method: "PUT",
            path: "/reviews/{id}",
            handler: reviewController.updateReview,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: reviewValidation,
            //         failAction: (request, h, err) => {
            //             throw err;
            //         }
            //     },
            // }
        },
        // Ta bort recension 
        {
            method: "DELETE",
            path: "/reviews/{id}",
            handler: reviewController.deleteReview,
             options: {
                 auth: false
             }
        },
    ]);
};