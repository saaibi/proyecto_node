var express = require("express");//framework 
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var formidable = require("express-formidable");
var RedisStore = require("connect-redis")(session);
var http = require("http");
var realtime = require("./realtime");

var methodOverride = require("method-override");

var app = express();
var server = http.Server(app);

var sessionMiddleware = session({
	store: new RedisStore({}),
	secret:"seper ultra secret word"
});

realtime(server,sessionMiddleware);

app.use("/public",express.static('public'));

//app.use(bodyParser.json());//para peticiones application json
//app.use(bodyParser.urlencoded({extended:true}));

/* /app */
/* / */

app.use(methodOverride("_method"))


app.use(sessionMiddleware);
/*
app.use(cookieSession({
	name:"session",
	keys: ["llave-1","llave2"]
}));
*/

app.use(formidable({ 
	keepExtensions: true,
	uploadDir: 'public/imagenes',
	multiples: true,
}));

app.set("view engine","jade");

 app.get("/",function (req,res) {
	res.render("index",{userLogeado:req.session.user_id});
});

app.get("/singup", function(req,res){
	//User.find(function(err,doc){
	//	console.log(doc);
		res.render("singup");
	//});
});

app.get("/login", function(req,res){
	res.render("login");
});

app.get("/users", function(req,res){
	console.log("Usuario logeado " + req.session.user_id);
	User.find(function(err,users) {
		if (err) {res.redirect("/");return;}
		console.log(users);
		res.render("app/users/index",{users:users})
	});
});

app.route("/users/:id")
.delete(function(req,res) {
	User.findOneAndRemove({_id: req.params.id},function(err) {
		if(!err){
			res.redirect("/users");
		}
		else {
			console.log(err);
			res.redirect("/users"+req.params.id);
		}
	});
});

app.post("/users", function(req,res){
	
	var user = new User({
		email:req.fields.email,
		username:req.fields.username,
		password:req.fields.password,
		password_confirmation:req.fields.password_confirmation
	});

	/* callback
	user.save(function(err){
		if (err){
			console.log(String(err));	
		}
		res.send("Guardamos tus datos ");
	});
	*video 23
    */

    //promesas 
	user.save().then(function(us) { 
		res.redirect("/");
		console.log("Guardamos el usuario exitosamente")
	},function(err){
		if (err){
			console.log(String(err,user,numero));
			res.send("No pudimos guardar el usuario")
		}
	});

});

app.post("/sessions", function(req,res){
	//find
	//findOne
	//findById
	User.findOne({email:req.fields.email, password:req.fields.password},function (err,user) {
		req.session.user_id = user._id;
		console.log(user);
		res.redirect("/app");
	});
});

app.use("/app",session_middleware);
app.use("/app",router_app);

server.listen(8090);


//npm install -g nodemon