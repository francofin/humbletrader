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





export const useSingleMetric = (dataOne, dataTwo, dataThree, dataFour, dataFive, indexOne, indexTwo, tag, slug, frequency) => {
    
    const [chartCreated, setChartCreated] = useState(false);
    const [dataPack, setDataPack] = useState([])
    const [comparisonIndex, setComparisonIndex] = useState('');
    const [createChart, setCreateChart] = useState(null);
    const [chartColor, setChartColor] = useState('')
    const [userSelectedDates, setUserSelectedDates] = useState([])
    const [userSelectedIndexData, setUserSelectedIndexData] = useState([])

    
    




    useEffect(() => {
        
        setComparisonIndex(indexTwo);

        if (slug === 'sp500'){
            if (spDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex])
            } else if(spDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex])
            } else if(spDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[comparisonIndex])
            } else if(spDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex])
            } else if(spDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex])
            }
       } else if (slug === 'tsx'){
            if (tsxDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex])
            } else if(tsxDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex])
            } else if(tsxDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[comparisonIndex])
            } else if(tsxDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex])
            } else if(tsxDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex])
            }
       } else if (slug === 'nasdaq'){
            if (nasdaqDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex])
            } else if(nasdaqDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex])
            } else if(nasdaqDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[indexTwo])
            } else if(nasdaqDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex])
            } else if(nasdaqDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex])
            }
        } else if (slug === 'dow'){
            if (djDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex])
            } else if(djDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex])
            } else if(djDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[comparisonIndex])
            } else if(djDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex])
            } else if(djDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex])
            }
        } else if (slug === 'r2000'){
            if (russellDataOneIndexes.includes(comparisonIndex)){
                setDataPack(dataOne && dataOne[comparisonIndex])
            } else if(russellDataTwoIndexes.includes(comparisonIndex)){
                setDataPack(dataTwo && dataTwo[comparisonIndex])
            } else if(russellDataThreeIndexes.includes(comparisonIndex)){
                setDataPack(dataThree && dataThree[comparisonIndex])
            } else if(russellDataFourIndexes.includes(comparisonIndex)){
                setDataPack(dataFour && dataFour[comparisonIndex])
            } else if(russellDataFiveIndexes.includes(comparisonIndex)){
                setDataPack(dataFive && dataFive[comparisonIndex])
            }
        }


        console.log(dataPack);

        switch(tag){
            case 'returns':
                if(frequency === '30 Day Return Spread'){
                    setUserSelectedIndexData(dataPack?.returns?.day_30_return_spread);
                    setUserSelectedDates(dataPack?.returns?.dates);
               } else if(frequency === '60 Day Return Spread'){
                    setUserSelectedIndexData(dataPack?.returns?.day_30_return_spread);
                    setUserSelectedDates(dataPack?.returns?.dates);
               } else if(frequency === '120 Day Return Spread'){
                    setUserSelectedIndexData(dataPack?.returns?.day_120_return_spread);
                    setUserSelectedDates(dataPack?.returns?.dates);
                } else if(frequency === '1 year Return Spread'){
                    setUserSelectedIndexData(dataPack?.returns?.year_1_ret_spread);
                    setUserSelectedDates(dataPack?.returns?.dates);
                }
                setChartColor('rgba(21, 129, 179)') 
                break;
            case 'beta':
                if(frequency === '30 Day Beta'){
                    setUserSelectedIndexData(dataPack?.beta?.beta30);
                    setUserSelectedDates(dataPack?.beta?.dates);
                } else if(frequency === '60 Day Beta'){
                    setUserSelectedIndexData(dataPack?.beta?.beta60);
                    setUserSelectedDates(dataPack?.beta?.dates);
                } else if(frequency === '120 Day Beta'){
                    setUserSelectedIndexData(dataPack?.beta?.beta120);
                    setUserSelectedDates(dataPack?.beta?.dates);
                }
                setChartColor('rgba(245, 223, 24)') 
                break;
            case 'vol':
                if(frequency === '30 Day Vol Spread'){
                    setUserSelectedIndexData(dataPack?.vol?.day_30_vol_spread);
                    setUserSelectedDates(dataPack?.vol?.dates);
               } else if(frequency === '60 Day Vol Spread'){
                    setUserSelectedIndexData(dataPack?.vol?.day_60_vol_spread);
                    setUserSelectedDates(dataPack?.vol?.dates);
               } else if(frequency === '90 Day Vol Spread'){
                    setUserSelectedIndexData(dataPack?.vol?.day_90_vol_spread);
                    setUserSelectedDates(dataPack?.vol?.dates);
                } else if(frequency === '120 Day Vol Spread'){
                    setUserSelectedIndexData(dataPack?.vol?.day_120_vol_spread);
                    setUserSelectedDates(dataPack?.vol?.dates);
                }
                setChartColor('rgba(11, 191, 134)')
                break;
            case 'sharpe':
                if(frequency === '30 Day Return to Risk'){
                    setUserSelectedIndexData(dataPack?.sharpe?.day_30_ret_risk);
                    setUserSelectedDates(dataPack?.sharpe?.dates);
               } else if(frequency === '60 Day Return to Risk'){
                    setUserSelectedIndexData(dataPack?.sharpe?.day_60_ret_risk);
                    setUserSelectedDates(dataPack?.sharpe?.dates);
               } else if(frequency === '120 Day Return to Risk'){
                    setUserSelectedIndexData(dataPack?.sharpe?.day_120_ret_risk);
                    setUserSelectedDates(dataPack?.sharpe?.dates);
                } else if(frequency === '1 Year Return to Risk'){
                    setUserSelectedIndexData(dataPack?.sharpe?.sharpe_1_year);
                    setUserSelectedDates(dataPack?.sharpe?.dates);
                }
                setChartColor('rgba(138, 19, 122)')
                break;
            default:
                break;

        }

        const drawChart = () => {
            
            let chart= {
                type:'line',
                labels:userSelectedDates,
                datasets: [{
                    label: frequency,
                    data:userSelectedIndexData,
                    borderColor: chartColor,
                    backgroundColor: chartColor,
                    pointRadius: 1
                  }],
              }
              setChartCreated(true)
              return chart
        }

        setCreateChart(drawChart())
        
    }, [dataOne, dataTwo, dataThree, dataFour, dataFive, indexOne, indexTwo, tag, slug, frequency, dataPack, chartColor, userSelectedIndexData, comparisonIndex, userSelectedDates])

    return {
        chartCreated, 
        createChart
    }
}