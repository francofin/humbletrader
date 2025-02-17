
export const plotAdlChart = (dataOne, chartLabel) => {

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
        if(dataOne?.dates.length > 1){
            let userPeriodOne = dataOne?.ad_line;
            userPeriodOneDates= dataOne?.dates
            let indicatorDataOne  = {
                label: 'Accumulation Distribution Line',
                data:userPeriodOne,
                borderColor: '#4e4e4e',
                backgroundColor: '#4e4e4e',
                yAxisID: 'y',
                pointRadius: 1
            }
            dataSets.push(indicatorDataOne)

            let indicatorDataTwo  = {
                label: 'Accumulation Distribution Line',
                data:userPeriodOne,
                borderColor: '#4e4e4e',
                backgroundColor: '#4e4e4e',
                yAxisID: 'y1',
                pointRadius: 1
            }
            dataSets.push(indicatorDataTwo)
        }

            
        let chart= {
            labels:userPeriodOneDates,
            datasets: dataSets     
            }

        return {
        chart,
        chartOptions
        }
        
}