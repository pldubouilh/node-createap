# node-createap
Node wrapper for create_ap

```javascript
var CAP = require ('./create_ap.js')

var createap = new CAP({
  path: '/home/pi/create_ap/create_ap',
  options: '--daemon -n --isolate-clients -m nat --hostapd-debug 1 --no-haveged -g 192.168.11.1 -c 1 --country US', // --hidden
  silent: true,
  wirelessInterface: 'wlan0',
  wiredInterface: 'eth0',
  wifiApName: 'MyNetwork',
  wifiWPA: 'aaaaaaaa'
})

createap.start()

process.on('SIGINT', function () {
  self.stop()
  process.exit();
});
```
