import React, {useState, useEffect} from 'react';
import swal from 'sweetalert';
import dayjs from 'dayjs';


export const useNewCandleStick = (candleData, volumeData, averageVolume) => {
    const [userChartData, setUserChartData] = useState(null)
    const  [userVolumeData, setUserVolumeData] = useState(null)
    const [avgVolume, setAvgVolume] = useState(0)
    const [chartCreated, setChartCreated] = useState(false)
    const [createChart, setCreateChart] = useState(null)
    
    
    
    useEffect(() => {
        const drawChart = () => {
           
            setUserChartData(candleData)
            setUserVolumeData(volumeData)
            setAvgVolume(averageVolume)
            if(userChartData){
                console.log(new Date(userChartData[userChartData?.length - 30].x).getTime())
                let chartOptions = {
          
                    series: [{
                      data: userChartData
                    }],
                    options: {
                      chart: {
                        type: 'candlestick',
                        height: 400,
                        id: 'candles',
                        toolbar: {
                          autoSelected: 'pan',
                          show: true
                        },
                        zoom: {
                          enabled: false
                        },
                      },
                      plotOptions: {
                        candlestick: {
                          colors: {
                            upward: '#019153',
                            downward: '#99030d'
                          }
                        }
                      },
                      tooltip: {
                        enabled: true,
                      },
                      xaxis: {
                        type: 'category',
                        labels: {
                            formatter: function(val) {
                                return dayjs(val).format('MMM DD HH:mm')
                              },
                            },
                            tooltip: {
                                enabled: true,
                              },
                      },
                      yaxis:{
                        tooltip: {
                            enabled: true
                          },
                      },
                    },
                  
                    seriesBar: [{
                      name: 'volume',
                      data: userVolumeData
                    }],
                    optionsBar: {
                      chart: {
                        height: 160,
                        type: 'bar',
                        brush: {
                          enabled: true,
                          target: 'candles'
                        },
                        selection: {
                          enabled: true,
                          
                          xaxis: {
                            min: new Date(userChartData[userChartData?.length - 30].x).getTime(),
                            max: new Date(userChartData[userChartData?.length - 1].x).getTime()
                          },
                          fill: {
                            color: '#ccc',
                            opacity: 0.4
                          },
                          stroke: {
                            color: '#0D47A1',
                          }
                        },
                      },
                      dataLabels: {
                        enabled: false
                      },
                      plotOptions: {
                        bar: {
                          columnWidth: '80%',
                          colors: {
                            ranges: [{
                              from: 0,
                              to: avgVolume -avgVolume*0.1,
                              color: '#4e4e4e'
                            }, {
                              from: avgVolume,
                              to: avgVolume*3,
                              color: '#138bed'
                            }],
                      
                          },
                        }
                      },
                      stroke: {
                        width: 0
                      },
                      xaxis: {
                        type: 'category',
                        labels: {
                        formatter: function(val) {
                            return dayjs(val).format('MMM DD HH:mm')
                          },
                        },
                        axisBorder: {
                          offsetX: 13
                        }
                      },
                      yaxis: {
                        labels: {
                          show: true
                        },
                        tooltip: {
                            enabled: true,
                          },
                      },
                      tooltip: {
                        enabled: true,
                      },
                    },
                  
                  
                  };

                setChartCreated(true)
                return chartOptions
            }
        }
        

        setCreateChart(drawChart())
        
    }, [candleData, userChartData, volumeData, userVolumeData, averageVolume, avgVolume])

    return {
        chartCreated, 
        createChart
    }
}
