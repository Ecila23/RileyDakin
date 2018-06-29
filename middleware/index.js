var Rsvp = require("../models/rsvp");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/register");
};

// middlewareObj.checkRsvpOwnership = function(req, res, next){
//   if(req.isAuthenticated()) {
//       Rsvp.findById(req.params.id, function(err, foundRsvp){
//           if(err){
//               res.redirect("back");
//           } else {
//               if(foundRsvp.user.id.equals(req.user._id)){
//                   next();
//               } else {
//                   res.redirect("back");
//               }
//           }
//       })
//   } else {
//       res.redirect("back");
//   }  
// };

middlewareObj.checkRsvpOwnership = function(req, res, next){
  if(req.isAuthenticated()) {
      Rsvp.findById(req.params.id, function(err, foundRsvp){
          console.log(foundRsvp);
          if(err){
              console.log(err);
              res.redirect("back");
          } else {
              if(foundRsvp.author.id.equals(req.user._id)){
                  next();
              } else {
                  res.redirect("back");
              }
          }
      })
   } else {
      res.redirect("back");
  }  
};


module.exports = middlewareObj;