var express = require("express");
var router  = express.Router();
var Rsvp = require("../models/rsvp");
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

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
 

// login routes 
// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username, 
        admin: false
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/rsvp/new");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/rsvp",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});
 
 
//rsvp routes
//new - show form to create new rsvp 
router.get("/rsvp/new", middleware.isLoggedIn, function(req, res){
    res.render("rsvp/new");
});

//create - create new rsvp
router.post("/rsvp", middleware.isLoggedIn,function(req, res){
    // get data from form and add to rsvps array
    var name = req.body.name;
    var email = req.body.email;
    var attending = req.body.attending;
    var diet = req.body.diet;
    var song = req.body.song;
    var other = req.body.other;
    
    var newRsvp = {
        name: name, 
        author:{
            id: req.user._id,
            email: email
        },
        attending: attending, 
        diet: diet, 
        song: song,
        other: other
    };
    Rsvp.create(newRsvp, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//index - show all rsvps (admin only)
router.get("/rsvp", middleware.isLoggedIn, function(req, res){
    Rsvp.find({}, function(err, allRsvps){
       if(err){
           console.log(err);
       } else {
          res.render("rsvp/index",{rsvp:allRsvps});
       }
    });
});

// show - shows more info about one rsvp
router.get("/rsvp/:id", middleware.checkRsvpOwnership, function(req, res){
    Rsvp.findById(req.params.id).exec(function(err, foundRsvp){
        if(err){
            console.log(err);
        } else {
            console.log(foundRsvp);
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
          res.redirect("/rsvp");
      }
   });
});


module.exports = router;