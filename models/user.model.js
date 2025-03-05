const Mongoose = require("mongoose"); // Inkludera mongoose 
const bcrypt = require("bcrypt"); // Inkludera bcrypt för hashning av lösenord 

// Skapa schema för användare 
const userSchema = Mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Jämför hashat lösen 
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

// Skapa model för användare 
const User = Mongoose.model("User", userSchema);

// Exportera model 
module.exports = User; 