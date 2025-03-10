const User = require("../models/user.model"); // Inkludera användar-model 
const Jwt = require("@hapi/jwt"); // Inkludera jwt 
const bcrypt = require("bcrypt"); // Inkludera bcrypt
require("dotenv").config(); // Inkluder dotenv-fil 

// Hämta alla användare 
exports.getAllUsers = async (request, h) => {
    try {
        const users = await User.find();
        // om inga användare finns 
        if (users.length === 0) {
            return h.response("Hittade inga användare").code(404);
        }
        // Annars hämta de som finns 
        return h.response(users).code(200);
        // Fånga fel 
    } catch (error) {
        return h.response(error).code(500);
    }
};

// Hämta användare baserat på id 
exports.getUserById = async (request, h) => {
    try {
        const user = await User.findById(request.params.id);
        return h.response(user).code(200);
        // Fånga fel 
    } catch (error) {
        console.error("Kunde inte hitta användare: ", error);
        return h.response(error).code(500);
    }
};

// Skapa ny användare 
exports.createUser = async (request, h) => {
    try {
        const { username, password } = request.payload;
        // Kontrollera om användare redan finns 
        const userExist = await User.findOne({ username });
        if (userExist) {
            return h.response({ message: "Användarnamnet är upptaget, välj något annat" }).code(400);
        }

        // Hasha lösenord 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Skapa och spara nya användaren 
        const user = new User({ username, password: hashedPassword });
        const savedUser = await user.save();
        return h.response({ message: "Användare skapad.", user: { username: savedUser.username } }).code(201);

        // Fånga fel 
    } catch (error) {
        console.error(error);
        return h.response({ message: error.message }).code(500);
    }
};

// Uppdatera användare baserat på id 
exports.updateUser = async (request, h) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, request.payload, { new: true });
        // Om användaren inte hittas 
        if (!updatedUser) {
            return h.response("Kunde inte hitta användare för att uppdatera").code(404);
        }
        // annars returnera uppdaterad användare 
        return h.response(updatedUser).code(200);
        // Fånga fel 
    } catch (error) {
        return h.response(error).code(500);
    }
};

// Ta bort användare baserat på id 
exports.deleteUser = async (request, h) => {
    try {
        const user = await User.findByIdAndDelete(request.params.id);
        return user || h.response("Kunde inte hitta användare att ta bort").code(404);

        // Fånga fel 
    } catch (error) {
        console.error(error).code(500);
    }
};


// Logga in 
exports.loginUser = async (request, h) => {
    // Hämta data från payload 
    const { username, password } = request.payload;
    try {
        // Hämta användare från databasen 
        let user = await User.findOne({ username: username });
        // Kontrollera användaruppgifter 
        if (!user) {
            return h.response({ message: "Felaktigt användarnamn eller lösenord" }).code(401);
        }
        // jämför lösenord med hashad lösen och kontrollera om korrekt 
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return h.response({ message: "Felaktigt användarnamn eller lösenord" }).code(401);
        }

        // Exkludera lösenord 
        user = await User.findOne({ username: username }, { password: 0 });
        // Skapa token 
        const token = generateToken(user);
        // Skapa http-cooke 
        return h.response({ 
            message: "Lyckad inloggning.",
            user: user,
        })
        .state("jwt", token);

        // Fånga fel 
    } catch (error) {
        console.error("Fel vid inloggning: ", error);
        return h.response({ message: error.message }).code(500);
    }
};

// Logga ut 
exports.logoutUser = async (request, h) => {
    try {
        // Ta bort cookie 
        h.unstate("jwt");
        return h.response({ message: "Utloggning lyckades." }).code(200);
        // Fånga fel 
    } catch (error) {
        return h.response({ message: "Misslyckad utloggning." }).code(500);
    }
};


// Kontrollera inloggad användare 
exports.checkUser = async (request, h) => {
    try {
        // kontroll av autentiserad användare 
        if (!request.auth.isAuthenticated) {
            return h.response({ message: "Inte inloggad" }).code(401);
        }

        // Hämta användarinfo från credentials
        const user = request.auth.credentials;
        return h.response({ message: "Användare inloggad", user }).code(200);

        // Fånga fel 
    } catch (error) {
        console.error("Fel vid kontroll av inloggning: ", error);
        return h.response({ message: error.message }).code(500);
    }
};

// Generera JWT-token 
const generateToken = user => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_SECRET_KEY, algorithm: 'HS256' },
        { ttlSec: 24 * 60 * 60 * 1000 } // 24 timmar 
    );
    return token;
}