var ArduinoFirmata = require('arduino-firmata');
var arduino = new ArduinoFirmata();

arduino.on('connect', function(){

  console.log("board version"+arduino.boardVersion);

  arduino.pinMode(2, ArduinoFirmata.INPUT);
  arduino.pinMode(3, ArduinoFirmata.INPUT);
  arduino.pinMode(5, ArduinoFirmata.INPUT);

  arduino.pinMode(6, ArduinoFirmata.OUTPUT);
  arduino.pinMode(7, ArduinoFirmata.OUTPUT);
  arduino.pinMode(8, ArduinoFirmata.OUTPUT);


  arduino.digitalWrite(6, false);
  arduino.digitalWrite(7, false);
  arduino.digitalWrite(8, false);


});

arduino.on('digitalChange', function(e){
  console.log("pin" + e.pin + " : " + e.old_value + " -> " + e.value);
});

arduino.connect('/dev/ttyUSB0');
