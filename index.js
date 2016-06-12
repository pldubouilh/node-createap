var CAP = require ('node-createap')

var createap = new CAP({
  path: '/home/pi/create_ap/create_ap',
  options: '--daemon -n --isolate-clients -m nat --no-virt --hostapd-debug 2 --no-haveged -g 192.168.11.1 -c 1 --country US', // --hidden
  silent: true,
  wirelessInterface: 'wlan0',
  wiredInterface: 'eth0',
  wifiApName: 'MyNetwork',
  wifiWPA: 'aaaaaaaa'
})

createap.start(function (msg){
  console.log(msg)
})

process.on('SIGINT', function () {
  createap.stop(function (msg) {
    console.log(msg);
  })
  process.exit();
});
