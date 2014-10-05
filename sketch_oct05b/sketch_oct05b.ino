#include <SPI.h>
#include <JsonParser.h>
#include <JsonGenerator.h>

#define DEBUG false

//SCHALTER INIT
#define led_tor 6
#define led_ver 7
#define led_lag 8
//4 ist tot
#define taster_tor 2
#define taster_ver 3
#define taster_lag 5

#define AN LOW
#define AUS HIGH

boolean tor = AUS;
boolean ver = AUS;
boolean lag = AUS;

unsigned long time_pin1 = 0;
unsigned long time_pin2 = 0;
unsigned long time_pin3 = 0;

void setup()
{
  pinMode(led_tor, OUTPUT);
  pinMode(led_ver, OUTPUT);
  pinMode(led_lag, OUTPUT);

  pinMode(taster_tor, INPUT);
  pinMode(taster_ver, INPUT);
  pinMode(taster_lag, INPUT);

  digitalWrite(led_tor,HIGH);
  digitalWrite(led_ver,HIGH);
  digitalWrite(led_lag,HIGH);

  digitalWrite(taster_tor,HIGH);
  digitalWrite(taster_ver,HIGH);
  digitalWrite(taster_lag,HIGH);

  //load from server or eeprom
  Serial.begin(9600);

  Serial.print("[");    
  Serial.print("\"USB 2 Serial Interface\",");
  Serial.print("\"======================\",");
  Serial.print("\"Version 2\",");
  Serial.print("\"(C) by Ronny Adams 2014\"");
  Serial.println("]");
}


void loop()
{
  //{"tor":1,"ver":1,"lag":0}
  readPins();
  delay(100);
}



void serialEvent() {
  String str = "";
  if(Serial.available() > 0)
  {
      str = Serial.readStringUntil('\n');
      parseCommands(str.substring(0,49));
  }
}



void parseCommands(String jsonstr){
  
  //Serial.println(jsonstr);
  //return;
  using namespace ArduinoJson::Parser;
  
  int len = 50;
  char jsonBuf[len];
  
  jsonstr.toCharArray(jsonBuf,len);
  
  JsonParser<24> parser; //mal 8 = belegte bytes
  JsonObject root = parser.parse(jsonBuf);
  
  if (root.success())
  {
    char* _com = root["com"];
    int _tor = root["tor"];
    int _ver = root["ver"];
    int _lag = root["lag"];
    
   
    if (root.containsKey("com")){
      
      _com = root["com"];
      if(strcmp(_com,"set") == 0){
        //set switch
        if(DEBUG)Serial.println("set switch");   
        
        if (root.containsKey("tor")){
          if (_tor == 1) {
            setPin(led_tor,tor=AN);
          } else {
            setPin(led_tor,tor=AUS);
          }
        }
        
        if (root.containsKey("ver")){
          if(_ver == 1){
            setPin(led_ver,ver=AN);
          } else {
            setPin(led_ver,ver=AUS);
          }
        }
        
        if(root.containsKey("lag")){
          if(_lag == 1){
            setPin(led_lag,lag=AN);
          } else {
            setPin(led_lag,lag=AUS);
          }
        }
        
        printState(); 
        
      } else if(strcmp(_com,"get") == 0) {
        //get switch
        if(DEBUG)Serial.println("get switch");
        //return current state
        printState(); 
      } else {
        //no get OR set TODO print help
        printhelp();
      }
    } else {
      //no com
      printhelp();
    }
  } else {
    // Parsing fail: could be an invalid JSON, or too many tokens
     Serial.println("{\"error\":\"true\", \"message\":\"JSON maleformed\"}");
  }


  
}


void printhelp(){
Serial.println("{\"Usage\": { \"com\":\"set|get\"}, {\"tor\":\"0|1\"},{\"ver\":\"0|1\"},{\"lag\":\"0|1\"}}");         
}

void printState(){
  //return current state
  ArduinoJson::Generator::JsonObject<4> object;
  object["tor"] = !tor;
  object["ver"] = !ver;
  object["lag"] = !lag;
  Serial.println(object); 
}

//lese Taster
void readPins()
{

  if ((millis() - time_pin1) > 200)
  {
    if (!digitalRead(taster_tor))
    {
      //tor umschalten
      setPin(led_tor,tor=!tor);
      time_pin1 = millis();
      printState();
      if(DEBUG)Serial.println("Tor switched");
      while(!digitalRead(taster_tor)){
      }
    }
  }

  if ((millis() - time_pin2) > 200)
  {
    if (!digitalRead(taster_ver))
    {
      //verwaltung umschalten
      setPin(led_ver,ver=!ver);
      time_pin2 = millis();
      printState();
      if(DEBUG)Serial.println("Ver switched");
      while(!digitalRead(taster_ver)){
      }
    }
  }

  if ((millis() - time_pin3) > 200)
  {
    if (!digitalRead(taster_lag))
    {
      //lager umschalten
      setPin(led_lag,lag=!lag);
      time_pin3 = millis();
      printState();
      if(DEBUG)Serial.println("Lag switched");
      while(!digitalRead(taster_lag)){
      }        
    }
  }
}  







//schalte LEDs
void setPin(int ledNo, boolean state) {

  if(DEBUG)Serial.print("SetPIN "+ String(ledNo)+": ");
  if(DEBUG)Serial.println(String(state));

  switch (ledNo) {
  case led_tor:
    digitalWrite(led_tor,state);
    break;
  case led_ver:
    digitalWrite(led_ver,state);
    break;
  case led_lag:
    digitalWrite(led_lag,state);
    break;
  default: 
    // if nothing else matches, do the default
    // default is optional
    break;
  }  
  
}


