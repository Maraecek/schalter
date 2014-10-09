var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var serialPort = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});


serialPort.on("open", function () {
	serialPort.on('data', function(data) {
		var message = JSON.parse(data);
		var welcome = [];
		if (message.isArray){
			welcome = message;
			for (var i = 0 ; i < welcome.length; i++) {
				console.log(welcome[i]);
			};
		} else {
			console.log(JSON.stringify(data));
		}

	});
});

serialPort.on("close", function () {
	console.log("conncetion lost");
	process.exit(1);
});

serialPort.on("error", function () {
	console.log("conncetion lost");
	process.exit(1);
});


