'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Pledgebook = new Schema({
  personid: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  amt:{
	  type:Number,
	  default:50
  },
  tranxid: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
  message:{
	  type:String
  },
  satisfied :{
	 type: Boolean,
	 default: false
  },
  paid:{
	 type: Boolean,
	 default: false
  },
  locked :{
  type:Boolean,
  default:false
  },
 
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pledgesbook', Pledgebook);

