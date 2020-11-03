<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row>
            <el-col :span="6">
                <el-card class="box-card">
                    <div style="float: left; font-size: 60px;">
                        <i class="el-icon-user"></i>
                    </div>
                    <div style="float: right">
                        <p>New Visitors</p>
                        <p style="text-align: center">31</p>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div style="float: left; font-size: 60px;">
                        <i class="el-icon-chat-dot-square"></i>
                    </div>
                    <div style="float: right">
                        <p>Messages</p>
                        <p style="text-align: center">103</p>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div style="float: left; font-size: 60px;">
                        <i class="el-icon-money"></i>
                    </div>
                    <div style="float: right">
                        <p>Purchases</p>
                        <p style="text-align: center">57</p>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div style="float: left; font-size: 60px;">
                        <i class="el-icon-shopping-cart-full"></i>
                    </div>
                    <div style="float: right">
                        <p>Shopping</p>
                        <p style="text-align: center">49</p>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <div id="chart1" style="width: 100%; height: 500px;"></div>
                </el-card>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="9">
                <el-card class="box-card">
                    <div id="chart2" style="height: 400px; width: 100%"></div>
                </el-card>
            </el-col>
            <el-col :span="15">
                <el-card class="box-card">
                    <div id="chart3" style="height: 400px; width: 100%"></div>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import echarts from 'echarts'

export default {
    name: "Index",
    mounted() {
        this.drawChart1();
        this.drawChart2();
        this.drawChart3();
    },
    methods: {
        drawChart1() {
            let myChart = echarts.init(document.getElementById('chart1'));
            let category = [];
            let dottedBase = +new Date();
            let lineData = [];
            let barData = [];

            for (let i = 0; i < 20; i++) {
                let date = new Date(dottedBase += 3600 * 24 * 1000);
                category.push([
                    date.getFullYear(),
                    date.getMonth() + 1,
                    date.getDate()
                ].join('-'));
                let b = Math.random() * 200;
                let d = Math.random() * 200;
                barData.push(b)
                lineData.push(d + b);
            }

            let option = {
                backgroundColor: '#0f375f',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['line', 'bar'],
                    textStyle: {
                        color: '#ccc'
                    }
                },
                xAxis: {
                    data: category,
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                },
                yAxis: {
                    splitLine: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                },
                series: [{
                    name: 'line',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: true,
                    symbol: 'emptyCircle',
                    symbolSize: 15,
                    data: lineData
                }, {
                    name: 'bar',
                    type: 'bar',
                    barWidth: 10,
                    itemStyle: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#14c8d4'},
                                {offset: 1, color: '#43eec6'}
                            ]
                        )
                    },
                    data: barData
                }, {
                    name: 'line',
                    type: 'bar',
                    barGap: '-100%',
                    barWidth: 10,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: 'rgba(20,200,212,0.5)'},
                                {offset: 0.2, color: 'rgba(20,200,212,0.2)'},
                                {offset: 1, color: 'rgba(20,200,212,0)'}
                            ]
                        )
                    },
                    z: -12,
                    data: lineData
                }, {
                    name: 'dotted',
                    type: 'pictorialBar',
                    symbol: 'rect',
                    itemStyle: {
                        color: '#0f375f'
                    },
                    symbolRepeat: true,
                    symbolSize: [12, 4],
                    symbolMargin: 1,
                    z: -10,
                    data: lineData
                }]
            };
            myChart.setOption(option);
        },
        drawChart2() {
            let myChart = echarts.init(document.getElementById('chart2'));
            let option = {
                title: {
                    text: '浏览器占比变化',
                    // subtext: '纯属虚构',
                    top: 10,
                    left: 10
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0,0,250,0.2)'
                },
                legend: {
                    type: 'scroll',
                    bottom: 10,
                    data: (function () {
                        let list = [];
                        for (let i = 1; i <= 28; i++) {
                            list.push(i + 2000 + '');
                        }
                        return list;
                    })()
                },
                visualMap: {
                    top: 'middle',
                    right: 10,
                    color: ['red', 'yellow'],
                    calculable: true
                },
                radar: {
                    indicator: [
                        {text: 'IE8-', max: 400},
                        {text: 'IE9+', max: 400},
                        {text: 'Safari', max: 400},
                        {text: 'Firefox', max: 400},
                        {text: 'Chrome', max: 400}
                    ]
                },
                series: (function () {
                    let series = [];
                    for (let i = 1; i <= 28; i++) {
                        series.push({
                            name: '浏览器',
                            type: 'radar',
                            symbol: 'none',
                            lineStyle: {
                                width: 1
                            },
                            emphasis: {
                                areaStyle: {
                                    color: 'rgba(0,250,0,0.3)'
                                }
                            },
                            data: [{
                                value: [
                                    (40 - i) * 10,
                                    (38 - i) * 4 + 60,
                                    i * 5 + 10,
                                    i * 9,
                                    i * i / 2
                                ],
                                name: i + 2000 + ''
                            }]
                        });
                    }
                    return series;
                })()
            };
            myChart.setOption(option);
        },
        drawChart3() {
            let myChart = echarts.init(document.getElementById('chart3'));
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '30%'],

                        label: {
                            position: 'inner'
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 335, name: '直达', selected: true},
                            {value: 679, name: '营销广告'},
                            {value: 1548, name: '搜索引擎'}
                        ]
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '55%'],
                        label: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                // abg: {
                                //     backgroundColor: '#333',
                                //     width: '100%',
                                //     align: 'right',
                                //     height: 22,
                                //     borderRadius: [4, 4, 0, 0]
                                // },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        },
                        data: [
                            {value: 335, name: '直达'},
                            {value: 310, name: '邮件营销'},
                            {value: 234, name: '联盟广告'},
                            {value: 135, name: '视频广告'},
                            {value: 1048, name: '百度'},
                            {value: 251, name: '谷歌'},
                            {value: 147, name: '必应'},
                            {value: 102, name: '其他'}
                        ]
                    }
                ]
            };
            myChart.setOption(option);
        }
    }
}
</script>

<style scoped>
.el-row {
    margin: 5px;
}
</style>
