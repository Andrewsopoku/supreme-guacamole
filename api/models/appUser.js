'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserInfo = new Schema({
  momo_name: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
   momo_number: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
    momo_network: {
    type: String
    //required: 'Kindly enter the name of the task'
  },
  fb_id:{
	 type: String,
	 required: 'required',
	   unique:true
  },
  fb_phone:{
  type: String,
  

  },
  profilePictureUrl:{
	  
	  type:String
  },
  fb_pageLink:{
	  
	  type:String
  },
  fb_email:{
	  
	  type:String
  },
  token:{
	 type:Number
	}  
  ,
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'active'
  }
});

module.exports = mongoose.model('UsersInfo', UserInfo);

