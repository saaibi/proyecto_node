var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/fotos");
//colleciones =>tablas
//Documentos =>filas

var posibles_valores = ["M","F"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,"Correo no valido"];

var password_validation = {
    validator: function(p) {
		return this.password_confirmation == p;
	} ,
	 massage: "Las contraseñas no son iguales"
}

var user_schema = new Schema({
	name:{type:String},
	last_name:String,
	username:{type:String,required:"Username requerido",maxlength:[50,"UserName muy grande"]},
	password:{
		type:String,
		minlength:[8,"Contraseña muy corta"],
		validate: password_validation
		},
	age: {type:Number,min:[5,"la edad no puede ser menor que 5"],max:[100,"La edad no puede ser mayor a 100"]},
	email:{type:String ,required: "El correo es obligatorio",match:email_match},
	date_of_birth:Date,
	sex: {type:String,enum:{values: posibles_valores, menssage:"Opción no válida"}}
});



user_schema.virtual("password_confirmation").get(function () {
	return this.p_c;
}).set(function (password) {
	this.p_c = password;
});

user_schema.virtual("full_name").get(function () {
	return this.name + this.last_name;
}).set(function (full_name) {
	var words = full_name.split(" ");
	this.name = words[0];
	this.last_name = words[1];
});


//Users
var User = mongoose.model("User",user_schema);

module.exports.User = User;


/*
String
Number
Date
Buffer
Boolean
Mixed
Objectid
array
*/