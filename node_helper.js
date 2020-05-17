const NodeHelper = require('node_helper');

const {PythonShell} = require("python-shell");
var pythonStarted = false
let co2 = []

module.exports = NodeHelper.create({
  
  python_start: function () {
    const self = this;
    const pyshell = new PythonShell('modules/MMM-CO2Sensor/sensor.py',{pythonPath: 'python3'})

    pyshell.on('message', function (message) {
        //console.log(co2);
        self.sendSocketNotification('DATA', {data: co2});
	co2.push(message);
    });

    pyshell.end(function (err,code,signal) {
      if (err) throw err;
      console.log("[" + self.name + "] " + 'finished running...');
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
    });
  },
  
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    var self = this;
    if(notification === 'REQUEST') {
      this.config = payload

      if(!pythonStarted) {
        pythonStarted = true;
        this.python_start();
        };

    };
  }

});
