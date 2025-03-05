const Cookie = require('@hapi/cookie'); // Inkludera cookie-plugin 
const Jwt = require('@hapi/jwt'); // Inkludera jwt-plugin 
require("dotenv").config(); // Inkludera dotenv 

module.exports = {
    register: async (server) => {
        await server.register([Cookie, Jwt]);

        // Registrera cookie-strategi
        server.auth.strategy('session', 'cookie', {
            cookie: {
                name: "jwt",
                password: process.env.COOKIE_PASSWORD, // Hemligt lösenord för att kryptera cookie 
                path: "/",
                isSecure: true, // HTTPS
                ttl: 24 * 60 * 60 * 1000, // Giltig i 24 timmar
                isSameSite: "None",
                clearInvalid: true,
                isHttpOnly: true
            },
            // Validera cookie 
            validate: async (request, session) => {
                try {
                    const token = session; // Hämta token

                    if (!token) {
                        console.warn("Ingen token hittades i denna session."); 
                        return { isValid: false };
                    }
                    // Dekoda och verifiera JWT-token 
                    const artifacts = Jwt.token.decode(token);

                    try {
                        Jwt.token.verify(artifacts, {
                            key: process.env.JWT_SECRET_KEY,
                            algorithms: ["HS256"]
                        });

                        // Returnera info om autentisering 
                        return {
                            isValid: true,
                            credentials: artifacts.decoded.payload
                        };
                        // Fånga upp fel vid verifiering 
                    } catch (err) {
                        console.error("Fel vid verifiering av token: ", err.message);
                        return { isValid: false };
                    }
                    // Fånga upp fel vid validering
                } catch (err) {
                    console.error("Valideringsfel: ", err.message);
                    return { isValid: false };
                }
            }
        });

        // Default-strategi = "session"
        server.auth.default("session");
    },
};