$(document).ready(function () {
    var socket = io.connect();

    socket.on('server_response', function (msg) {
        update_TempChart(msg);
        update_TempBar(msg);
        update_hunChart(msg);
        update_hunbar(msg);
    });
});


var TempChart = echarts.init(document.getElementById('TempChart'));
TempChart.setOption({
    title: {
        text: 'Temperature'
    },
    tooltip: {},
    legend: {
        data: ['温度']
    },
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [{
        type: 'line',
        itemStyle: {
            normal: {
                color: 'orangered',
                lineStyle: {
                    color: 'orangered'
                }
            }
        },
        data: []
    }]
});
var temperature_time = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var temperature_value = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
TempChart.showLoading();
var update_TempChart = function (msg) {
    var time = msg.data[0]
    var temperature = msg.data[2]
    TempChart.hideLoading();
    temperature_time.push(time);
    temperature_value.push(temperature);
    if (temperature_time.length >= 6) {
        temperature_time.shift();
        temperature_value.shift();
    }
    TempChart.setOption({
        xAxis: {
            data: temperature_time
        },
        series: [{
            name: '温度',
            data: temperature_value
        }]
    });

};


var TempBar = echarts.init(document.getElementById('TempBar'));
TempBar.setOption({
    title: {
        text: 'Temperature'
    },
    tooltip: {},
    legend: {
        data: ['销量']
    },
    xAxis: {
        data: ["温度"]
    },
    yAxis: {},
    series: []
});
TempBar.showLoading();
var update_TempBar = function (msg) {
    var temperature = msg.data[2]
    TempBar.hideLoading();
    TempBar.setOption({
        xAxis: {
            title: ["温度:"]
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#cccccc'
                    }
                },
                silent: true,
                barWidth: 50,
                barGap: '-100%',
                data: [40],
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: 'orangered'
                    }
                },
                barWidth: 50,
                z: 10,
                data: [temperature],
            }
        ]
    });

};


var HunChart = echarts.init(document.getElementById('HunChart'));
HunChart.setOption({
    title: {
        text: 'Hunidity'
    },
    tooltip: {},
    legend: {
        data: ['湿度']
    },
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [{
        name: '湿度',
        type: 'line',
        itemStyle: {
            normal: {
                color: 'skyblue',
                lineStyle: {
                    color: 'skyblue'
                }
            }
        },
        data: []
    }]
});
var hunidity_time = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var hunidity_value = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
HunChart.showLoading();
var update_hunChart = function (msg) {
    var time = msg.data[0]
    var hunidity = msg.data[1]
    HunChart.hideLoading();
    hunidity_time.push(time);
    hunidity_value.push(hunidity);
    if (hunidity_time.length >= 6) {
        hunidity_time.shift();
        hunidity_value.shift();
    }
    HunChart.setOption({
        xAxis: {
            data: hunidity_time
        },
        series: [{
            data: hunidity_value
        }
        ]
    });
};


var HunBar = echarts.init(document.getElementById('HunBar'));
HunBar.setOption({
    title: {
        // text: 'Temperature'
    },
    tooltip: {},
    legend: {
        data: ['湿度']
    },
    xAxis: {
        data: ["湿度"]
    },
    yAxis: {},
    series: []
});
HunBar.showLoading();
var update_hunbar = function (msg) {
    var hunidity = msg.data[1]
    HunBar.hideLoading();
    HunBar.setOption({
        xAxis: {
            title: ["湿度:"]
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#cccccc'
                    }
                },
                silent: true,
                barWidth: 50,
                barGap: '-100%',
                data: [100],
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: 'skyblue'
                    }
                },
                barWidth: 50,
                z: 10,
                data: [hunidity],
            }
        ]
    });
};


window.onresize = function () {
    TempChart.resize();
    HunChart.resize();
    TempBar.resize();
    HunBar.resize();
};