Module.register("MMM-CO2Sensor",{

    defaults: {
        updateInterval: 5 // seconds 
        // tty,interval later
    },


    getScripts: function() {
	return ["modules/" + this.name + "/node_modules/chart.js/dist/Chart.bundle.min.js"];
    },

    start: function() {
        this.loaded = false;
        this.co2 = '';
	this.sendSocketNotification('REQUEST', this.config);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.setAttribute("style", "position: relative; display: inline-block;");
       
	var header = document.createElement("header");
        header.classList.add("xsmall", "bright", "header");
        header.innerHTML = "CO2 Values in ppm (past 24h)";
        wrapper.appendChild(header);

	if (!this.loaded) {
		wrapper.innerHTML = "Loading ...";
		return wrapper;
	}

        var chart  = document.createElement("canvas");
        chart.width  = 350;
        chart.height = 200;
	oneday = this.co2.slice(-40)
	var data = {
		labels: [],
		datasets: [{
			borderColor: '#ffffff',
			data: oneday
			}]
	}
	var options = {
		responsive: false,
  		legend: {
  			display: false
  		},
		animation: {
        		duration: 0
    		},
        	scales: {
        		yAxes: [{
        			ticks: {
            				suggestedMin: 0,
            				suggestedMax: 3000
        				}
        			}]
			}
		}

        this.chart = new Chart(chart.getContext("2d"), {
    				type: 'line',
    				data: data,
    				options: options
	     		     });

        wrapper.appendChild(chart);
	return wrapper;
    },
    
    socketNotificationReceived: function(notification, payload) {
    	if (notification === 'DATA') {
    	    this.co2 = payload.data;
    	    this.loaded = true;
    	    this.updateDom(0);
    	}
    }
});
