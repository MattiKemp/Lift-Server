var totalData;
var monthlyData = {'minutes':{},'hours':{}};
var weeklyData = {'minutes':{},'hours':{}};
var dailyData = {'minutes':{},'hours':{}};
var chartMins = true;
var chartType = 1;
//get data communication codes:
//0: total minutes for each user
//1: monthly information for specified user in options
//2: weekly information for specified user in options
//3: daily information for specified user in options
async function getData(code, options={}){
var mySocket = new WebSocket("ws://192.168.1.102:8765");
console.log('WebSocket created');

mySocket.onopen = function(e){
	console.log("Connection established");
	if(code==0){
		mySocket.send("recent");
	}
	else if(code==1){
		mySocket.send("daily:" + options['name']);
	}
	else if(code==2){
		mySocket.send("weekly:" + options['name']);
	}
	else if(code==3){
		mySocket.send("monthly:" + options['name']);
	}
};


mySocket.onmessage = function(event){
	console.log(event.data);
	if(code==0){
		totalData = event.data;
		updateAllWeekly(totalData);
	}
	else if(code==1){	
		var data = [];
		var parsed = JSON.parse(event.data)
		for(const day in parsed){
			var temp = {x:parseInt(day),y:parsed[day]}
			data.push(temp);
		}
		//this is such a bad way of doing this.
		dailyData['minutes'][options['name']] = data;
		modifyChart(options['chart'],options['name'],0);
	}
	else if(code==2){
		var data = [];
		var parsed = JSON.parse(event.data)
		for(const day in parsed){
			var temp = {x:parseInt(day),y:parsed[day]}
			data.push(temp);
		}
		//this is such a bad way of doing this.
		weeklyData['minutes'][options['name']] = data;
		modifyChart(options['chart'],options['name'],1);
	}
	else if(code==3){	
		var data = [];
		var parsed = JSON.parse(event.data)
		for(const day in parsed){
			var temp = {x:parseInt(day),y:parsed[day]}
			data.push(temp);
		}
		//this is such a bad way of doing this.
		monthlyData['minutes'][options['name']] = data;
		modifyChart(options['chart'],options['name'],2);
	}
	else if(code==4){
	
	}
	mySocket.close("1000");
};

mySocket.onclose = function(event){
	if(event.wasClean){
		console.log("Connection closed cleanly");
	}
	else{
		console.log("Connection died");
	}
};

mySocket.onerror = function(error){
	console.log("error occured");
};


};
function getWeekly(data,keyName){
	//console.log("getWeekly called");{
        var para = document.createElement("div");
        para.className = "UserInfo";
        var name = document.createElement("div");
        name.innerText = String(keyName); 
	name.style.width = "50%";
	name.style.display = "inline-block";
	name.style['text-align'] = "right";
	para.appendChild(name);
        var infoDiv = document.createElement("div");
        var info = document.createElement("span");
        var time  = data[keyName]['minutes']/60;
        info.innerText = String(time).slice(0,5) + " hours";
        infoDiv.appendChild(info);
	infoDiv.id = "hours";
        infoDiv.style.width = parseInt(50*((time)/17)) + "%";
	para.appendChild(infoDiv);
	para.onclick = function(){userClick(keyName);};
	return para;
};

getData(0);
function updateAllWeekly(data){
        data = JSON.parse(data);
        for (var key in data){
                var para = document.createElement("p");
                if(key != "obama"){
                        document.getElementById("user_data").appendChild(getWeekly(data,key));
                }
	};
};

function clear(){
	const user_data = document.getElementById("user_data");
	while(user_data.firstChild){
		user_data.removeChild(user_data.lastChild);
	}
};


