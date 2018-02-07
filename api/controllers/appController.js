var UsersInfo = require('../models/appUser.js');
var Info=require('../models/appInfo.js');
var Tokenexchange=require('../models/appTokenexchange.js');
var request = require('request');
var ObjectID = require('mongodb').ObjectID;
var Pledgebook = require('../models/appPledgebook.js')
var Pledge = require('../models/appPledge.js')




exports.register = function(req, res) {
    // Create and Save a new Note
    if(!req.body.fb_id) {
        res.status(400).send({message: "Facebook ID required"});
        console.log("Phone can not be empty");
    }
   else {
	   

		
    var usersInfo = new UsersInfo({momo_name: req.body.momo_name,momo_number:req.body.momo_number,momo_network:"MTN",fb_id:req.body.fb_id,
		fb_phone:req.body.fb_phone,profilePictureUrl:req.body.profilePictureUrl,fb_pageLink:req.body.fb_pageLink || "NONE"
		,fb_email:req.body.fb_email,fb_name:req.body.fb_name,token:100});

    usersInfo.save(function(err, data) {
        
        if(err) {
			
			console.log(err);
		if(err.code==11000){
				UsersInfo.find({"fb_id":req.body.fb_id}, function(err, user) {
        if(err) {
            res.status(500).send({message: "Could not find a note with id "});
        }
        console.log(user[0]);
        if(user[0].status=='active')
        {
			 
			
			 UsersInfo.update({_id:user[0]._id}, {$set:{momo_name: req.body.momo_name,momo_number:req.body.momo_number,momo_network:"MTN"}},function(err, data){
            
             if(err) {
                res.status(500).send({message: "Could not update note with id"});
             } 
             else {
               
				 res.send(user);
             }
        }); 
			  
		}
		else{
			res.status(500).send({message: "Account Deactivated. Contact Admin"});
			
		}
        //note.content = req.body.content;
/*
       */
    });
			}
			else{
            res.status(500).send({message: "Some error occurred while creating the Note."});
		}
        } else {
            res.send(data);
        }
    });
}
    
    
};



exports.gethome = function(req, res) {
	
	homedetail=[];
	a={};
	
	console.log(req.query);
	if(!req.query.useridd) {
        res.status(400).send({message: "You are lost"});
        console.log("suspect here");
    }
   else {
	   
	UsersInfo.find({"_id":req.query.useridd}, function(err, user) {
        if(err) {
            res.status(500).send({message: "Could not find a user with this id  "});
        }else{
			if(user[0]){
			
			
			a['token']=user[0].token;
			a['pledge']=user[0].pledge;
			homedetail.push(a);
			
			Info.find({}, function(err, user) {
        if(err) {
            res.status(500).send({message: "Could not find a user with this id "});
        }else{
			
			a['info']=user;
			homedetail.push(a);
			res.send(homedetail);
			
		}});
		
	}else{
		  res.status(500).send({message: "Could not find a user with this id  "});
		
	}
    }    
}
);

}
};

exports.updateuser = function(req, res) {
	
	 if(!req.body.useridd) {
        res.status(400).send({message: "You are lost"});
        console.log("attacker here");
    }
   else {
	    UsersInfo.update({_id:req.body.useridd}, {$set:{momo_name:req.body.momo_name,momo_number:req.body.momo_number,city:req.body.city}},function(err, data){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(data);
				 res.send({message:"successful"});
             }
        }); 
			  
	   
   }
	
	
};


