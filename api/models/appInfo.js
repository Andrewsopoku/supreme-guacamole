'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Info = new Schema({
  message: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
   
  Created_date: {
    type: Date,
    default: Date.now
  },

});

module.exports = mongoose.model('info', Info);

