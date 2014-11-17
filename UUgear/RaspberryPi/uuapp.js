var net = require('net');
var pack = require( 'hipack' ).pack;

var buffer =  pack( "CC", [ 1,0x03 ] );
	buffer += pack( "CC", [ 0x02,24]) + "UUGear-Arduino-3606-9222";

// This server listens on a Unix socket at /var/run/mysocket
var socketclient = net.connect({
		path: "/tmp/uugear_socket_broker.sock"
		},
    	function() { //'connect' listener
	  		console.log('client connected');
	  		socketclient.write(buffer);
  		}
  	);

socketclient.on('data', function(data) {
  console.log(data.toString());
  socketclient.end();
});
socketclient.on('end', function() {
  console.log('client disconnected');
});