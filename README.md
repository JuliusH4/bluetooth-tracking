# bluetooth-tracking
## About
This projekt is about tracking devices based on its sending bluetooth signals. Raspberry Pi Zero W are use to track all surounding bluetooth signals and send them with the RSSI (Signal strength) to a central hub.

> Received Signal Strength Indication for the last received broadcast from the device. This is an integer value measured in dB, where 0 dB is the maximum (theoretical) signal strength, and more negative numbers indicate a weaker signal. (http://ianharvey.github.io/bluepy-doc/scanentry.html#rssi)

## Folder structure
This code is separated into reciver modules (RM) and the hub (HB). The RM are scanning the surounding bluetooth signals and privide a http server. The HB is then requesting the data from the RM with https and combine the data to track the devices. To provide a GUI, the HB is also hosting a webapplication made with [react](https://reactjs.org/).

### Dependencies
* bluepy (https://github.com/IanHarvey/bluepy)
* Flask
> Dependencies are downloaded and installt automatically, if you are using Docker.

# Run Reciving Module on Raspberry Pi (Docker)
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
Project Specific:
* clone repository
* run `curl -fsSL https://get.docker.com -o get-docker.sh`
* run `sudo sh get-docker.sh`
* run `sudo usermod -aG docker pi`
* run `sudo pip3 install docker-compose`
* config docker with `sudo systemctl enable docker`
[Further reading](https://bangertech.de/docker-docker-compose-auf-dem-raspberrypi/)

Run
* run `docker-compose up`


# Run RM native
run `sudo apt-get install libglib2.0-dev`
run `pip3 install --no-cache-dir -r requirements.txt`
run `python3 scan.py`

# MQTT Broaker 
run `sudo apt-get install mosquitto`
> If you get an error during your install saying “Unable to locate package”, please run this command and then run the above commands again:
`sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa`
