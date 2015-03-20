'use strict';

var io = require('socket.io-client');

var message = "o bispo de constantinopla nao quer se desconstantinopolizar";

var w_send_msg_time;

var addUser = function(isWatcher, shouldBroadcast, hostUrl) {

  if(isWatcher)
    hostUrl = 'http://' + hostUrl + '?isWatcher=true';
  else
    hostUrl = 'http://' + hostUrl;

  var socket = io.connect(hostUrl, {
      'force new connection': true, 
  });

  socket.on('connect', function() {
    // Start messaging loop
    if (shouldBroadcast) {
      // message will be broadcasted by server
      socket.emit('broadcast', message);
    } else {
      // message will be echoed by server
      if(isWatcher)
      {
        w_send_msg_time = new Date();
        console.log('\x1b[31m','Watcher: Start');
        console.log('\x1b[0m','');
      }
      socket.send(message);
    }

    socket.on('message', function(message) {
        if(isWatcher)
        {
          var w_response_time = new Date(); 
          console.log('Watcher: Response Time: '+ (w_response_time - w_send_msg_time) + ' miliseconds');
          setTimeout(function(){
            socket.send(message);
            w_send_msg_time = new Date();
          }, 1000);
        }
        else
        {
          socket.send(message);
        }
    });

    socket.on('broadcastOk', function() {
        socket.emit('broadcast', message);
    });
  });
};

(function (){
    var users           = 0;
    var rampUpTime      = 3; // in seconds
    var newUserInterv   = 0;
    var shouldBroadcast = false;
    var hostUrl         = 'localhost:3000';

    for(var i=2; i<process.argv.length; i++)
    {
      //console.log('process.argv['+i+']: '+process.argv[i]);
      if(process.argv[i] === '-u')
      {
          users = parseInt(process.argv[++i]);
      }
      else if(process.argv[i] === '-r')
      {
          rampUpTime = parseInt(process.argv[++i]);
      }
      else if(process.argv[i] === '-b')
      {
          shouldBroadcast = true;
      }
      else if(process.argv[i] === '-host')
      {
          hostUrl = process.argv[++i];
      }
    }

    if(users > 0)
      newUserInterv = parseInt((rampUpTime*1000) / users);

    console.log('\x1b[36m','');
    console.log('======= Start Testing ========');
    console.log('users: \t\t\t'+users);
    console.log('rampUpTime: \t\t'+rampUpTime + ' seconds');
    console.log('newUserInterv:\t\t'+newUserInterv + ' miliseconds');
    console.log('shouldBroadcast:\t'+shouldBroadcast);
    console.log('hostUrl: \t\t'+hostUrl);
    console.log('\x1b[0m','');

    //start watcher
    addUser(true, false, hostUrl);

    for(var i=0; i<users; i++) {
        setTimeout(function() {addUser(false, shouldBroadcast, hostUrl); }, i*newUserInterv);
    };
}());
