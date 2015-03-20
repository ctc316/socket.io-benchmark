'use strict';
var socketio = require('socket.io');
var exec = require('child_process').exec; 
var output = require('./components/output');
var util = require('./components/utility');

// command to read process consumed memory and cpu time
var getCpuCommand = "ps -p " + process.pid + " -o %cpu,%mem";

//default port
var port = 3000;

// counting paramters
var users = 0;
var countReceived = 0;
var countSended = 0;

// header
var header = [
        'Timestamp',
        '\t U',
        'MR/S',
        'MS/S', 
        'MR/S/U',
        'MS/S/U',
        'CPU',
        'Mem'],
    logHeader = header.join('\t '),
    outputHeader = header.join(', ');

// flags
var isWriteToLog = false,
    isFirstTime = true;


/*****************************************************************
*                           run
******************************************************************/

for(var i=2; i<process.argv.length; i++){
    //console.log('process.argv['+i+']: '+process.argv[i]);
    if(process.argv[i] === '-w')
      isWriteToLog = true;
    else if(process.argv[i] === '-p')
    {
      var param = parseInt(process.argv[++i]);
      port = (param ? param : port);
    }
}

console.log('\x1b[31m','\nServer started on port ' + port);
console.log('\x1b[0m','');

var io = socketio.listen(port)
        

setInterval(function() {
      var auxReceived = util.roundNumber(countReceived / users, 1)
      var msuReceived = (users > 0 ? auxReceived : 0);

      var auxSended = util.roundNumber(countSended / users, 1)
      var msuSended = (users > 0 ? auxSended : 0);

      // call a system command (ps) to get current process resources utilization
      var child = exec(getCpuCommand, function(error, stdout, stderr) {
  
        var s = stdout.split(/\s+/);
        var cpu = s[3];     
        var memory = s[4];  
     
        var log = [
          util.getTimeStamp(),
          users,
          countReceived,
          countSended,
          msuReceived,
          msuSended,
          cpu + '%',
          memory + '%'
        ];

        var logData = log.join('\t ');
        console.log(logHeader);
        console.log(logData);

        countReceived = 0;
        countSended = 0;
          
        if(isWriteToLog)
        {
          var outputData = log.join(', ');
          if(isFirstTime)
          { 
            var fileName    = 'result_' + util.getTimeStampForHeader(),
                fileDirPath = './output/',
                 fileType    = '.csv';
            output.configPath(fileName, fileDirPath, fileType);
            if(output.createOutputFile(outputHeader + '\n'))
            {
              isFirstTime = false;
            }
            else
            {
              console.error('Fail to create file...' + fileName);
              return;
            }
          }
          output.appendToOutputFile(outputData + '\n');
        }

      });
}, 1000);



/*****************************************************************
*                         socket io
******************************************************************/

io.sockets.on('connection', function(socket) {

  if(!socket.handshake.query.isWatcher)
    users++;

  socket.on('message', function(message) {
    socket.send(message);
    if(!socket.handshake.query.isWatcher)
    {
      countReceived++;
      countSended++;
    }
  });

  socket.on('broadcast', function(message) {
    countReceived++;

    io.sockets.emit('broadcast', message);
    countSended += users;

    socket.emit('broadcastOk');
  });

  socket.on('disconnect', function() {
    if(!socket.handshake.query.isWatcher)
      users--;
  })
});



