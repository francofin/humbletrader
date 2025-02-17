import React, {useState, useEffect} from 'react';
import swal from 'sweetalert';

export const useBarChart = (ticker, chartTickers, chartData, myFactor) => {
    const [myChartLabels, setMyChartLabels] = useState(chartTickers);
    const [myChartData, setMyChartData] = useState(chartData);
    const [factor, setFactor] = useState(myFactor)
    const [selectStock, setSelectStock] = useState(ticker)
    const [barChartCreated, setBarChartCreated] = useState(false);
    const [createChart, setCreateChart] = useState(null);
    const peerColor = 'rgba(222, 204, 11, 0.5)';
    const stockColor = 'rgba(46, 46, 46, 0.5)'
    let customBackgroundColor = [];
    if(chartTickers){
        for (let i=0; i<chartTickers.length; i++){
            if (chartTickers[i] === ticker){
                customBackgroundColor.push(stockColor)
            } else{
                customBackgroundColor.push(peerColor)
            }
        };
    } 
    // else{
    //     swal({
    //         title: `Just a Heads Up, no Peer Data Currently In our Database For This Equity. We Continue to Develop our capabilites to better Serve you.`,
    //         icon: "warning",
    //     });
    // }
    

    const customBorderColor = chartTickers?.map(() => 'rgba(46, 46, 46, 0.5)');
    
    useEffect(() => {
        const drawChart = () => {
            if(myChartLabels){
                let chart= {
                    labels:myChartLabels,
                    datasets: [
                        {   axis:'y',
                            label: factor,
                            data:myChartData,
                            borderColor:customBorderColor,
                            backgroundColor:customBackgroundColor,
                        },
                    ],
                }
                setBarChartCreated(true)
                return chart
            } else {
                swal({
                    title: `Just A Heads Up, No Peer Data Currently In Our Database For This Stock. We Continue To Develop Our Capabilites To Better Serve You.`,
                    icon: "warning",
                });
            }  
        }
        

        setCreateChart(drawChart())
        
    }, [myChartLabels, myChartData])

    return {
        barChartCreated, 
        createChart
    }
}