exports.buytoken = function(req, res) {
	var token;
	var amt;
	 if((!req.body.useridd) || (!req.body.amt)) {
        res.status(400).send({message: "You are lost"});
        console.log("attacker here");
    }
   else {
	  
	   token=req.body.amt;
	   amt=token/10;
	   
	   
	   UsersInfo.find({"_id":req.body.useridd}, function(err, user) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
        }else{
			// console.log("andrews");
			if(user[0]){
				
				
				//console.log(user[0]);				
	   var tokenexchange=new Tokenexchange({userid:req.body.useridd,amount:amt,token:token});
	    tokenexchange.save(function(err, data) {
        
			
             if(err) {
                res.status(400).send({message: "Something went wrong"});
                console.log(err);
             } 
             else {
              
              var clientref=data._id;
              var momoname=user[0].momo_name;
              var momonumber=user[0].momo_number;
              
                console.log(clientref);
             request.post({url:'https://api.hubtel.com/v1/merchantaccount/merchants/HM3005170017/receive/mobilemoney',
				    headers:{"authorization":"Basic YWlxenByeGI6cGpkZWh2bXg="},
				   form: {"CustomerName":momoname.toString(),"CustomerMsisdn":momonumber.toString(),
					   "Channel":'mtn-gh',"Amount":amt,"PrimaryCallbackUrl":"http://5.150.236.20:8080/buytokencallback","SecondaryCallbackURL":
					   "http://andrews.requestcatcher.com/test",
					   "Description":"Token purchase","ClientReference":clientref.toString()}},
				    function(err,response,body){ 
					   
					   if(err){
						  console.log(err); 
					   }
					   else{
						   
						   var json = JSON.parse(body);
						   
			
						   Tokenexchange.update({_id:data._id}, {$set:{tranxid:json["Data"].TransactionId,amountaftercharge:json["Data"].AmountAfterCharges}});
						  
					   }
					   })
               
				 res.send({message:"Processing payment"});
             }
		 
        }); 
			  
				
				
				
			}
			
			else{
			res.status(401).send({message: "Could not find a user with this id  "});
			console.log("user not found");
			console.log(user);
				
			}
			}});
	   
	   }
   };
   
   
   
   exports.buytokenCallback = function(req, res) {
	   console.log("consulted");
	 console.log(req.body); 
	 
	 
	 if(req.body.ResponseCode=="0000"){
		 
		 
		    Tokenexchange.update({_id:req.body.Data.ClientReference}, {$set:{purchase:true,message:req.body.Data.Description}},function(err, datat){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(datat);
				
             }
        }); 
			  
		    Tokenexchange.find({_id:req.body.Data.ClientReference}, function(err, user) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
        }else{
			// console.log("andrews");
			if(user[0]){
				
				UsersInfo.update({_id:user[0].userid}, {$inc:{token:user[0].token}},function(err, datau){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(datau);
				 //res.send({message:"successful"});
             }
        }); 
			  
		    
				
				
			}
		}});
						
		 
	 }else{
		 console.log(req.body.Data.ClientReference);
		 Tokenexchange.update({_id:new ObjectID(req.body.Data.ClientReference)}, {$set:{message:req.body.Data.Description}},function(err, datatt){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(datatt);
				// res.send({message:"successful"});
             }
        }); 
			  
		    Tokenexchange.find({}, function(err, userd) {
		 console.log(userd);
		 
	 });
	 }
	 
	 
	 
	 res.send({message:"callback"}) 
	   
   };

	

exports.makePledge = function(req, res) {
	var token;
	var amt;
	 if((!req.body.useridd) || (!req.body.amt)) {
        res.status(400).send({message: "You are lost"});
        console.log("attacker here");
    }
   else {
	  
	   
	   
	   UsersInfo.find({"_id":req.body.useridd}, function(err, user) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
        }else{
			// console.log("andrews");
			if(user[0]){
				
				
				//console.log(user[0]);				
	   var pbook=new Pledgebook({personid:req.body.useridd});
	    pbook.save(function(err, data) {
        
			
             if(err) {
                res.status(400).send({message: "Something went wrong"});
                console.log(err);
             } 
             else {
              
              var clientref=data._id;
              var momoname=user[0].momo_name;
              var momonumber=user[0].momo_number;
              
                console.log(clientref);
                
             request.post({url:'https://api.hubtel.com/v1/merchantaccount/merchants/HM3005170017/receive/mobilemoney',
				    headers:{"authorization":"Basic YWlxenByeGI6cGpkZWh2bXg="},
				   form: {"CustomerName":momoname.toString(),"CustomerMsisdn":momonumber.toString(),
					   "Channel":'mtn-gh',"Amount":51,"PrimaryCallbackUrl":"http://5.150.236.20:8080/makepledgecallback","SecondaryCallbackURL":
					   "http://andrews.requestcatcher.com/test",
					   "Description":"Token purchase","ClientReference":clientref.toString()}},
				    function(err,response,body){ 
					   
					   if(err){
						  console.log(err); 
					   }
					   else{
						   
						   var json = JSON.parse(body);
						   console.log(json); 
			
						  Pledgebook.update({_id:data._id}, {$set:{tranxid:json["Data"].TransactionId}});
						  
					   }
					   });
               
				 res.send({message:"Processing payment"});
             }
		 
        }); 
			  
				
				
				
			}
			
			else{
			res.status(401).send({message: "Could not find a user with this id  "});
			console.log("user not found");
			console.log(user);
				
			}
			}});
	   
	   }
   };
   
  	

   exports.makePledgecallback = function(req, res) {
	   console.log("consulted");
	 console.log(req.body); 
	 
	 
	 if(req.body.ResponseCode=="0000"){
		 
		 
		    Pledgebook.update({_id:req.body.Data.ClientReference}, {$set:{paid:true,message:req.body.Data.Description}},function(err, datat){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(datat);
				
             }
        }); 
			  
		    Pledgebook.find({_id:req.body.Data.ClientReference}, function(err, user) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
        }else{
			// console.log("andrews");
			if(user[0]){
				
				UsersInfo.update({_id:user[0].personid}, {$inc:{pledge:1}},function(err, datau){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(datau);
				 //res.send({message:"successful"});
             }
        }); 
			  
		    
				
				
			}
		}});
						
		 
	 }else{
		 console.log(req.body.Data.ClientReference);
		 Tokenexchange.update({_id:new ObjectID(req.body.Data.ClientReference)}, {$set:{message:req.body.Data.Description}},function(err, datatt){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(datatt);
				// res.send({message:"successful"});
             }
        }); 
			  
		    Tokenexchange.find({}, function(err, userd) {
		 console.log(userd);
		 
	 });
	 }
	 
	 
	 
	 res.send({message:"callback"}) 
	   
   };

	
	
