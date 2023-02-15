
     function Auth  (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      } else {
        res.render('404')
      }
    }
  
    module.exports = {
    Auth: Auth,
    }