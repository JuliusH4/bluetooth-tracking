# bluetooth-tracking
Goal is to visualize all bluetooth devices in a room by scanning their signals with multiple reciving modules.
## About
This projekt is about tracking devices based on its sending bluetooth signals. Raspberry Pi Zero W are use to track all surounding bluetooth signals and send them with the RSSI (Signal strength) to a central hub by mqtt. In this Hub, based on the multiple signal strength, a position is calculated and provided via http.

> Received Signal Strength Indication for the last received broadcast from the device. This is an integer value measured in dB, where 0 dB is the maximum (theoretical) signal strength, and more negative numbers indicate a weaker signal. (http://ianharvey.github.io/bluepy-doc/scanentry.html#rssi)

All code is developed to be run localy. CAused by this fact, no security and validation features are implemented.

## Folder structure
This code is separated into reciver modules (RM), the hub (HB) and a react client. The RM are scanning the surounding bluetooth signals and provides the signal data via MQTT. The HB hosting the MQTT Broker is subscribing to the RM data topic and combines the data to track the devices. To provide a GUI, the HB is also hosting a http server, where the client webapplication made with [react](https://reactjs.org/) can request the position data.

All distances should be in centimeters (to be checked...). Origin of the API Endpoint provided by the Hub is the bottom left corner.

### Dependencies
* bluepy (https://github.com/IanHarvey/bluepy)
* Flask
* Mosquitto
* Express + core
* paho

#### React
* styled components
* axios
> See also  https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258


# Run Reciving Module (on Raspberry Pi)
Basic config
* Install RaspberryPi OS
* Config wpa_supplicant.conf
```
country=DE # Your 2-digit country code
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
    ssid="YOUR_NETWORK_NAME"
    psk="YOUR_PASSWORD"
    key_mgmt=WPA-PSK
}
```
* activate ssh by create an empty file named `ssh`.
* change login data / install firewall
* Run `sudo apt-get update` and `sudo apt-get upgrade`.  
* clone repository

# Run RM native
run `sudo apt-get install libglib2.0-dev`(required for bluepy lib  
run `sudo pip3 install --no-cache-dir -r requirements.txt`
run `sudo python3 scan.py`
> sudo is required for execution!

# Run Hub
## MQTT Broker 
run `sudo apt-get install mosquitto`
> If you get an error during your install saying “Unable to locate package”, please run the following command and then run the above commands again:  
`sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa`

## Run Express Server
run `npm install`
create a file called `modules.json` in the `/hub` directory containing an empyt json syntax `{}`.
run `npm start`

# Run client
run `npm install`  
a)  run `npm start` for development versoins  
b) run `npm build` for build version  