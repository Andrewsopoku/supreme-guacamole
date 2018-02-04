module.exports = function(app) {

    var controller = require('../controllers/appController.js');

    // Create a new Note
    app.post('/register', controller.register);
     app.get('/gethome', controller.gethome);

}
