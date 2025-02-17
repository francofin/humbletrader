import React, { useEffect, useState, useMemo, useContext } from "react";
import Link from "next/link";
import { idbPromise } from "@utils/helpers";
import "react-day-picker/dist/style.css";
import Select from "react-select"
import {Container,Row,Col,Form,Button, ToggleButton, Badge, Overlay} from "react-bootstrap";
import UseWindowSize from "@hooks/UseWindowSize";
import { useIndexMetric } from "@hooks/useIndexMetrics";
import { useMetricCharts } from "@hooks/useMetricCharts";
import { useSingleMetric } from "@hooks/useSingleMetricCharts";
import { useCovarChart } from "@hooks/useCovarChart";
import { useTopPerformers } from "@hooks/useTopPerformer";
import { useVixCharts } from "@hooks/useVixChart";
import ValuationsTable from "@components/ValuationTable";
import roomData from "@data/stock-research.json";
import blog from "@data/blog.json";
import indexMetaData from "@data/index-meta.json"
import SwiperGallery from "@components/SwiperGallery";
import Image from "@components/CustomImage";
import Gallery from "@components/Gallery";
import Map from "@components/Map";
import { DjangoAuthContext } from '@context/authContext';
import { useStockData } from "@hooks/useStockData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios';
import { useIndexPerformance } from "@hooks/useIndexPerformance";
import swal from 'sweetalert';
import { isAuthenticatedUser } from '@utils/isAuthenticated';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { useBarChart } from "@hooks/useBarCharts";
import { useIndexPagePrices } from "@hooks/useIndexPagePrices";
import { useIndexCharter } from "@hooks/useIndexChart"
const compEPOne = `getcomparisondatapackone`
const compEPTwo = `getcomparisondatapacktwo`
const compEPThree = `getcomparisondatapackthree`
const compEPFour = `getcomparisondatapackfour`
const compEPFive = `getcomparisondatapackfive`


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const maFrequencies = indexMetaData['maFrequency']
export const returnFrequencies = indexMetaData['returnFrequency']
export const volFrequencies = indexMetaData['volFrequency']
export const betaFrequencies = indexMetaData['betaFrequency']
export const sharpeFrequencies = indexMetaData['sharpeFrequency']

  
export function getPostData(slug) {
  for (var i = 0; i < blog.posts.length; i++) {
    if (blog.posts[i].slug == slug) {
      return blog.posts[i]
    }
  }
}

export function getIndexMetaData(slug) {
  let metaData = indexMetaData[slug]
  return metaData
}

  export const barOptions = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'Comparative Exposures',
      },
    },
  };

