var express = require("express"),
	passport = require("passport"),
	mongoose  = require("mongoose"),
	bodyParser = require("body-parser"),
	User 		= require("./model/user"),
	localStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/auth_demo_app", {useNewUrlParser : true});


var app = express();
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
	secret : "Allahu Akbar!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function (req, res) {
	res.render("home")
});

app.get("/secret",isLoggedIn, function (req, res) {
	res.render("secret")
});

app.get("/register", function (req,res) {
	res.render("register")
});

app.post("/register", function (req,res) {
	User.register(new User({username : req.body.username}), req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		});
	});
});

app.get("/login", function (req,res) {
	res.render("login")
});

app.post("/login",passport.authenticate( "local", {
	successRedirect: "/secret",
	failureRedirect: "/register"
}), function (req, res) {

});

app.get("/logout", function (req,res) {
	req.logout();
	res.redirect("/");
});

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen(10624, function() {
	console.log("the server has started")
});