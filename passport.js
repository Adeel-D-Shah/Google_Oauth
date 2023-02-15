require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
            clientID: process.env.GOOGLE_CLIENT_ID,
             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackURL: '/google/callback',
            },
            function (accessToken, refreshToken, profile, done) {
                const newUser = {
                  googleId: profile.id,
                  displayName: profile.displayName,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                  image: profile.photos[0].value,
                }
                try {console.log(newUser)} catch (error) {}
               done(null, newUser)
                
            }
        )
    )

    passport.serializeUser((user, done) => {
        console.log(user)
        done(null, user) })
    passport.deserializeUser((id, done) => {done(null, id)})


}
