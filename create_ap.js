require('shelljs/global');

module.exports = function(params){
  var self = this

  Object.values = function (obj) {
    var vals = [];
    for( var key in obj )
      if ( obj.hasOwnProperty(key) )
        vals.push(obj[key]);
    return vals;
  }

  self.die = function(msg, data){
    console.warn(msg)
    if (data !== undefined)
      console.warn(data)
    process.exit(1);
  }

  self.listRunning = function() {
    exec(params.path + ' --list-running', function (error, stdout, stderr){
      if(error)
        console.log(stderr)
      else
        console.log(stdout)
    })
  }

  self.listClients = function() {
    exec(params.path + ' --list-clients ' + self.proc.pid, function (error, stdout, stderr){
      if(error)
        console.log(stderr)
      else
        console.log(stdout)
    })
  }

  self.start = function() {
    console.log('Starting AP');

    if(self.proc !== undefined){
      console.log('create_ap already running');
      return
    }

    // make silent ! {silent:true}
    self.proc = exec( Object.values(params).join(' ') , function (error, stdout, stderr) {
      if(error)
        self.die('ERROR: can\'t start create_ap', stderr)
    });
  }

  self.stop = function(){
    console.log('Gracefully stopping create_ap...')
    exec( params.path + ' --stop ' + params.wirelessInterface )
  }

  process.on('SIGINT', function () {
    self.stop()
    process.exit();
  });

  // Sanity check
  if(params.path === undefined && params.path.length === 0)
    self.die('ERROR: No path provided')
  if(params.options === undefined && params.options.length === 0)
    self.die('ERROR: No options provided')
  if(params.wirelessInterface === undefined && params.wirelessInterface.length === 0)
    self.die('ERROR: No wireless interface provided')
  if(params.wiredInterface === undefined && params.wiredInterface.length === 0)
    self.die('ERROR: No wired interface provided')
  if(params.wifiApName === undefined && params.wifiApName.length === 0)
    self.die('ERROR: No wifi AP name provided')
  if(params.wifiWPA === undefined && params.path.wifiWPA === 0)
    self.die('ERROR: No WPA key provided')

  // Checking existence of create_Ap
  var out = exec('file ' + params.path + ' | grep shell', {silent:true});
  if(out.stderr)
    self.die('ERROR: create_ap not found at path provided', stderr)
  else
    params.path = 'sudo ' + params.path
}
