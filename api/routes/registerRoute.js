module.exports = function(app,passport) {

    var controller = require('../controllers/appController.js');

    // Create a new Note
    app.post('/register', controller.register);
     app.get('/gethome', controller.gethome);
      app.post('/updateuser', controller.updateuser);
      app.post('/buytoken', controller.buytoken);
      app.post('/buytokencallback', controller.buytokenCallback);
      app.post('/makepledge', controller.makePledge);
      app.post('/makepledgecallback', controller.makePledgecallback);
     
     
      app.post('/makepledgecallback', controller.makePledgecallback);
     app.post('/fshwjwwjwwvwvwv', controller.createfirst);
     
         app.get('/login', function(req, res) {
			res.render('signin.ejs', { message: req.flash('loginMessage') }); 
				});
				
  app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signin.ejs', { message: req.flash('signupMessage') });
    });
    
       app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
       app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
        app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    
      app.get('/dashboard', isLoggedIn, function(req, res) {
        res.render('dashboard.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
		app.get('/makematch', controller.makematch);

    
      app.post('/makematch', controller.makematch);

  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

}
