var UsersInfo = require('../models/appUser.js');


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
