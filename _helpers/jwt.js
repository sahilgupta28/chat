const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {

    console.log('In Jwt');
    const secret = config.secret;
    console.log("secret",secret);

    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/player-login',
            '/users/register',
             '/',
        ]
    });
}

async function isRevoked(req, payload, done) {
 const user = await userService.getById(payload.sub);
   // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};