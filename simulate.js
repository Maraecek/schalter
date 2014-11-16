var net = require('net');
var socket = new net.Socket();


function random (low, high) {
    return Math.random() * (high - low) + low;
}

function getMessage(){

	var s1 = Math.round(random(0,1));
	var s2 = Math.round(random(0,1));
	var s3 = Math.round(random(0,1));
	var message = '';
		message += 'Connection from 192.168.82.2 port 8181 [tcp/*] accepted\n';
		message += 'POST /ps/status HTTP/1.0\n';
		message += 'Content-Type: application/x-www-form-urlencoded\n';
		message += 'Host: 192.168.82.2\n';
		message += 'User-Agent: arduino/uno3\n';
		message += 'Accept: */*\n';
		message += 'Content-Length: 40\n';
		message += '{"tor":"'+s1+'","verwaltung":"'+s2+'","lager":"'+s3+'"}\n';
	return message;
}


function sendStatus(){

	socket.connect (8181, "localhost", function() {
		console.log('CONNECTED TO: localhost:' + 8181);
		// Write a message to the socket as soon as the client is connected, the server will   receive it as message from the client 
		socket.write( getMessage() );
	});
}


socket.on('error', function(exception){
  console.log('Exception:');
  console.log(exception);
});


socket.on('drain', function() {
  console.log("drain!");
});

socket.on('timeout', function() {
  console.log("timeout!");
});

// Add a 'close' event handler for the client socket
socket.on('close', function() {
   console.log('Connection closed');
});


setInterval(function(){
	sendStatus();
},2000);