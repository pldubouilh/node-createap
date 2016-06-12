# node-createap
Node wrapper for create_ap

Note : `sudo create_ap` needs to run passwordless !

Note for Raspbian-RPI3 users:
  * `--no-virt` option required
  * running fine with hostapd v2.5
  * dnsmasq & hostapd daemons disabled (`sudo systemctl disable hostapd // dnsmasq`)
  * disabled all wireless settings in `nano /etc/network/interfaces`, so it's only `allow-hotplug wlan1` and `allow-hotplug wlan0`

## Usage :

`npm install --save node-createap`

then...

```javascript
var CAP = require ('node-createap')

var createap = new CAP({
  path: '/home/pi/create_ap/create_ap',
  options: '--daemon -n --no-virt -m nat --hostapd-debug 1 --no-haveged -g 192.168.11.1 -c 1 --country US', // --hidden
  silent: false,
  wirelessInterface: 'wlan0',
  wiredInterface: 'eth0',
  wifiApName: 'MyNetwork',
  wifiWPA: 'aaaaaaaa'
})

createap.start()

setTimeout(function () {
  createap.listRunning()
  createap.listClients()
}, 5*1000);

process.on('SIGINT', function () {
  createap.stop()
  process.exit();
});
```
