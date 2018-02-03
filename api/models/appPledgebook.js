'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Pledgebook = new Schema({
  personid: {
    type: String
    required: 'Kindly enter the name of the task'
  },
  satisfied:{
	 type: boolean,
	 default: false
  },
  locked :{
  type:boolean,
  default:false
  },
 
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pledgesbook', Pledgebook);

