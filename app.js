var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    User            = require("./models/user"),
    Rsvp            = require("./models/rsvp");

//requring routes
var indexRoutes     = require("./routes/index")
    // rsvpRoutes      = require("./routes/rsvp")

mongoose.connect("mongodb://localhost/rileydakin");
// mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "The best names begin with an A",
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        expires: (1000 * 60 * 60 * 24 * 28)
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);

app.listen(3000, "localhost", function(){
   console.log("The Server Has Started!");
});