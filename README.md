# bluetooth-tracking
## About
This projekt is about tracking devices based on its sending bluetooth signals. Raspberry Pi Zero W are use to track all surounding bluetooth signals and send them with the RSI (Signal strength) to a central hub.

## Folder structure
This code is separated into reciver modules (RM) and the hub (HB). The RM are scanning the surounding bluetooth signals and privide a http server. The HB is then requesting the data from the RM with https and combine the data to track the devices. To provide a GUI, the HB is also hosting a webapplication made with [react](https://reactjs.org/).
