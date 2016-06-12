require('shelljs/global');

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(createap, EventEmitter)

function createap (params){

  var self = this

  self.prepValues = function () {
    var vals = [];
    for( var key in params )
      if ( key !== 'silent' )
        vals.push(params[key]);
    return vals.join(' ');
  }

  self.die = function(msg, data){
    console.warn(msg)
    if (data !== undefined)
      console.warn(data)
    process.exit(1);
  }

  self.listRunning = function() {
    var out = exec( params.path + ' --list-running', {silent:true})
    if(out.stderr)
      console.warn('WARNING: Can\'t run list-running' + out.stdout + '\n' + out.stderr)
    else if (out.stdout)
      console.log(out.stdout)
  }

  self.listClients = function() {
    var out = exec( params.path + ' --list-clients ' + params.wirelessInterface, {silent:true})
    if(out.stderr)
      console.warn('WARNING: Can\'t run list-clients' + out.stdout + '\n' + out.stderr)
    else if (out.stdout)
      console.log(out.stdout)
  }

  self.start = function() {
    console.log('Starting AP');

    if(self.proc !== undefined){
      console.log('create_ap already running');
      return
    }

    self.proc = exec( self.prepValues(), { silent:params.silent }, function (error, stdout, stderr) {
      if(error)
        self.die('ERROR: can\'t start create_ap', stderr)
      return
    });

    self.out = ''
    self.proc.stdout.on('data', function (data){

      self.out = self.out + data.toString()
      if(data.toString().indexOf('Setup of interface done.') !== -1){
        self.emit('ready')
        self.ready = true
      }
    })

    setTimeout(function () {
      if(self.ready)
        return
      else{
        if(params.silent)
          self.die('ERROR: Timeout.', self.out)
        else
          self.die('ERROR: Timeout.')
      }
    }, 8000);
  }

  self.stop = function(){
    console.log('Gracefully stopping create_ap...')
    exec( params.path + ' --stop ' + params.wirelessInterface )
  }

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
  if(params.silent === undefined)
    params.silent = true

  // Checking existence of create_Ap
  var out = exec('file ' + params.path + ' | grep shell', {silent:true})
  if(out.stderr)
    self.die('ERROR: create_ap not found at path provided', out.stderr)
  else
    params.path = 'sudo ' + params.path
}

module.exports = createap
