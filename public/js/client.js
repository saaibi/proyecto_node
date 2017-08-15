var socket = io();

//cuando llega un mensaje desde express
socket.on("new image",function (data) {
	data = JSON.parse(data);
	console.log(data);

	var container = document.querySelector("#imagenes");
	var source = document.querySelector("#image-template").innerHTML;
	var template = Handlebars.compile(source);

	//var source   = $("#image-template").html();
    //var template = Handlebars.compile(source);

	container.innerHTML  = template(data) + container.innerHTML ; 
});