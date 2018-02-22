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
		,fb_email:req.body.fb_email,fb_name:req.body.fb_name,token:400});

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
			a['status']=user[0].status;
			//homedetail.push(a);
			
			Info.find({query:{},$orderby: {Created_date : -1 }}, function(err, user) {
        if(err) {
            res.status(500).send({message: "Could not find a user with this id "});
        }else{
			
			a['info']=user;
			//homedetail.push(a);
			
			 
	Pledge.findOne({$and: [ {"fromid":req.query.useridd},{"lock":true},{"satisfied":false}]}, function(err, pledge) {
        if(err) {
           a['matched']=false;
           homedetail.push(a);
            res.send(homedetail);
        }else{
			if(pledge){
			console.log(pledge);
			
			a['match']=pledge;
			
			//homedetail.push(a);
			a['matched']=true;
           homedetail.push(a);
           
			res.send(homedetail);
		}else{
			
			     a['matched']=false;
           homedetail.push(a);
            res.send(homedetail);
			
		}
			
		}});
			
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
				
				if(user[0].token<100)
				
				
				{
					res.status(400).send({message: "Your token is too low. Purchase from store"});
				}
				
				
			else{	
				
			 UsersInfo.update({_id:req.body.useridd}, {$inc:{token:-100}},function(err, data){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(data);
				
             }
        }); 
			
				
				//console.log(user[0]);				
	   var pbook=new Pledgebook({personid:req.body.useridd});
	   
	    pbook.save(function(err, data) {
        
			
             if(err) {
                res.status(400).send({message: "Something went wrong"});
                console.log(err);
             } 
             else {
              	
			
              
              //Pledgebook.update({_id:data._id}, {$set:{tranxid:json["Data"].TransactionId}});
					
               
				 res.send({message:"Marching in progress. You will be matched to someone soon"});
             }
		 
        }); 
			  
				
			}
				
			}
			
			else{
			res.status(401).send({message: "Could not find a user with this id  "});
			console.log("user not found");
			console.log(user);
				
			}
			}});
	   
	   }
   };
   
 	
   exports.loadpledge = function(req, res) {
	   
	    
	 if((!req.body.useridd) || (!req.body.amt)) {
        res.status(400).send({message: "You are lost"});
        console.log("attacker here");
    }
   else {
	  
	  
	Pledge.find({$and:[{"toid":req.body.useridd},{"lock":true}]}, function(err, pledge) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
        }else{
			// console.log("andrews");
			if(pledge[0]){
				console.log(pledge[0])
				res.send(pledge)
			}
			else{
				
				console.log(pledge)
				res.status(400).send({message: "no pledge available"});
			}
			}});  
  }  
	   
	   
   };
	
  	

   exports.makePledgeconfirm = function(req, res) {

	   
	 if((!req.body.useridd) || (!req.body.p_id)) {
        res.status(400).send({message: "You are lost"});
        console.log("attacker here");
    }
   else {
	  
	   
	   
	   Pledge.update({"_id":req.body.p_id},{$set:{satisfied:true}},function(err, data){
            
             if(err) {
                console.log(err);
             } 
             else {
               console.log(data);
				
             }
        }); 
	   
	  Pledge.find({"_id":req.body.p_id},function(err,respl){
		  if(err)
		 
		  {
			   console.log(err)
			  res.status(400).send({message: "something went wrong"});
			  
		  }else
		if(respl[0]){
			
			Pledgebook.update({"_id":respl[0].frompid},{$set:{paid:true}},function(err, data){
            
             if(err) {
              //  res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(data);
				
             }
        }); 
        
        Pledgebook.update({"_id":respl[0].pledgeid},{$set:{satisfied:true}},function(err, data){
            
             if(err) {
               // res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(data);
				
             }
        }); 
        
        
        	 UsersInfo.find({'_id':respl[0].fromid},function(err,user){
					 
					 if(err){
						 
						 
					 }
					 else{
							var p=new Pledge({pledgeid:respl[0].frompid, toid:respl[0].fromid,toname:user[0].momo_name,tonumber:user[0].momo_number,topic:user[0].profilePictureUrl});
	    p.save(function(err, pledge) {
         
				 
               if(err) {
              //  res.status(400).send({message: "Something went wrong"});
                console.log(err);
             } 
             else {
				 
				 
				 
				 
			 }}); 
					
					
					
									var pp=new Pledge({pledgeid:respl[0].frompid, toid:respl[0].fromid,toname:user[0].momo_name,tonumber:user[0].momo_number,topic:user[0].profilePictureUrl});
	    pp.save(function(err, pledge) {
         
				 
               if(err) {
               // res.status(400).send({message: "Something went wrong"});
                console.log(err);
             } 
             else {
				 
				 
				 
				 
			 }}); 
						 
					 }});
					 
					 
        UsersInfo.update({"_id":respl[0].fromid},{$inc:{pledge:1}},function(err, data){
            
             if(err) {
               // res.status(500).send({message: "Could not update user with id"});
             } 
             else {
               console.log(data);
				
             }
        }); 
       res.send("all set");
		console.log(respl);	 
		 
		  
		 } 
	  });				
						
	 
	  } 
   };

	
