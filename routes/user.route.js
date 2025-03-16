const userController = require("../controllers/user.controller"); // Inkludera användar-controller  
const { userValidation } = require("../middleware/validateuser"); // Inkludera användare-valiering från middleware 
const { options } = require("joi"); 

// Routes 
module.exports = (server) => {
    server.route([
        // Hämta alla användare 
        {
            method: "GET",
            path: "/users",
            handler: userController.getAllUsers,
            options: {
                auth: false
            }
        },
        // Hämta användare per id 
        {
            method: "GET",
            path: "/users/{id}",
            handler: userController.getUserById,
            options: {
                auth: false
            }
        },
        // Skapa ny användare 
        {
            method: "POST",
            path: "/users",
            handler: userController.createUser,
            options: {
                auth: false,
                validate: {
                    payload: userValidation,
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
        },
        // Uppdatera användare 
        {
            method: "PUT",
            path: "/users/{id}",
            handler: userController.updateUser,
            options: {
                auth: false
            }
        },
        // Ta bort användare 
        {
            method: "DELETE",
            path: "/users/{id}",
            handler: userController.deleteUser,
            options: {
                auth: false
            }
        },
        // Logga in 
        {
            method: "POST",
            path: "/login",
            handler: userController.loginUser,
            options: {
                auth: false,
                validate: {
                    payload: userValidation,
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
        },
        // Logga ut användare 
        {
            method: "GET",
            path: "/logout",
            handler: userController.logoutUser,
            options: {
                auth: false
            }
        },
        // Kontrollera inloggad användare 
        {
            method: "GET",
            path: "/checkuser",
            handler: userController.checkUser,
            options: {
                auth: "session" 
            }
        }
    ]);
};