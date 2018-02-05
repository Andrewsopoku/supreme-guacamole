module.exports = function(app) {

    var controller = require('../controllers/appController.js');

    // Create a new Note
    app.post('/register', controller.register);
     app.get('/gethome', controller.gethome);
      app.post('/updateuser', controller.updateuser);
      app.post('/buytoken', controller.buytoken);
      app.post('/buytokencallback', controller.buytokenCallback);
      

}
