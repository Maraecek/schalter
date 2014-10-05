#include <SPI.h>
#include <Ethernet.h>
#include <utility/w5100.h>

//SCHALTER INIT
#define led_tor 5
#define led_ver 6
#define led_lag 7


//4 ist tot

#define taster_tor 1
#define taster_ver 2
#define taster_lag 3

#define AN LOW
#define AUS HIGH

boolean tor = AUS;
boolean ver = AUS;
boolean lag = AUS;

short int cmd[2]; 


//LAN INIT
byte mymac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte myip[] = { 192,168,82,2 };
char myipstr[13] = "192.168.82.2";

IPAddress serverip(192,168,82,1);

EthernetClient client;
EthernetServer server = EthernetServer(80);

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
        
    Ethernet.begin(mymac, myip);
    W5100.setRetransmissionTime(0x064);
    W5100.setRetransmissionCount(3);

    server.begin();
    //load from server or eeprom
    //Serialbegin(9600);
    //Serialprintln("Setup");
}


unsigned long time_announce;
unsigned long time_readlan;
boolean changed = false;

void loop()
{
   
    if (((millis() - time_announce) > 10000) || changed)
    {
      //Serialprintln("announce server");
      time_announce = millis();
      announce();
      if (changed) changed = false;
    }

    if ((millis() - time_readlan) > 1000)
    {
      //Serialprintln("readLAN");
      time_readlan = millis();
      readLan();    
    }
    
    //readLan();  //poll ethernet
    readPins();
    //delay(1000);
}

unsigned long time_pin1;
unsigned long time_pin2;
unsigned long time_pin3;


void readPins()
{

    if ((millis() - time_pin1) > 500)
    {
      //Serialprintln("ReadPIN1");
      if (!digitalRead(taster_tor))
      {
        //tor umschalten
        setPin(led_tor,tor=!tor);
        time_pin1 = millis();
      }
    }
    
    if ((millis() - time_pin2) > 500)
    {
      //Serialprintln("ReadPIN2");
      if (!digitalRead(taster_ver))
      {
        //verwaltung umschalten
        setPin(led_ver,ver=!ver);
        time_pin2 = millis();
      }
    }
    
    if ((millis() - time_pin3) > 500)
    {
      //Serialprintln("ReadPIN3");
      if (!digitalRead(taster_lag))
      {
        //lager umschalten
        setPin(led_lag,lag=!lag);
        time_pin3 = millis();
      }
    }
}    


void readLan()
{
  
  EthernetClient client;
  int index = 0;
  char request[11] = {0};
  
  while ((client = server.available()) == true) {
    // read bytes from the incoming client and write them back
    // to any clients connected to the server:
        
    char t = client.read();
    if ((t == '/') || (t == ' '))
    {
        //Serialprint("request: ");
        //Serialprintln(String(t));
      
        if (strcmp(request, "GET") == 0){
          cmd[0] = HIGH;
          cmd[1] = 0;
        }
        
        if (cmd[0] == HIGH)
        {
          if (strcmp(request, "tor") == 0){
            cmd[1] = 1;
            cmd[0] = LOW;
          } else if (strcmp(request, "verwaltung") == 0) {
            cmd[1] = 2;
            cmd[0] = LOW;
          }
          else if (strcmp(request, "lager") == 0){
            cmd[1] = 3;
            cmd[0] = LOW;
          }
        }
   

        if (cmd[1] == 1) {
          if (strcmp(request, "an") == 0) {
            setPin(led_tor, tor = AN);
            cmd[1] = 0;
            cclose(client, "{\"tor\":\"an\"}");
          }
          else if (strcmp(request, "aus") == 0) {
            setPin(led_tor, tor = AUS);
            cmd[1] = 0;
            cclose(client, "{\"tor\":\"aus\"}");
          }
        }

        if (cmd[1] == 2) {
          if (strcmp(request, "an") == 0)
          {
            setPin(led_ver, ver = AN);
            cmd[1] = 0;
            cclose(client, "{\"verwaltung\":\"an\"}");
          }
          else if (strcmp(request, "aus") == 0)
          {
            setPin(led_ver, ver = AUS);
            cmd[1] = 0;
            cclose(client, "{\"verwaltung\":\"aus\"}");
          }
        }
        
        if (cmd[1] == 3) {
          if (strcmp(request, "an") == 0) {
            setPin(led_lag, lag = AN);
            cmd[1] = 0;
            cclose(client, "{\"lager\":\"an\"}");
          }
          else if (strcmp(request, "aus") == 0) {
            setPin(led_lag, lag = AUS);
            cmd[1] = 0;
            cclose(client, "{\"lager\":\"aus\"}");
          }
          
        }    
        memset(&request[0], 0, sizeof(request));
        index = 0;
    } else
    {
        request[index++] = t;
        //Serialprintln("request2: " + String(request));
    }
  }
  
}


void cclose(EthernetClient cc, char* retval) {
  
  //Serialprintln("ClienClose");
  //Serialprintln(retval);
  
  cc.print("HTTP/1.1 201 OK\n");
  cc.print("Content-Type: text/json\n");
  cc.println();
  cc.println(retval);
  cc.stop();  
}



void setPin(int ledNo, boolean state) {
      
    //Serialprint("SetPIN "+ String(ledNo)+": ");
    //Serialprintln(String(state));
    
    switch (ledNo) {
    case led_tor:
      digitalWrite(led_tor,state);
      changed = true;
      break;
    case led_ver:
      digitalWrite(led_ver,state);
      changed = true;
      break;
    case led_lag:
      digitalWrite(led_lag,state);
      changed = true;
      break;
    default: 
      // if nothing else matches, do the default
      // default is optional
      break;
    } 
}



void announce()
{
 
    //anounce on lan
    
    if (client.connect(serverip, 8181)) {

      client.print("POST /ps/status HTTP/1.0\n");
      client.print("Content-Type: application/x-www-form-urlencoded\n");
      client.print("Host: 192.168.82.2\n");
      client.print("User-Agent: arduino/uno3\n");
      client.print("Accept: */*\n"); /**/
      //client.println("Content-Type: application/x-www-form-urlencoded");
      
      

      client.print("Content-Length: 40\n\n");
      client.print("{\"tor\":\"" + String(tor) + "\",\"verwaltung\":\"" + String(ver) + "\",\"lager\":\"" + String(lag) + "\"}");
      client.print("\n");
      
      client.stop();
    } 
    

}




