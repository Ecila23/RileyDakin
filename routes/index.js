var express = require("express");
var router  = express.Router();
var Rsvp = require("../models/rsvp");

//root route
router.get("/", function(req, res){
    res.render("home");
});

//lovestory route
router.get("/lovestory", function(req, res){
    res.render("lovestory");
});

//useful bits routes
router.get("/useful", function(req, res){
    res.redirect("/useful/tna");
});
router.get("/useful/tna", function(req, res){
    res.render("useful/tna");
});
router.get("/useful/fnd", function(req, res){
    res.render("useful/fnd");
});
router.get("/useful/otd", function(req, res){
    res.render("useful/otd");
});
router.get("/useful/faq", function(req, res){
    res.render("useful/faq");
});

//our crew route
router.get("/ourcrew", function(req, res){
    res.render("ourcrew");
});

//blog route
router.get("/blog", function(req, res){
    res.render("blog");
});
 
//rsvp routes
//new - show form to create new rsvp 
router.get("/rsvp/new", function(req, res){
    res.render("rsvp/new");
});

//create - create new rsvp
router.post("/rsvp", function(req, res){
    // get data from form and add to rsvps array
    var name = req.body.name;
    var email = req.body.email;
    var attending = req.body.attending;
    var diet = req.body.diet;
    var song = req.body.song;
    
    var newRsvp = {name: name, email: email, attending: attending, diet: diet, song: song};
    // Create a new rsvp and save to DB
    Rsvp.create(newRsvp, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to home page
            req.flash("success", "RSVP sent!");
            res.redirect("/");
        }
    });
});

//index - show all rsvps (admin only)
router.get("/rsvp", function(req, res){
    // Get all rsvps from DB
    Rsvp.find({}, function(err, allRsvps){
       if(err){
           console.log(err);
       } else {
          res.render("rsvp/index",{rsvp:allRsvps});
       }
    });
});

// show - shows more info about one rsvp
router.get("/rsvp/:id", function(req, res){
    //find the rsvp with provided ID
    Rsvp.findById(req.params.id).exec(function(err, foundRsvp){
        if(err){
            console.log(err);
        } else {
            console.log(foundRsvp);
            //render show template with that campground
            res.render("rsvp/show", {rsvp: foundRsvp});
        }
    });
});

// edit
router.get("/rsvp/:id/edit", function(req, res) {
    console.log(req.params.id);
    Rsvp.findById(req.params.id, function(err, foundRsvp){
        if(err){
            console.log(err);
            res.redirect("/rsvp");
        } else {
            res.render("rsvp/edit", {rsvp: foundRsvp});
        }
    });
});

//update
router.put("/rsvp/:id", function(req, res){
    Rsvp.findByIdAndUpdate(req.params.id, req.body.rsvp, function(err, updatedRsvp){
        if(err){
            res.redirect("/rsvp");
        } else {
            req.flash("success", "Successfully updated rsvp!");
            res.redirect("/rsvp/" + req.params.id);
        }
    });
});

//destroy
router.delete("/rsvp/:id", function(req, res){
   Rsvp.findByIdAndRemove(req.params.id, function(err){
      if(err){
          console.log(err);
          res.redirect("/rsvp");
      } else {
          req.flash("success", "Successfully deleted rsvp!");
          res.redirect("/rsvp");
      }
   });
});


module.exports = router;