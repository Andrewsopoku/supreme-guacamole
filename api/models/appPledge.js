'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Pledge = new Schema({
	  pledgeid: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
  fromid: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
  toid:{
	 type: String,
	 required: 'required' 
  },
  toname:{
	type:String  
	  
  },
  tonumber:{
	  
	  type:String  
  },
  topic:{
	 type:String   
  },
  satisfied:{
	  
	type:Boolean,
	default:false  
  },
  lock:{
	  
	type:Boolean,
	default:false 
	  
  },
  Modify_date: {
    type: Date,
    default: Date.now,
     lastModified: true
  }
});



module.exports = mongoose.model('Pledges', Pledge);

