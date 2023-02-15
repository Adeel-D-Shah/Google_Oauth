// //Debuging--------------------------------
// app.get('/check-session', (req, res) => {
//   if (req.session) {
//     res.send('Session has been created!');
//   } else {
//     res.send('Session has not been created!');
//   }
//   console.log(req.session);
// });
// app.get('/tc', (req, res) => {
//   // Set a test cookie
//   console.log('cookie created');
//   res.cookie('test2', 'test2', { maxAge: 900000, httpOnly: true});

//   // Redirect to a page that will check if the cookie was set
//   res.send('cookie set');
// });
// app.get('/cc', (req, res) => {res.send(req.cookies);});




// //Testing--------------------------------

require('dotenv').config()
const express = require('express') ;
const passport = require('passport') ;
const Strategy = require('passport-google-oauth20').Strategy ;
const session = require('express-session')
const {Auth} = require('./middleware/auth')
const ejs = require('ejs');

const app = express();
app.set('view engine','ejs')
app.listen(3000, () => {
    console.log('server is started');
})
app.use(
      session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
      })
  )
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

passport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));

app.get('/',(req,res) => { res.render('login')})
app.get('/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/google/callback', passport.authenticate('google', {failureRedirect: '/auth/fail'}),
    (req, res, next) => {
        console.log(req.isAuthenticated());
        res.redirect('/dash')
    })

app.get('/auth/fail', (req, res, next) => {
    res.send('user logged in failed');
});

app.get('/logout', (req, res, next) => {
    req.logout(()=>{
      res.redirect('/')
    });
    ;
});
app.get('/dash',Auth,(req,res)=>{
 
  const data = {
    name: req.user.name.givenName,
    email: req.user.email,
    id: req.user.id,
    dp: req.user.photos[0].value
  }
  console.log(data);
  res.render('dash',{data: data})})
