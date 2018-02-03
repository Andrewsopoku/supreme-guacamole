'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Pledge = new Schema({
  from: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
  to:{
	 type: String,
	 required: 'required' 
  },
  from_received:{
  type:boolean
  },
 to_received:{
	  type:boolean
	  
  },
  credit:{
	 type:int 
	}  
  ,
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending'
  }
});

module.exports = mongoose.model('Pledges', Pledge);

