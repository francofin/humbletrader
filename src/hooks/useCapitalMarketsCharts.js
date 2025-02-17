import React, {useState, useEffect} from 'react';

export const useCapitalMarketCharter = (index, indexLabels, indexData) => {
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
            case '10Y':
                setIndexName("Ten Year Yield")
                setChartColor('rgba(21, 129, 179)')
                break;
            case '5Y':
                setIndexName("Five Year Yield")
                setChartColor('rgba(245, 223, 24)')
                break;
            case '2Y':
                setIndexName("Two Year Yield")
                setChartColor('rgba(11, 191, 134)')
                break;
            case '30Y':
                setIndexName("Thirty Year Yield")
                setChartColor('rgba(138, 19, 122)')
                break;
            case 'MLHY':
                setIndexName("High Yield Bond Index")
                setChartColor('rgba(20, 191, 11)')
                break;
            case 'TWOVTEN':
                setIndexName("Two Year Yield Minus Ten Year Yield")
                setChartColor('rgba(78, 78, 78)')
                break;
            case 'FIVEVTEN':
                setIndexName("Five Year Yield Minus Ten Year Yield")
                setChartColor('rgba(179, 61, 32)')
                break;
            case 'TENVTHIRTY':
                setIndexName("Ten Year Yield Minus Thirty Year Yield")
                setChartColor('rgba(115, 113, 10)')
                break;
            case 'TWOVFIVE':
                setIndexName("Two Year Yield Minus Five Year Yield")
                setChartColor('rgba(18, 97, 56)')
                break;
            case 'TENVMLHY':
                setIndexName("Ten Year Yield Minus High Yield Bond Index")
                setChartColor('rgba(82, 26, 82)')
                break;
            case 'CPI':
                setIndexName("CPI Year over Year Change")
                setChartColor('rgba(44, 160, 168)')
                break;
            case 'UNEMP':
                setIndexName("Unemployment Rate")
                setChartColor('rgba(179, 61, 32)')
                break;
            case 'NONFARM':
                setIndexName("Non Farm Payroll")
                setChartColor('rgba(20, 191, 11)')
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