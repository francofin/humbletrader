export const plotMacdChart = (dataOne, indicatorOne, indicatorTwo, indicatorThree, chartLabel) => {
    console.log(dataOne)
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
              let userPeriodOne = dataOne?.macd;
              userPeriodOneDates= dataOne?.dates
              let indicatorDataOne  = {
                  label: 'MACD',
                  data:userPeriodOne,
                  borderColor: '#4e4e4e',
                  backgroundColor: '#4e4e4e',
                  yAxisID: 'y',
                  pointRadius: 1,
                  type:'line'
              }
              dataSets.push(indicatorDataOne)
              let userPeriodSignal =dataOne?.signal;
              let indicatorDataThree  = {
                  label: 'Signal',
                  data: userPeriodSignal,
                  borderColor: '#1a629d',
                  backgroundColor: '#1a629d',
                  yAxisID: 'y',
                  pointRadius: 1,
                  type:'line'
              }
              dataSets.push(indicatorDataThree)
              let userPeriodTwo =dataOne?.hist;
              let indicatorDataTwo  = {
                  label: 'Histogram',
                  data: userPeriodTwo,
                  borderColor: '#ffd451',
                  backgroundColor: '#ffd451',
                  yAxisID: 'y1',
                  borderWidth: 2,
                  type:'bar'
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