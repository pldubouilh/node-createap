var CAP = require ('node-createap')

var createap = new CAP({
  path: '/home/pi/create_ap/create_ap',
  options: '--daemon -n --isolate-clients -m nat --hostapd-debug 1 --no-haveged -g 192.168.11.1 -c 1 --country US', // --hidden
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
