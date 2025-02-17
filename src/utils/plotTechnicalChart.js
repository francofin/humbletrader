
export const technicalCharter = (dataOne, dataTwo, indicatorOne, indicatorTwo, chartLabel) => {

    const chartOptions = {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: chartLabel,
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


        let dataSets = []
        let userPeriodOneDates
        if(dataOne?.sorted_technicals.length > 1){
            console.log('Is True')
            let userPeriodOne = dataOne?.sorted_technicals;
            userPeriodOneDates= dataOne?.sorted_dates
            let indicatorDataOne  = {
                label: indicatorOne ? indicatorOne : null,
                data:userPeriodOne,
                borderColor: '#4e4e4e',
                backgroundColor: '#4e4e4e',
                yAxisID: 'y',
                pointRadius: 1
            }
            dataSets.push(indicatorDataOne)
        }
        if(dataTwo?.sorted_technicals.length > 1){
            let userPeriodTwo =dataTwo?.sorted_technicals;
            userPeriodOneDates =dataTwo?.sorted_dates
            let indicatorDataTwo  = {
                label: indicatorTwo ? indicatorTwo : null,
                data: userPeriodTwo,
                borderColor: '#ffd451',
                backgroundColor: '#ffd451',
                yAxisID: 'y1',
                pointRadius: 1
            }
            dataSets.push(indicatorDataTwo)
        }
    console.log(userPeriodOneDates)
            
        let chart= {
            labels:userPeriodOneDates,
            datasets: dataSets     
            }

        return {
        chart,
        chartOptions
        }
        
}