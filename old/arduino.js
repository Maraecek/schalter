var ArduinoFirmata = require('arduino-firmata');
var arduino = new ArduinoFirmata();

arduino.connect('/dev/ttyUSB0');
//geht nur mit SimpleDigitalFirmata.ino

var led6 = false;

arduino.on('connect', function(){

  console.log("board version"+arduino.boardVersion);
  arduino.pinMode(2, ArduinoFirmata.INPUT);
  arduino.pinMode(3, ArduinoFirmata.INPUT);
  arduino.pinMode(5, ArduinoFirmata.INPUT);

  arduino.pinMode(6, ArduinoFirmata.OUTPUT);
  arduino.pinMode(7, ArduinoFirmata.OUTPUT);
  arduino.pinMode(8, ArduinoFirmata.OUTPUT);

  arduino.digitalWrite(2, true);
  arduino.digitalWrite(3, true);
  arduino.digitalWrite(5, true);

  arduino.digitalWrite(6, true);
  arduino.digitalWrite(7, true);
  arduino.digitalWrite(8, true);

  setInterval(function(){
    arduino.digitalWrite(6, led6=!led6, function(){
        //console.log("pin6: ",arduino.digitalRead(6));
    })
  }, 500);

  arduino.on('digitalChange', function(e){
    switch (e.pin){
        case 2:
        case 3:
        case 5:
        // case 6:
        // case 7:
        // case 8:
            console.log("pin" + e.pin + " : " + e.old_value + " -> " + e.value);
    }
  });
 

});




