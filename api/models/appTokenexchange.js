'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Tokenexchange= new Schema({
  userid: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
   tranxid: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
  amount:{
	 type: Number,
	 required: 'required' 
  }
  ,
  amountaftercharge:{
	 type: Number
	 
  },
   token:{
	 type: Number,
	 required: 'required' 
  },
  purchase:{
  type:Boolean,
  default:false
  },
 message:{
	  type:String
	  
  }
  ,
  Created_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('tokenexchange', Tokenexchange);

