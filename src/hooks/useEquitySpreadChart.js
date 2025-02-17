import React, {useState, useEffect} from 'react';

export const useEquitySpreadCharter = (index, indexData, frequency) => {
    const [chartData, setChartData] = useState(indexData)
    const [myChartLabels, setMyChartLabels] = useState([]);
    const [myChartData, setMyChartData] = useState([]);
    const [selectedFrequency, setSelectedFrequency] = useState(frequency)
    const [indexChartCreated, setIndexChartCreated] = useState(false);
    const [createIndexChart, setCreateIndexChart] = useState(null);
    const [indexName, setIndexName] = useState('');
    const [chartColor, setChartColor] = useState('')


    useEffect(() => {
        
        switch(index){
            case 'EAFEVSC':
                setIndexName("Eafe Small Cap Vs EAFE")
                setChartColor('rgba(21, 129, 179)')
                break;
            case 'EAFEVG':
                setIndexName("Eafe Value Vs EAFE Growth")
                setChartColor('rgba(245, 223, 24)')
                break;
            case 'ACWI':
                setIndexName("MSCI ACWI Vs MSCI ACWI Ex US")
                setChartColor('rgba(21, 129, 179)')
                break;
            case 'RONEVG':
                setIndexName("Russell 1000 Value Vs Russell 1000 Growth")
                setChartColor('rgba(11, 191, 134)')
                break;
            case 'R2V1':
                setIndexName("Russell 2000 Vs Russell 1000")
                setChartColor('rgba(138, 19, 122)')
                break;
            case 'RMIDV1':
                setIndexName("Russell Mid Cap Vs Russell 1000")
                setChartColor('rgba(20, 191, 11)')
                break;
            case 'R2VMID':
                setIndexName("Russell 2000 Vs Russell Mid Cap")
                setChartColor('rgba(78, 78, 78)')
                break;
            case 'R2VG':
                setIndexName("Russell 2000 Value Vs Russell 2000 Growth")
                setChartColor('rgba(21, 129, 179)')
                break;
            case 'SPVNAS':
                setIndexName("S&P 500 Vs Nasdaq Composite")
                setChartColor('rgba(179, 61, 32)')
                break;
            case 'SPVSPQ':
                setIndexName("S&P 500 Vs S&P 500 Quality")
                setChartColor('rgba(44, 160, 168)')
                break;
            case 'USFINVTOT':
                setIndexName("Us Financials Vs US Total Market")
                setChartColor('rgba(115, 113, 10)')
                break;
            case 'USMATVTOT':
                setIndexName("US Materials Vs US Total Market")
                setChartColor('rgba(18, 97, 56)')
                break;
            case 'USHCVTOT':
                setIndexName("US Health Care Vs US Total Market")
                setChartColor('rgba(21, 47, 54)')
                break;
            case 'USCSVTOT':
                setIndexName("US Consumer Staples Vs US Total Market")
                setChartColor('rgba(82, 26, 82)')
                break;
            case 'USCDVTOT':
                setIndexName("US Consumer Discretionary Vs US Total Market")
                setChartColor('rgba(44, 160, 168)')
                break;
            case 'USINDVTOT':
                setIndexName("US Industrials Vs US Total Market")
                setChartColor('rgba(44, 160, 168)')
                break;
            case 'TSXVSCI':
                setIndexName("TSX Small Cap Vs TSX Composite")
                setChartColor('rgba(20, 191, 11)')
                break;
            case 'TSXMINVCOMP':
                setIndexName("TSX Mining Vs TSX Composite")
                setChartColor('rgba(78, 78, 78)')
                break;
            case 'TSXBANKVCOMP':
                setIndexName("TSX Banks Vs TSX Composite")
                setChartColor('rgba(179, 61, 32)')
                break;
            case 'USCAN':
                setIndexName("S&P 500 Vs TSX Composite")
                setChartColor('rgba(21, 47, 54)')
                break;
            default:
                break
        }
        // console.log(myChartData, "Data From Effect")
        // console.log(myChartLabels, "Labels From Effect")

        // switch(selectedFrequency){
        //     case 'Quarterly':
        //         setMyChartLabels(indexData?.quarterly?.dates);
        //         setMyChartData(indexData?.quarterly?.value)
        //         break;
        //     case 'Yearly':
        //         setMyChartLabels(indexData?.yearly?.dates);
        //         setMyChartData(indexData?.yearly?.value)
        //         break;
        //     case 'Three Year':
        //         setMyChartLabels(indexData?.threeyear?.dates);
        //         setMyChartData(indexData?.threeyear?.value)
        //         break;
        //     default:
        //         break;
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        setSelectedFrequency(frequency)
        
        if (selectedFrequency === 'Quarterly'){
            setMyChartLabels(indexData?.quarterly?.dates);
            setMyChartData(indexData?.quarterly?.value)
        } else if (selectedFrequency === 'Yearly'){
            setMyChartLabels(indexData?.yearly?.dates);
            setMyChartData(indexData?.yearly?.value)
        } else if (selectedFrequency === 'Three Year') {
            setMyChartLabels(indexData?.threeyear?.dates);
            setMyChartData(indexData?.threeyear?.value)
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
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myChartData, myChartLabels, selectedFrequency, frequency])


    // bool, chart, namne
    return {
        indexChartCreated, 
        createIndexChart,
        indexName
    }
}