function createChart(canvas){
	var myChart = new Chart(canvas, {
		type: 'line',
		data: {
			labels: [0,1,2,3,4,5,6,7],
			datasets: [{
				label: '# of minutes',
				data: [],
				backgroundColor: [
					'rgba(255,0,0,.2)'
				],
				borderColor: [
					'rgba(255,255,255,1)'
				],
				borderWidth: 1,
				
			}],
		},
		options: {
			title:{
				display: true,
				text: 'Workout time for the week'
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
	
	});
	return myChart;
};

//function to modify the chart data to display month, week, and daily data as well as
//switch between minutes and hours.
//bad way to do this
//data parameter is an int from 0-4:
//0:day, 1:week, 2:month
function modifyChart(chart, name, condition){
	if(condition==0){
		chart.data.datasets.forEach((dataset) =>{
			if(!chartMins){
				if(dailyData['hours'][name]==null){
					var hourData = [];
					const dailyPointer = dailyData['minutes'][name];
					for(const point in dailyPointer){
						hourData.push(Object.create(dailyPointer[point]));
					}
					for(const e in hourData){
						hourData[e]['y'] = hourData[e]['y']/60.0;
					}
					dailyData['hours'][name] = hourData;
				}
				dataset.data = dailyData['hours'][name];
			}
			else{
				dataset.data = dailyData['minutes'][name];
			}
		});
	}
	else if(condition==1){
		chart.data.datasets.forEach((dataset) =>{
			if(!chartMins){
				if(weeklyData['hours'][name]==null){
					var hourData = [];
					const weekPointer = weeklyData['minutes'][name];
					for(const point in weekPointer){
						hourData.push(Object.create(weekPointer[point]));
					}
					for(const e in hourData){	
						hourData[e]['y'] = hourData[e]['y']/60.0;
					}
					weeklyData['hours'][name] = hourData;
				}
				dataset.data = weeklyData['hours'][name];
			}
			else{
				dataset.data = weeklyData['minutes'][name];
			}
		});
	}
	else if(condition==2){
		chart.data.datasets.forEach((dataset) =>{
			if(!chartMins){
				if(monthlyData['hours'][name]==null){
					var hourData = [];
					const monthlyPointer = monthlyData['minutes'][name];
					for(const point in monthlyPointer){
						hourData.push(Object.create(monthlyPointer[point]));
					}
					for(const e in hourData){
						hourData[e]['y'] = hourData[e]['y']/60.0;
					}
					monthlyData['hours'][name] = hourData;
				}
				dataset.data = monthlyData['hours'][name];
			}
			else{
				dataset.data = monthlyData['minutes'][name];
			}
		});
	}
	chart.update();
};

//Called whenever a user clicks on a name on the homescreen of the website.
//Updates the screen to show more information on the specific name the user clicked.
function userClick(name){
	console.log(name);
	clear();
	var user_data = document.getElementById("user_data");
	backElem = document.createElement("div");
	backElem.id = "back";
	backElem.innerText = "<-";
	backElem.onclick = function(){clear(); updateAllWeekly(totalData);};
	user_data.appendChild(backElem);
	nameElem = document.createElement("div");
	nameElem.innerText = name;
	user_data.appendChild(nameElem);
	var canvasChart = document.createElement("canvas");
	var chart = createChart(canvasChart);
	user_data.appendChild(canvasChart);
	//Month button
	var monthButt = document.createElement("button");
	monthButt.innerText = "Month";
	user_data.appendChild(monthButt);
	//Week button
	var weekButt = document.createElement("button");
	weekButt.innerText = "Week";
	user_data.appendChild(weekButt);
	//Day button
	var dayButt = document.createElement("button");
	dayButt.innerText = "Day";
	user_data.appendChild(dayButt);
	user_data.appendChild(document.createElement("br"));
	user_data.appendChild(document.createElement("br"));
	//switch between Minutes Hours button 
	var minutesHoursButt = document.createElement("button");
	minutesHoursButt.innerText = "Hours";
	user_data.appendChild(minutesHoursButt);
	dayButt.onclick = function(){
		if(dailyData['minutes'][name]==null){
			getData(1,{'name':name,'chart':chart});
		}
		else if(chartType!=0){
			modifyChart(chart,name,0);
		}
		chartType = 0;
	};
	weekButt.onclick = function(){
		//this is a horrible way to do this but I couldn't get
		//typical javascript async working properly with my websocket implementation :/
		//to save resources we will only allow the user to 
		//get new data once per instance, so to get more up to date data
		//they will have to refresh the page.
		if(weeklyData['minutes'][name]==null){
			getData(2,{'name':name,'chart':chart});
		}
		else if(chartType!=1){
			modifyChart(chart,name,1);
		}
		chartType = 1;
	};
	monthButt.onclick = function(){
		if(monthlyData['minutes'][name]==null){
			getData(3,{'name':name,'chart':chart});
		}
		else if(chartType!=2){
			modifyChart(chart,name,2)
		}
		chartType = 2;
	};
	chartMins = true;
	minutesHoursButt.onclick = function(){
		chartMins = !chartMins;
		if(chartMins){
			minutesHoursButt.innerText = 'Hours';
			modifyChart(chart,name,chartType);
		}
		else{
			minutesHoursButt.innerText = 'Minutes';
			modifyChart(chart,name,chartType);
		}
	};
	chartType = 0;
	weekButt.click();
};
