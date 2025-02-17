import React, {useState, useEffect} from 'react';


export const useIndexCharter = (index, indexLabels, indexData) => {
    const [myChartLabels, setMyChartLabels] = useState([]);
    const [myChartData, setMyChartData] = useState([]);
    const [indexChartCreated, setIndexChartCreated] = useState(false);
    const [createIndexChart, setCreateIndexChart] = useState(null);
    const [indexName, setIndexName] = useState('');
    const [chartColor, setChartColor] = useState('')


    useEffect(() => {
        setMyChartLabels(indexLabels);
        setMyChartData(indexData)

    }, [indexData, indexLabels])


    useEffect(() => {
        switch(index){
            case 'GSPC':
                setIndexName("S&P 500 Index")
                setChartColor('rgba(21, 129, 179)')
                break;
            case 'IXIC':
                setIndexName("Nasdaq Index")
                setChartColor('rgba(245, 223, 24)')
                break;
            case 'RUT':
                setIndexName("Russell 2000 Index")
                setChartColor('rgba(11, 191, 134)')
                break;
            case 'FTSE':
                setIndexName("FTSE 100 Index")
                setChartColor('rgba(138, 19, 122)')
                break;
            case 'DJI':
                setIndexName("Dow Jones Industrial Index")
                setChartColor('rgba(20, 191, 11)')
                break;
            case 'GSPTSE':
                setIndexName("S&P/TSX Composite Index")
                setChartColor('rgba(78, 78, 78)')
                break;
            case 'VIX':
                setIndexName("CBOE Volatility Index")
                setChartColor('rgba(179, 61, 32)')
                break;
            case 'N225':
                setIndexName("Nikkei 225")
                setChartColor('rgba(115, 113, 10)')
                break;
            case 'HSI':
                setIndexName("Hang Seng Index")
                setChartColor('rgba(18, 97, 56)')
                break;
            case 'IRX':
                setIndexName("13 Week Treasury Bill")
                setChartColor('rgba(21, 47, 54)')
                break;
            case 'TNX':
                setIndexName("U.S. 10 Year Treasury")
                setChartColor('rgba(82, 26, 82)')
                break;
            case 'TYX':
                setIndexName("U.S. 30 Year Treasury")
                setChartColor('rgba(44, 160, 168)')
                break;
            default:
                break
        }
        const drawChart = () => {
            let chart= {
                type:'line',
                labels:myChartLabels,
                datasets: [{
                  label: indexName,
                  data:myChartData,
                  borderColor: chartColor,
                  backgroundColor: chartColor,
                  pointRadius: 1
                }]
              }
              setIndexChartCreated(true)
              return chart
        }

        setCreateIndexChart(drawChart())
        
    }, [myChartData])


    // bool, chart, namne
    return {
        indexChartCreated, 
        createIndexChart,
        indexName
    }
}