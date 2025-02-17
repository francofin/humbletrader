import React, {useState, useEffect} from 'react';



const spDataOneIndexes = ['VIX', 'N100']
const spDataTwoIndexes = ['FTSE', 'FTMC']
const spDataThreeIndexes = ['HSI', 'N225']
const spDataFourIndexes = ['RUT', 'MID']
const spDataFiveIndexes = ['GSPTSE', 'STOXX']


const tsxDataOneIndexes = ['VIX', 'N100']
const tsxDataTwoIndexes = ['FTSE', 'FTMC']
const tsxDataThreeIndexes = ['HSI', 'N225']
const tsxDataFourIndexes = ['GSPC', 'MID']
const tsxDataFiveIndexes = ['TX60_TS', 'STOXX']

const russellDataOneIndexes = ['VIX', 'GSPC']
const russellDataTwoIndexes = ['FTMC', 'FTLC']
const russellDataThreeIndexes = ['RUI', 'RUA']
const russellDataFourIndexes = ['RMCCTR', 'OEX']
const russellDataFiveIndexes = ['STOXX', 'N300']

const nasdaqDataOneIndexes = ['VIX', 'DJT']
const nasdaqDataTwoIndexes = ['DJUSSC', 'DWCF']
const nasdaqDataThreeIndexes = ['DJU', 'NMX0530']
const nasdaqDataFourIndexes = ['GSPC']
const nasdaqDataFiveIndexes = ['GSPTSE']

const djDataOneIndexes = ['VIX', 'NSEI']
const djDataTwoIndexes = ['TX60_TS', 'FCHI']
const djDataThreeIndexes = ['NYITR', 'IBEX']
const djDataFourIndexes = ['BSESN', 'MXX']
const djDataFiveIndexes = ['GSPC', 'STOXX50E']





export const useMetricCharts = (dataOne, dataTwo, dataThree, dataFour, dataFive, indexOne, indexTwo, slug, frequency) => {
    
    const [chartCreated, setChartCreated] = useState(false);
    const [dataPack, setDataPack] = useState([]);
    const [comparisonIndex, setComparisonIndex] = useState('');
    const [createChart, setCreateChart] = useState(null);
    const [userSelectedDates, setUserSelectedDates] = useState([])
    const [userSelectedComparisonData, setUserSelectedComparisonData] = useState([])
    const [userSelectedIndexData, setUserSelectedIndexData] = useState([])

    
   

    const comparisonOptions = {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: `${indexOne} Comparison Charts.`,
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      };


    //   console.log(indexTwo)



    useEffect(() => {
        
        setComparisonIndex(indexTwo);
        
        if (slug === 'sp500'){
            if (spDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex]?.moving_average)
            } else if(spDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex]?.moving_average)
            } else if(spDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[comparisonIndex]?.moving_average)
            } else if(spDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex]?.moving_average)
            } else if(spDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex]?.moving_average)
            }
       } else if (slug === 'tsx'){
            if (tsxDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex]?.moving_average)
            } else if(tsxDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex]?.moving_average)
            } else if(tsxDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[comparisonIndex]?.moving_average)
            } else if(tsxDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex]?.moving_average)
            } else if(tsxDataFiveIndexes.includes(indexTwo)){
                setDataPack(dataFive && dataFive[comparisonIndex]?.moving_average)
            }
       } else if (slug === 'nasdaq'){
            if (nasdaqDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex]?.moving_average)
            } else if(nasdaqDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex]?.moving_average)
            } else if(nasdaqDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[indexTwo]?.moving_average)
            } else if(nasdaqDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex]?.moving_average)
            } else if(nasdaqDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex]?.moving_average)
            }
        } else if (slug === 'dow'){
            if (djDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex]?.moving_average)
            } else if(djDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex]?.moving_average)
            } else if(djDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[comparisonIndex]?.moving_average)
            } else if(djDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex]?.moving_average)
            } else if(djDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex]?.moving_average)
            }
        } else if (slug === 'r2000'){
            if (russellDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex]?.moving_average)
            } else if(russellDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex]?.moving_average)
            } else if(russellDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[comparisonIndex]?.moving_average)
            } else if(russellDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex]?.moving_average)
            } else if(russellDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex]?.moving_average)
            }
        }


        switch(frequency){
            case '10 Day Moving Average':
                setUserSelectedIndexData(dataPack?.ma_10_index);
                setUserSelectedComparisonData(dataPack?.ma_10_key)
                setUserSelectedDates(dataPack?.dates)
                break;
            case '20 Day Moving Average':
                setUserSelectedIndexData(dataPack?.ma_20_index);
                setUserSelectedComparisonData(dataPack?.ma_20_key)
                setUserSelectedDates(dataPack?.dates)
                break;
            case '50 Day Moving Average':
                setUserSelectedIndexData(dataPack?.ma_50_index);
                setUserSelectedComparisonData(dataPack?.ma_50_key)
                setUserSelectedDates(dataPack?.dates)
                break;
            case '120 Day Moving Average':
                setUserSelectedIndexData(dataPack?.ma_120_index);
                setUserSelectedComparisonData(dataPack?.ma_120_key)
                setUserSelectedDates(dataPack?.dates)
                break;
            case '200 Day Moving Average':
                setUserSelectedIndexData(dataPack?.ma_200_index);
                setUserSelectedComparisonData(dataPack?.ma_200_key)
                setUserSelectedDates(dataPack?.dates)
               break;
            default:
                break;

        }

        const drawChart = () => {
            
            let chart= {
                labels:userSelectedDates,
                datasets: [
                    {
                      label: `${indexOne}`,
                      data: userSelectedIndexData,
                      borderColor: 'rgb(255, 212, 81)',
                      backgroundColor: 'rgba(255, 212, 81, 1)',
                      yAxisID: 'y',
                      pointRadius: 1
                    },
                    {
                      label: `${comparisonIndex}`,
                      data: userSelectedComparisonData,
                      borderColor: 'rgb(26, 83, 157)',
                      backgroundColor: 'rgba(26, 83, 157, 1)',
                      yAxisID: 'y1',
                      pointRadius: 1
                    },
                  ],
              }
              setChartCreated(true)
              return chart
        }

        

        setCreateChart(drawChart())
        
 
    }, [dataOne, dataTwo, dataThree, dataFour, dataFive, indexTwo, frequency, dataPack, slug, comparisonIndex, userSelectedDates, indexOne, userSelectedIndexData, userSelectedComparisonData])

    return {
        chartCreated, 
        createChart,
        comparisonOptions
    }
}