require('shelljs/global');

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(createap, EventEmitter)

function createap (params){

  var self = this

  self.prepValues = function () {
    if(params.wifiWPA === undefined || params.wifiApName.length === 0)
      return params.path + ' ' + params.options + ' ' + params.wirelessInterface + ' ' + params.wiredInterface + ' ' + params.wifiApName
    else
      return params.path + ' ' + params.options + ' ' + params.wirelessInterface + ' ' + params.wiredInterface + ' ' + params.wifiApName + ' ' + params.wifiWPA
  }

  self.die = function(msg, data){
    console.warn(msg)
    if (data !== undefined)
      console.warn(data)
    process.exit(1);
  }

  self.listRunning = function(cb) {
    var out = exec( params.path + ' --list-running', {silent:true})
    if(out.stderr)
      console.warn('WARNING: Can\'t run list-running' + out.stdout + '\n' + out.stderr)
    else if (out.stdout)
      return cb(out.stdout)
  }

  self.listClients = function(cb) {
    var out = exec( params.path + ' --list-clients ' + params.wirelessInterface, {silent:true})
    if(out.stderr)
      console.warn('WARNING: Can\'t run list-clients' + out.stdout + '\n' + out.stderr)
    else if (out.stdout)
      return cb(out.stdout)
  }

  self.start = function(cb) {
    console.log('Starting AP');

    if(self.proc !== undefined){
      return cb('create_ap already running')
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
        self.ready = true
        clearTimeout(timerTimeout)
        return cb('done')
      }
    })

    var timerTimeout = setTimeout(function () {
      if(params.silent)
        self.die('ERROR: Timeout.', self.out) // print diying message is program silented
      else
        self.die('ERROR: Timeout.')
    }, 8000);
  }

  self.stop = function(cb){
    exec( params.path + ' --stop ' + params.wirelessInterface )
    return cb('stopped')
  }

  // Sanity check
  if(params.path === undefined || params.path.length === 0)
    self.die('ERROR: No path provided')
  if(params.options === undefined || params.options.length === 0)
    self.die('ERROR: No options provided')
  if(params.wirelessInterface === undefined || params.wirelessInterface.length === 0)
    self.die('ERROR: No wireless interface provided')
  if(params.wiredInterface === undefined || params.wiredInterface.length === 0)
    self.die('ERROR: No wired interface provided')
  if(params.wifiApName === undefined || params.wifiApName.length === 0)
    self.die('ERROR: No wifi AP name provided')
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
