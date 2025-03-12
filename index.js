'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require("mongoose"); // Inkludera mongoose
require("dotenv").config(); // Inkludera dotenv 
const auth = require("./auth"); // Importera autentiserings-fil 

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 5000, // Port 5000 för backend 
        host: "0.0.0.0", // "localhost", // host: "0.0.0.0"
        routes: {
            cors: {
                origin: ["*"], // ["http://localhost:5173"], // ["*"], // Tillåt alla cors-anrop
                credentials: true,
                maxAge: 86400,
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin"]
            }
        }
    });

     // Anslut till mongoDB
     mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Ansluten till MongoDB");
    }).catch((error) => {
        console.error("Något gick fel vid anslutning till databasen: " + error); 
    });

    // Registera autentisering 
    await auth.register(server);

    // Registrera routes 
   require("./routes/review.route")(server);
   require("./routes/user.route")(server);


    await server.start(); // Starta server 
    console.log('Server running on %s', server.info.uri);
};

// Hantera fel 
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init(); // Kör igång servern