export const spComparisons = ['N100', 'FTSE', 'FTMC', 'HSI', 'N225', 'RUT', 'MID', 'GSPTSE', 'STOXX','VIX']
export const tsxComparisons = ['N100', 'FTSE', 'FTMC', 'HSI', 'N225', 'GSPC', 'MID', 'TX60_TS', 'STOXX','VIX']
export const russellComparisons = ['GSPC', 'FTMC', 'FTLC', 'RUI', 'RUA', 'RMCCTR', 'OEX', 'STOXX', 'N300','VIX']
export const nasdaqComparisons = ['DJT', 'DJUSSC', 'DWCF', 'DJU', 'NMX0530', 'GSPC', 'GSPTSE','VIX']
export const djComparisons = ['NSEI', 'TX60_TS', 'FCHI', 'NYITR', 'IBEX', 'BSESN', 'MXX', 'GSPC', 'STOXX50E','VIX']


  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Time Series Data',
      },
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: false
      }
    }
  };

  export const indexLineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'Time Series Data',
      },
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: false
      }
    }
  };

  export const scatterOptions = {
    legend: {
      display: true
    },
    scales: {
      xAxes: [
      {
        gridLines: {
          drawBorder: true,
          lineWidth: 0
        },
        ticks: {
          // for debugging
          display: false,
          suggestedMin: -100,
          suggestedMax: 100
        }
      }
    ],
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            lineWidth: 0
          },
          ticks: {
            display: false,
            suggestedMin: 0,
            beginAtZero: true 
          }
        }
      ],
    },
    plugins: {
      datalabels: {
        align: "left",
        anchor: "right",
        color: "black",
        padding: { right: 20 }
      }
    },
    tooltips: {
      position: "nearest",
      mode: "point",
      intersect: true,
      yPadding: 5,
      xPadding: 10,
      caretSize: 18,
      caretPadding: 10,
      backgroundColor: "white",
      titleFontColor: "#000",
      bodyFontColor: "#000",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 1,
      yAlign: "bottom"
    }
  };

  export async function getServerSideProps({query, req }) {

    let slug = query.slug
    const stockValuations = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getstockvaluations/${slug}`);
    const valuationData = stockValuations.data;

    let userIsAuthenticated

    const access_token = req.cookies.access || '';
    if(access_token){
      userIsAuthenticated = await isAuthenticatedUser(access_token);
    }else{
      userIsAuthenticated =null
    }
    const sp500 = 'GSPC';
    const nasdaq = 'IXIC';
    const tsx = 'GSPTSE';
    const r2000 = 'RUT';
    const dji ='DJI';
    const vix = 'VIX';

    let indexCode;
    let indexList;
    switch(slug){
      case 'sp500':
        indexCode=sp500;
        indexList = spComparisons;
        break;
      case 'tsx':
        indexCode=tsx;
        indexList = tsxComparisons;
        break;
      case 'nasdaq':
        indexCode=nasdaq;
        indexList = nasdaqComparisons;
        break;
      case 'dow':
        indexCode=dji;
        indexList = djComparisons;
        break;
      case 'r2000':
        indexCode=r2000;
        indexList = russellComparisons;
        break;
      default:
        break;

    }



    let universe;
  
    const postData = getPostData("escape-city-today")
    const indexMetaDescriptions = getIndexMetaData(slug);
    return {
        props: {
        nav: {
            light: true,
            classes: "shadow",
            color: "white",
        },
        slug,
        postData,
        indexMetaDescriptions,
        indexCode,
        indexList,
        valuationData,
        // data,
        access_token,
        },
    }
}


const IndexDetail = (props) => {

  const [loading, setLoading] = useState(true);
  const [indexData, setIndexData] = useState(null);
  const [loadedIndex, setLoadedIndex] = useState(props?.indexList[0])
  const [returnLoadedIndex, setreturnLoadedIndex] = useState(props?.indexList[0])
  const [betaLoadedIndex, setBetaLoadedIndex] = useState(props?.indexList[0])
  const [volLoadedIndex, setVolLoadedIndex] = useState(props?.indexList[0])
  const [rRLoadedIndex, setRRLoadedIndex] = useState(props?.indexList[0])
  const [loadedIndexName, setLoadedIndexName] = useState(props?.indexMetaDescriptions.comparisonIndexes[0].label)
  const [retLoadedIndexName, setReturnLoadedIndexName] = useState(props?.indexMetaDescriptions.comparisonIndexes[0].label)
  const [betaLoadedIndexName, setBetaLoadedIndexName] = useState(props?.indexMetaDescriptions.comparisonIndexes[0].label)
  const [volLoadedIndexName, setVolLoadedIndexName] = useState(props?.indexMetaDescriptions.comparisonIndexes[0].label)
  const [rRLoadedIndexName, setRRLoadedIndexName] = useState(props?.indexMetaDescriptions.comparisonIndexes[0].label)
  const [comparisonIndexes, setComparisonIndexes] = useState(props?.indexMetaDescriptions.comparisonIndexes);
  const [frequency, setFrequency] = useState();
  const [maFrequency, setMaFrequency] = useState(maFrequencies[0].value)
  const [maFrequencyName, setMaFrequencyName] = useState(maFrequencies[0].label)
  const [returnFrequency, setReturnFrequency] = useState(returnFrequencies[0].value)
  const [returnName, setReturnFrequencyName] = useState(returnFrequencies[0].label)
  const [betaFrequency, setBetaFrequency] = useState(betaFrequencies[0].value)
  const [betaName, setBetaFrequencyName] = useState(betaFrequencies[0].label)
  const [volFrequency, setVolFrequency] = useState(volFrequencies[0].value)
  const [volName, setVolFrequencyName] = useState(volFrequencies[0].label)
  const [sharpeFrequency, setSharpeFrequency] = useState(sharpeFrequencies[0].value)
  const [sharpeName, setSharpeFrequencyName] = useState(sharpeFrequencies[0].label)
  const allPerformers = useTopPerformers(props?.slug);
  let topPerformers = allPerformers?.data.top_performers;
  let bottomPerformers = allPerformers?.data.bottom_performers;
  const indexMetricsOne = useIndexMetric(props?.slug, compEPOne);
  const indexMetricsTwo = useIndexMetric(props?.slug, compEPTwo);
  const indexMetricsThree = useIndexMetric(props?.slug, compEPThree);
  const indexMetricsFour = useIndexMetric(props?.slug, compEPFour);
  const indexMetricsFive = useIndexMetric(props?.slug, compEPFive);
  const valuations = props.valuationData.universe_valuations || null;
  // console.log(valuations)
  const adjustTimeStamp = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(date).toLocaleDateString(undefined, options)
  }

  const indexPrices = useIndexPagePrices(props?.indexCode);
  const vixPrices = useIndexPagePrices('VIX');
  const currentIndexPerformances = useIndexPerformance(props?.indexCode);




  function onIndexChange (index){
    setLoadedIndexName(index.label);
    setLoadedIndex(index.value);
  }

  function onReturnIndexChange (index){
    setReturnLoadedIndexName(index.label);
    setreturnLoadedIndex(index.value);
  }

  function onBetaIndexChange (index){
    setBetaLoadedIndexName(index.label);
    setBetaLoadedIndex(index.value);
  }

  function onVolIndexChange (index){
    setVolLoadedIndexName(index.label);
    setVolLoadedIndex(index.value);
  }

  function onSharpeIndexChange (index){
    setRRLoadedIndexName(index.label);
    setRRLoadedIndex(index.value);
  }

  

  const onMaFrequencyChange = (e) => {
    setMaFrequencyName(e.label);
    setMaFrequency(e.value);
  }

  const onReturnFrequencyChange = (e) => {
    setReturnFrequencyName(e.label);
    setReturnFrequency(e.value);
  }

  const onBetaFrequencyChange = (e) => {
    setBetaFrequencyName(e.label);
    setBetaFrequency(e.value);
  }

  const onVolFrequencyChange = (e) => {
    setVolFrequencyName(e.label);
    setVolFrequency(e.value);
  }

  const onSharpeFrequencyChange = (e) => {
    setSharpeFrequencyName(e.label);
    setSharpeFrequency(e.value);
  }


  const {indexChartCreated:createdIndexChart, createIndexChart:chartData, indexName:nameOfIndex} = useIndexCharter(props.indexCode, indexPrices?.index_dates, indexPrices?.index_prices)
  const {chartCreated:createdVixChart, createChart:vixData, vixOptions} = useVixCharts(vixPrices?.index_dates, props?.indexMetaDescriptions.title, indexPrices?.index_prices, vixPrices?.index_prices)
  const scatterObj = indexMetricsOne?.data?.covar

  
  const {chartCreated:volChartUp, createChart:volChart} = useCovarChart(scatterObj?.perc_contr_to_vol, scatterObj?.stocks, props?.indexMetaDescriptions.title)
  const {chartCreated:retChartUp, createChart:retChart} = useCovarChart(scatterObj?.returns, scatterObj?.stocks, props?.indexMetaDescriptions.title)
  
  
  const {chartCreated:maChartUp, createChart:maChart, comparisonOptions} = useMetricCharts(indexMetricsOne?.data?.index_data, indexMetricsTwo?.data?.index_data,indexMetricsThree?.data?.index_data, indexMetricsFour?.data?.index_data, indexMetricsFive?.data?.index_data, props?.indexMetaDescriptions.title, loadedIndex, props?.slug, maFrequency)
  const {chartCreated:returnChartUp, createChart:returnChart} = useSingleMetric(indexMetricsOne?.data?.index_data, indexMetricsTwo?.data?.index_data,indexMetricsThree?.data?.index_data, indexMetricsFour?.data?.index_data, indexMetricsFive?.data?.index_data, props?.indexMetaDescriptions.title, returnLoadedIndex,"returns", props?.slug, returnFrequency)
  const {chartCreated:betaChartUp, createChart:betaChart} = useSingleMetric(indexMetricsOne?.data?.index_data, indexMetricsTwo?.data?.index_data,indexMetricsThree?.data?.index_data, indexMetricsFour?.data?.index_data, indexMetricsFive?.data?.index_data, props?.indexMetaDescriptions.title, betaLoadedIndex,"beta", props?.slug, betaFrequency)
  const {chartCreated:volSChartUp, createChart:volSChart} = useSingleMetric(indexMetricsOne?.data?.index_data, indexMetricsTwo?.data?.index_data,indexMetricsThree?.data?.index_data, indexMetricsFour?.data?.index_data, indexMetricsFive?.data?.index_data, props?.indexMetaDescriptions.title, volLoadedIndex,"vol", props?.slug, volFrequency)
  const {chartCreated:rRChartUp, createChart:rRChart} = useSingleMetric(indexMetricsOne?.data?.index_data, indexMetricsTwo?.data?.index_data,indexMetricsThree?.data?.index_data, indexMetricsFour?.data?.index_data, indexMetricsFive?.data?.index_data, props?.indexMetaDescriptions.title, rRLoadedIndex,"sharpe", props?.slug, sharpeFrequency)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => {

  //   const setPageData = async() => {
  //     try{
  //       let items = await idbPromise(props?.slug, 'get', props?.slug)
  //       setIndexData(items);
  //       if(items.length === 0){
  //         console.log('Items are none')
  //       } else{
  //         idbPromise(props?.slug, 'put', props?.slug, indexMetrics);
          
  //     }} catch(error){
  //       console.log("Data Loading")
  //     }
  //   }

  //   setPageData();
  
  // }, [indexMetrics])

  // console.log(indexMetricsOne)

    return(
        <React.Fragment>
            <section>
              <SwiperGallery data={roomData.swiper} />
                <Container className="py-6">
                  <Row>
                    <Col lg="8">
                    <div className="text-block">
                    <ul className="list-inline text-sm mb-4">
                        {(currentIndexPerformances) && (Number(currentIndexPerformances[0]["1D"]) > 0) ?
                            <li className="list-inline-item me-3" style={{color:"green"}}>
                            % 1 Day: {currentIndexPerformances && Number(currentIndexPerformances[0]["1D"]).toFixed(1)}%
                          </li> :
                          <li className="list-inline-item me-3" style={{color:'red'}}>
                            % 1 Day: {currentIndexPerformances && Number(currentIndexPerformances[0]["1D"]).toFixed(1)}%
                          </li>
                          } 
                          {(currentIndexPerformances) && (Number(currentIndexPerformances[0]["5D"]) > 0) ?
                            <li className="list-inline-item me-3" style={{color:"green"}}>
                            % 5 Day: {currentIndexPerformances && Number(currentIndexPerformances[0]["5D"]).toFixed(1)}%
                          </li> :
                          <li className="list-inline-item me-3" style={{color:'red'}}>
                            % 5 Day: {currentIndexPerformances && Number(currentIndexPerformances[0]["5D"]).toFixed(1)}%
                          </li>
                          } 
                          {(currentIndexPerformances) && (Number(currentIndexPerformances[0]["1M"]) > 0) ?
                            <li className="list-inline-item me-3" style={{color:"green"}}>
                            % 1 Month: {currentIndexPerformances && Number(currentIndexPerformances[0]["1M"]).toFixed(1)}%
                          </li> :
                          <li className="list-inline-item me-3" style={{color:'red'}}>
                            % 1 Month: {currentIndexPerformances && Number(currentIndexPerformances[0]["1M"]).toFixed(1)}%
                          </li>
                          } 
                          {(currentIndexPerformances) && (Number(currentIndexPerformances[0]["3M"]) > 0) ?
                            <li className="list-inline-item me-3" style={{color:"green"}}>
                            % 3 Month: {currentIndexPerformances && Number(currentIndexPerformances[0]["3M"]).toFixed(1)}%
                          </li> :
                          <li className="list-inline-item me-3" style={{color:'red'}}>
                            % 3 Month: {currentIndexPerformances && Number(currentIndexPerformances[0]["3M"]).toFixed(1)}%
                          </li>
                          } 
                          {(currentIndexPerformances) && (Number(currentIndexPerformances[0]["6M"]) > 0) ?
                            <li className="list-inline-item me-3" style={{color:"green"}}>
                            % 6 Month: {currentIndexPerformances && Number(currentIndexPerformances[0]["6M"]).toFixed(1)}%
                          </li> :
                          <li className="list-inline-item me-3" style={{color:'red'}}>
                            % 6 Month: {currentIndexPerformances && Number(currentIndexPerformances[0]["6M"]).toFixed(1)}%
                          </li>
                          } 
                          {(currentIndexPerformances) && (Number(currentIndexPerformances[0]["ytd"]) > 0) ?
                            <li className="list-inline-item me-3" style={{color:"green"}}>
                            % YTD: {currentIndexPerformances && Number(currentIndexPerformances[0]["ytd"]).toFixed(1)}%
                          </li> :
                          <li className="list-inline-item me-3" style={{color:'red'}}>
                            % YTD: {currentIndexPerformances && Number(currentIndexPerformances[0]["ytd"]).toFixed(1)}%
                          </li>
                          } 
                          {(currentIndexPerformances) && (Number(currentIndexPerformances[0]["1Y"]) > 0) ?
                            <li className="list-inline-item me-3" style={{color:"green"}}>
                            % 1 Year: {currentIndexPerformances && Number(currentIndexPerformances[0]["1Y"]).toFixed(1)}%
                          </li> :
                          <li className="list-inline-item me-3" style={{color:'red'}}>
                            % 1 Year: {currentIndexPerformances && Number(currentIndexPerformances[0]["1Y"]).toFixed(1)}%
                          </li>
                          }
                        </ul>
                        <h1>{props?.indexMetaDescriptions.title}</h1>
                          <div className="text-muted text-uppercase mb-4">
                            {`A Historical Perspective Of the ${props?.indexMetaDescriptions.title}`}
                          </div>
                        <ul className="list-inline text-sm mb-4">
                              <li className="list-inline-item me-3">
                                Footnotes: See Here for calculation methodology
                              </li>
                              <li className="list-inline-item me-3">
                                Data As Of: {adjustTimeStamp(new Date())}
                              </li>
                        </ul>
                        <h6 className="mb-3">Index History</h6>
                        <p className="text-muted fw-light">
                        {props?.indexMetaDescriptions.indexHistory}
                        </p>
                    </div>
                      <section className="py-0 bg-gray-100">
                        <Container>
                        {createdIndexChart && 
                            <Row className="pt-3">
                              <Col lg="12">
                                <Line options={indexLineOptions} data={chartData} height={100} width={200}/>
                              </Col>
                            </Row>
                          }
                        </Container>
                      </section>
                      
                      {(volChartUp && retChartUp) && 
                      <React.Fragment>
                        <Row className="pt-3">
                          <Col lg="6">
                              <div>
                                <h4 className="mb-3">Contribution To Volatility: Top 20</h4>
                              </div>
                            <Bar options={barOptions} data={volChart} height={400} width={300}/>
                          </Col>
                          <Col lg="6">
                              <div>
                                <h4 className="mb-3">90 Day Return: Top 20</h4>
                              </div>
                            <Bar options={barOptions} data={retChart} height={400} width={300}/>
                          </Col>
                        </Row>
                      </React.Fragment>}
                      {createdVixChart && 
                      <section className="py-4 bg-gray-100">
                        <div className="text-block">
                            <h6 className="mb-3">${props?.indexMetaDescriptions.title} Relative to the CBOE Volatility Index (VIX)</h6>
                            <p className="text-muted fw-light">
                              {`The VIX which represents a measure of market volatility and is based on the implied Volatility of &P 500 Index Options.
                              Measuring market moves relative to the VIX can help guage market sentiment in the short term, and is indicative of 
                              the uncertainty of market participants. While not a perfect relationship, the market tends to move inverse to the VIX. A rising VIX
                              is typically accompanied by falling equity prices.A higher VIX relates to more price volatility in the S&P 500, while a lower VIX can relate to less price volatility.
                              The VIX Index follows Large Institutional activity that use the S&P 500 options to hedge portfolios.A VIX reading above 25 indicates a volatile market, and even higher 
                              may be indicative of great uncertainty in market movements. It's important to note that the VIX is only one indicator of many and should
                              not be read as a determining factor of market direction.`} 
                              {" "}
                            </p>
                          </div>
                          <Container>
                        
                            <Row className="pt-3">
                              <Col lg="12">
                                <Line options={vixOptions} data={vixData} height={100} width={200}/>
                              </Col>
                            </Row>
                        </Container>
                      </section>}
                      {maChartUp && 
                      <section className="py-4">
                        <Container>
                            <Row className="pt-3">
                              <div className="text-block">
                                <h6 className="mb-3">Moving Averages</h6>
                                <p className="text-muted fw-light">
                                  A look at the {props?.indexMetaDescriptions.title} compared to peer Global Indices.
                                  While the Moving Average lags due its dependency on historical prices, It serves a useful purpose
                                  in indicating the trend, short or long term of buying or selling pressure. A shorter moving average 
                                  would indicate a shorter term trend, while longer term moving averages would include many more historical points
                                  and may be suited for a long term perspective of markets including support and resistance levels. 
                                  {" "}
                                </p>
                              </div>
                              <div className="text-center">
                                <label className="form-label me-2">Comparison Index</label>
                                <Select
                                  id="index"
                                  options={comparisonIndexes}
                                  value={loadedIndex}
                                  placeholder = {loadedIndexName}
                                  onChange = {onIndexChange}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  classNamePrefix="selectpicker"
                                />
                                <label className="form-label me-2">Frequency</label>
                                <Select
                                  id="frequency"
                                  options={maFrequencies}
                                  value={maFrequency}
                                  placeholder = {maFrequencyName}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  onChange = {(e) => onMaFrequencyChange(e)}
                                  classNamePrefix="selectpicker"
                                />
                              </div>
                              <Col lg="12">
                                <Line options={comparisonOptions} data={maChart} height={100} width={200}/>
                              </Col>
                              
                            </Row>
                        </Container>
                      </section>}
                      {returnChartUp && 
                      <section className="py-4">
                        <Container>
                            <Row className="pt-3">
                              <div className="text-block">
                                <h6 className="mb-3">Return Differential</h6>
                                <p className="text-muted fw-light">
                                  A look at the {props?.indexMetaDescriptions.title} compared to peer Global Indices.
                                  Looking at the spread between performance could help not only identify resistacnce and support levels,
                                  but additionally, this sort of analysis is widely used among Institutional Investors to make 
                                  allocation decisions. Here we present the 30 day, 60 day, 120 day and 1 year return differentials between 
                                  {props?.indexMetaDescriptions.title} and your selected index. 
                                  {" "}
                                </p>
                              </div>
                              <div className="text-center">
                                <label className="form-label me-2">Comparison Index</label>
                                <Select
                                  id="index"
                                  options={comparisonIndexes}
                                  value={returnLoadedIndex}
                                  placeholder = {retLoadedIndexName}
                                  onChange = {onReturnIndexChange}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  classNamePrefix="selectpicker"
                                />
                                <label className="form-label me-2">Frequency</label>
                                <Select
                                  id="frequency"
                                  options={returnFrequencies}
                                  value={returnFrequency}
                                  placeholder = {returnName}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  onChange = {(e) => onReturnFrequencyChange(e)}
                                  classNamePrefix="selectpicker"
                                />
                              </div>
                              <Col lg="12">
                                <Line options={indexLineOptions} data={returnChart} height={100} width={200}/>
                              </Col>
                              
                            </Row>
                        </Container>
                      </section>}
                      {betaChartUp && 
                      <section className="py-4">
                        <Container>
                            <Row className="pt-3">
                              <div className="text-block">
                                <h6 className="mb-3">Rolling Beta</h6>
                                <p className="text-muted fw-light">
                                  A look at the {props?.indexMetaDescriptions.title} compared to peer Global Indices based on rolling beta.
                                  Beta is a measure of the volatility of returns relative to some index. In the exhibits below, the rolling beta is,
                                  measured relative to the selected comparison Index. Thus in the context of Indexes, the beta here measures how much the movement 
                                  of stock returns in one index is related to the comparison. The beta relates systematic or (market risk) to in our case here the {props?.indexMetaDescriptions.title}.

                                  {" "}
                                </p>
                              </div>
                              <div className="text-center">
                                <label className="form-label me-2">Comparison Index</label>
                                <Select
                                  id="index"
                                  options={comparisonIndexes}
                                  value={betaLoadedIndex}
                                  placeholder = {betaLoadedIndexName}
                                  onChange = {onBetaIndexChange}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  classNamePrefix="selectpicker"
                                />
                                <label className="form-label me-2">Frequency</label>
                                <Select
                                  id="frequency"
                                  options={betaFrequencies}
                                  value={betaFrequency}
                                  placeholder = {betaName}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  onChange = {(e) => onBetaFrequencyChange(e)}
                                  classNamePrefix="selectpicker"
                                />
                              </div>
                              <Col lg="12">
                                <Line options={indexLineOptions} data={betaChart} height={100} width={200}/>
                              </Col>
                              
                            </Row>
                        </Container>
                      </section>}
                      {rRChartUp && 
                      <section className="py-4">
                        <Container>
                            <Row className="pt-3">
                              <div className="text-block">
                                <h6 className="mb-3">Rolling Return To Risk Spread</h6>
                                <p className="text-muted fw-light">
                                  A look at the {props?.indexMetaDescriptions.title} compared to peer Global Indices based on rolling return to risk, volatility is annualized.
                                  A comparison of the reward to risk ratio of the {props?.indexMetaDescriptions.title} relative to the selected comparison Index.
                                  A higher return to risk ratio usually indicates a better investment option relative to the comparison asset, in this case the comparison Index. 
                                  In the case of Index comparison, this metric more generally represents the over market, relative to the metric at the level of the stock.
                                  This is represented as the {props?.indexMetaDescriptions.title} less the comparison.
                                  {" "}
                                </p>
                              </div>
                              <div className="text-center">
                                <label className="form-label me-2">Comparison Index</label>
                                <Select
                                  id="index"
                                  options={comparisonIndexes}
                                  value={rRLoadedIndex}
                                  placeholder = {rRLoadedIndexName}
                                  onChange = {onSharpeIndexChange}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  classNamePrefix="selectpicker"
                                />
                                <label className="form-label me-2">Frequency</label>
                                <Select
                                  id="frequency"
                                  options={sharpeFrequencies}
                                  value={sharpeFrequency}
                                  placeholder = {sharpeName}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  onChange = {(e) => onSharpeFrequencyChange(e)}
                                  classNamePrefix="selectpicker"
                                />
                              </div>
                              <Col lg="12">
                                <Line options={indexLineOptions} data={rRChart} height={100} width={200}/>
                              </Col>
                              
                            </Row>
                        </Container>
                      </section>}
                      {volSChartUp && 
                      <section className="py-4">
                        <Container>
                            <Row className="pt-3">
                              <div className="text-block">
                                <h6 className="mb-3">Rolling Volatility Spread</h6>
                                <p className="text-muted fw-light">
                                  A look at the {props?.indexMetaDescriptions.title} compared to peer Global Indices based on rolling volatility (annualized).
                                  Volatility is a measure of the risk. In the exhibits below, the rolling volatility is,
                                  measured relative to the selected comparison Index. Given that we are comparing domestic and foreign markets, the rolling volatility 
                                  of stock returns in one index relative to the comparison, can provide an indication of {props?.indexMetaDescriptions.title} and its underlying holdings relative to 
                                  those of foreign markets or different asset classes in the case of smaller cap vs larger cap.

                                  {" "}
                                </p>
                              </div>
                              <div className="text-center">
                                <label className="form-label me-2">Comparison Index</label>
                                <Select
                                  id="index"
                                  options={comparisonIndexes}
                                  value={volLoadedIndex}
                                  placeholder = {volLoadedIndexName}
                                  onChange = {onVolIndexChange}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  classNamePrefix="selectpicker"
                                />
                                <label className="form-label me-2">Frequency</label>
                                <Select
                                  id="frequency"
                                  options={volFrequencies}
                                  value={volFrequency}
                                  placeholder = {volName}
                                  className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                                  onChange = {(e) => onVolFrequencyChange(e)}
                                  classNamePrefix="selectpicker"
                                />
                              </div>
                              <Col lg="12">
                                <Line options={indexLineOptions} data={volSChart} height={100} width={200}/>
                              </Col>
                              
                            </Row>
                            {valuations && 
                              <div className="text-block">
                                <h4 className="mb-2">Stock Valuations</h4>
                                <ValuationsTable valuations={valuations} />
                              </div>
                              }
                        </Container>
                      </section>}
                    </Col>
                    <Col lg="4">
                    <div
                      style={{ top: "100px" }}
                      className="p-4 shadow ms-lg-4 rounded sticky-top"
                    >
                      <p className="text-muted text-center">
                        <span className="text-primary h5">
                          Top 20 Performances (Live)
                        </span>{" "}
                      </p>
                      {allPerformers && topPerformers.map((stock, i) => {
                        return (<div key={i}>
                                <hr className="my-1" />
                                <h5 className="text-sm text-center">
                                {stock.symbol}: {stock.name} {Number(stock?.changesPercentage) > 0 ? 
                                <span className="text-sm text-center" style={{color:'green'}}>
                                {Number(stock?.changesPercentage).toFixed(2)}%
                                </span> : 
                                <span className="text-sm text-center" style={{color:'red'}}>
                                {Number(stock?.changesPercentage).toFixed(2)}%
                                </span>}
                                </h5>
                              </div>)
                      })}
                      <br/>
                      <p className="text-muted text-center">
                        <span className="text-primary h5">
                          Bottom 20 Performances (Live)
                        </span>{" "}
                      </p>
                      {allPerformers && bottomPerformers.map((stock, i) => {
                        return (<div key={i}>
                                <hr className="my-1" />
                                <h5 className="text-sm text-center">
                                {stock.symbol}: {stock.name} {Number(stock?.changesPercentage) > 0 ? 
                                <span className="text-sm text-center" style={{color:'green'}}>
                                {Number(stock?.changesPercentage).toFixed(2)}%
                                </span> : 
                                <span className="text-sm text-center" style={{color:'red'}}>
                                {Number(stock?.changesPercentage).toFixed(2)}%
                                </span>}
                                </h5>
                              </div>)
                      })}
                    </div>
                    </Col>
                  </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}


export default IndexDetail