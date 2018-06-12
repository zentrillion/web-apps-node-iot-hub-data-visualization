$(document).ready(function () {
  Chart.defaults.global.defaultColor = 'rgba(255,255,255,1)';

  var timeData = [],
    temperatureData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255,255,255,1)",
        pointBoarderColor: "rgba(255,255,255,1)",
        backgroundColor: "rgba(255,255,255,1)",
        pointHoverBackgroundColor: "rgba(255,255,255,1)",
        pointHoverBorderColor: "rgba(255,255,255,1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(255,255,255,1)",
        pointBoarderColor: "rgba(255,255,255,1)",
        backgroundColor: "rgba(255,255,255,1)",
        pointHoverBackgroundColor: "rgba(255,255,255,1)",
        pointHoverBorderColor: "rgba(255,255,255,1)",
        data: humidityData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature & Humidity Real-time Data',
      fontSize: 36,
      fontColor: "rgb(255, 255, 255)"
    },
    legend: {
      display: true,
      labels: {
          fontColor: "rgb(255, 255, 255)"
      }
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true,
          fontColor: 'white'
        },
        gridLines: {
          display: true,
          color: "rgba(255,255,255,1)",
          zeroLineColor: "rgba(255,255,255,1)"
        },
        position: 'left',
        ticks: {
          suggestedMin: 0,
          suggestedMax: 50,
          fontColor: 'white'
        }
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true,
            fontColor: 'white'
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});

/*
a {
  color: #00B7FF;
}
*/