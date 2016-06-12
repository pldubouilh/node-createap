var CAP = require ('node-createap')

var createap = new CAP({
  path: '/home/pi/create_ap/create_ap',
  options: '--daemon -n --isolate-clients -m nat --hostapd-debug 2 --no-haveged -g 192.168.11.1 -c 1 --country US', // --hidden
  silent: true,
  wirelessInterface: 'wlan0',
  wiredInterface: 'eth0',
  wifiApName: 'MyNetwork',
  wifiWPA: 'aaaaaaaa'
})

createap.on('ready', function(){
  console.log('create_ap successfully started !')
})

createap.start()

process.on('SIGINT', function () {
  createap.stop()
  process.exit();
});
