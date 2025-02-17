import React, {useState, useEffect} from 'react';

const maKeys = ['dates', 'ma_10_index', 'ma_10_key', 'ma_20_index', 'ma_20_key', 'ma_50_index', 'ma_50_key', 'ma_120_index', 'ma_120_key', 'ma_200_index', 'ma_200_key',]
const returnKeys = ['dates', '30_day_return_spread', '60_day_return_spread', '120_day_return_spread', 'year_1_ret_spread']
const volKeys = ['dates', '30_day_vol_spread', '60_day_vol_spread', '90_day_vol_spread', '120_day_vol_spread']
const betaKeys = ['dates', 'beta30', 'beta60', 'beta90']
const sharpeKeys = ['dates', '30_day_ret_risk', '60_day_ret_risk', '120_day_ret_risk', 'sharpe_1_year']
const spComparisons = ['CBOE Volatility Index', 'Euronext 100', 'FTSE 100', 'FTSE 250', 'Hang Seng Index', 'Nikkei 225', 'Russell 2000', 'S&P 400 Mid Cap', 'S&P/TSX Composite', 'STOXX 600']
const tsxComparisons = ['CBOE Volatility Index', 'Euronext 100', 'FTSE 100', 'FTSE 250', 'Hang Seng Index', 'Nikkei 225', 'S&P 500', 'S&P 400 Mid Cap', 'S&P/TSX 60', 'STOXX 600']
const russellComparisons = ['CBOE Volatility Index', 'S&P 500', 'FTSE 250', 'FTSE 350', 'Russell 1000', 'Russell 3000', 'Russell Mid Cap', 'S&P 100', 'STOXX 600', 'Nikkei 300']
const nasdaqComparisons = ['CBOE Volatility Index', 'Dow Jones Transportation Average', 'Dow Jones U.S. Semiconductors Index', 'Dow Jones U.S. Total Stock Mark', 'Dow Jones Utility Average', 'FTSE 350 Index - Oil & Gas Prod', 'S&P 500', 'S&P/TSX Composite index']
const djComparisons = ['CBOE Volatility Index', 'Nifty 50', 'S&P/TSX 60 Index', 'CAC 40', 'NYSE International 100 Index', 'IBEX 35', 'S&P BSE Sensex', 'IPC Mexico', 'S&P 500', 'ESTX 50']




export const useVixCharts = (labels, indexOne, dataOne, dataTwo) => {
    const [myChartData, setMyChartData] = useState([]);
    const [chartCreated, setChartCreated] = useState(false);
    const [createChart, setCreateChart] = useState(null);

    const vixOptions = {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: `${indexOne} Relative to The VIX`,
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



    useEffect(() => {


        const drawChart = () => {
            
            let chart= {
                labels,
                datasets: [
                    {
                      label: `${indexOne}`,
                      data: dataOne,
                      borderColor: 'rgb(21, 129, 179)',
                      backgroundColor: 'rgba(21, 129, 179, 1)',
                      yAxisID: 'y',
                      pointRadius: 1
                    },
                    {
                      label: `VIX`,
                      data: dataTwo,
                      borderColor: 'rgb(199, 10, 10)',
                      backgroundColor: 'rgba(199, 10, 10, 1)',
                      yAxisID: 'y1',
                      pointRadius: 1
                    },
                  ],
              }

              return chart
        }

        setCreateChart(drawChart())
        setChartCreated(true)
    }, [myChartData, indexOne, dataOne, dataTwo])

    return {
        chartCreated, 
        createChart,
        vixOptions
    }
}