exports.makematch = function(req, res) {
	pbooker=[];
	
	a={};
	  if (req.method == "POST") {
      
     console.log( req.body);
    
		Pledgebook.find({ _id: req.body.pb },function(err, pledgebook) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
       
       
        }else{
			var ppp=Pledge.find({$and: [{toid:pledgebook[0].personid},{_id:req.body.pledge}]}).count(function(err,co){
				
			console.log(co);

			
			
			if(co>0){
				
					Pledgebook.find({ $and: [ {satisfied:false},{paid:false},{locked:false} ] },function(err, pledgebook) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
       
       
        }else{
	  		
			Pledge.find({ $and:[{satisfied:false},{lock:false}] },function(err, pledge) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
       
       
        }else{
	  				
	res.render('match.ejs', {pledgebook:pledgebook,pledge:pledge,message:"Cant match same person's pledge"} );
	
	
}
});		
	
	
}
});
	
				
			}
			else{
			
			console.log(pledgebook)
			
			UsersInfo.find({"_id":pledgebook[0].personid},function(err,userdata){
				
							Pledge.update({_id:req.body.pledge}, {$set:{fromid:pledgebook[0].personid,lock:true,fromname:userdata[0].momo_name,fromnumber:userdata[0].momo_number,
								frompic:userdata[0].profilePictureUrl,frompid:req.body.pb}},function(err, datau){
					
				
      Pledgebook.update({_id:req.body.pb}, {$set:{locked:true}},function(err, datao){
				
						
		Pledgebook.find({ $and: [ {satisfied:false},{paid:false},{locked:false} ] },function(err, pledgebook) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
       
       
        }else{
	  		
			Pledge.find({ $and:[{satisfied:false},{lock:false}] },function(err, pledge) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
       
       
        }else{
	  				
	res.render('match.ejs', {pledgebook:pledgebook,pledge:pledge,message:"Pledge completed"} );
	
	
}
});		
	
	
}
});
					
					
					
				});
				
				});
  
 }); 
}
  
  
  				});
  }});
    }else{
		
		
		Pledgebook.find({ $and: [ {satisfied:false},{paid:false},{locked:false} ] },function(err, pledgebook) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
       
       
        }else{
	  		
			Pledge.find(  { $and:[{satisfied:false},{lock:false} ]},function(err, pledge) {
        if(err) {
            res.status(400).send({message: "Could not find a user with this id  "});
       
       
        }else{
	  				
	res.render('match.ejs', {pledgebook:pledgebook,pledge:pledge,message:""} );
	
	
}
});		
	
	
}
});
	
	
	
	/*  		
			
	  		var v=Pledgebook.find({ $and: [ {satisfied:false},{paid:true},{locked:false} ] }).populate({
    "path": "usersinfos",
    "match": { "_id": "personid"
		}
		})
.exec(function(err,entries) {
   // Now client side filter un-matched results
   entries = entries.filter(function(entry) {
	   console.log(entries)
       return entry.personid != null;
   });
   // Anything not populated by the query condition is now removed
});		
	  		
	  	 console.log(v)	
for (var key in pledgebook) {
    if (pledgebook.hasOwnProperty(key)) {
		if(key=="_id"){
       console.log( pledgebook['_id']);
    
    
		 a['pledgeid']=pledgebook['_id']
	    
   		UsersInfo.find({_id:pledgebook['personid']},function(err, datau){
            
             if(err) {
                res.status(500).send({message: "Could not update user with id"});
             } 
             else {
            
				a['name']=datau[0].momo_name;
			pbooker.push(a);
             }
        }); 
    
    
    }
    }
   
}
	
	
			  
*/
}
};


	
exports.createfirst = function(req, res) {
	 if(!req.body.gotit) {
        res.status(400).send({message: "Facebook ID required"});
       
    }
   else {
		var pbook=new Pledgebook({personid:req.body.gotit,satisfied:true,paid:true,lock:true});
	    pbook.save(function(err, data) {
        
			
             if(err) {
                res.status(400).send({message: "Something went wrong"});
                console.log(err);
             } 
             else {
				 
				 UsersInfo.find({'_id':req.body.gotit},function(err,user){
					 
					 if(err){
						 
						 
					 }
					 else{
							var p=new Pledge({pledgeid:data._id, toid:req.body.gotit,toname:user[0].momo_name,tonumber:user[0].momo_number,topic:user[0].profilePictureUrl});
	    p.save(function(err, pledge) {
         
				 
               if(err) {
                res.status(400).send({message: "Something went wrong"});
                console.log(err);
             } 
             else {
				 
				 
				 
				 
			 }}); 
						 
					 }});
					 
				 
			
           }});
		   
		
		
	res.send();
}
};


exports.info = function(req, res) {
	
	  if (req.method == "POST") {
    if(! req.body.infotitle || ! req.body.infomessage){
		res.render('info.ejs', {message:"Title or message missing"} );
		
	}
	else{
		    var info = new Info({title: req.body.infotitle,message:req.body.infomessage});

    info.save(function(err, data) {
        
        if(err) {
			
			res.render('info.ejs', {message:"Something went wrong"} );
			
		}else{
			res.render('info.ejs', {message:"Info saved"} );
			
		}
			
		
	});
	
	}
       
        }else{
			
			Info.find({},function(err,info){
				if(err){
					res.render('info.ejs', {message:"Welcome"} );
				}else{
					
					res.render('info.ejs', {info:info,message:"Welcome"} );
				}
				
				
			});
	  				
	
	
	
}
	

};

