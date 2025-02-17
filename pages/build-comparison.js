import React, {useEffect, useMemo, useState, useContext, useRef} from "react"
import Link from "next/link"
import Image from "@components/CustomImage"
import axios from 'axios'
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { Container, Row, Col, Button, Dropdown, Form, Overlay, Collapse, Pagination, InputGroup, ListGroup, Modal } from "react-bootstrap"
import UseWindowSize from "@hooks/UseWindowSize"
import Select from "react-select"
import { useChartResource } from "@hooks/useChartResources"
import Nouislider from "nouislider-react"
import data from "@data/chartsettings.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useNewCandleStick } from "@hooks/useNewCandleSticks";
import { useStockNames } from "@hooks/useStockNames"
import { useRouter } from "next/router"
import Icon from "@components/Icon"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  LineController,
  BarController,
  Legend,
} from 'chart.js';

import swal from 'sweetalert';
import { Line, Chart } from 'react-chartjs-2';
import { plotMacdChart } from "@utils/macdCharter";
import { plotAdlChart } from "@utils/adlCharter";
import { technicalCharter } from "@utils/plotTechnicalChart";


import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
);


export async function getStaticProps() {

  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: "Charting Area",
    },
  }
}


const ChartArea = (props) => {
    const size = UseWindowSize()
    const [range, setRange] = useState()
    const [userChartDate, setUserChartDate] = useState('')
    const {data:stockNames} = useStockNames();
    const [filterCollapse, setFilterCollapse] = useState(false)
    const [filterLineCollapse, setLineFilterCollapse] = useState(false)
    const [filterSMACollapse, setSMAFilterCollapse] = useState(false)
    const [smaChart, setSMAChart] = useState(false)
    const [smaChartOptions, setSMAChartOptions] = useState(null)
    const [smaCharter, setSMACharter] = useState(null)
    const [smaPeriodOne, setSmaPeriodOne] = useState(0)
    const [smaPeriodTwo, setSmaPeriodTwo] = useState(0)
    const [filterEMACollapse, setEMAFilterCollapse] = useState(false)
    const [emaChart, setEMAChart] = useState(false)
    const [emaChartOptions, setEMAChartOptions] = useState(null)
    const [emaCharter, setEMACharter] = useState(null)
    const [emaPeriodOne, setEmaPeriodOne] = useState(0)
    const [emaPeriodTwo, setEmaPeriodTwo] = useState(0)
    const [emaPeriodSignal, setEmaPeriodSignal] = useState(0)
    const [filterWMACollapse, setWMAFilterCollapse] = useState(false)
    const [wmaChart, setWMAChart] = useState(false)
    const [wmaChartOptions, setWMAChartOptions] = useState(null)
    const [wmaCharter, setWMACharter] = useState(null)
    const [wmaPeriodOne, setWmaPeriodOne] = useState(0)
    const [wmaPeriodTwo, setWmaPeriodTwo] = useState(0)
    const [filterDEMACollapse, setDEMAFilterCollapse] = useState(false)
    const [demaChart, setDEMAChart] = useState(false)
    const [demaChartOptions, setDEMAChartOptions] = useState(null)
    const [demaCharter, setDEMACharter] = useState(null)
    const [demaPeriodOne, setDemaPeriodOne] = useState(0)
    const [demaPeriodTwo, setDemaPeriodTwo] = useState(0)
    const [filterTEMACollapse, setTEMAFilterCollapse] = useState(false)
    const [temaChart, setTEMAChart] = useState(false)
    const [temaChartOptions, setTEMAChartOptions] = useState(null)
    const [temaCharter, setTEMACharter] = useState(null)
    const [temaPeriodOne, setTemaPeriodOne] = useState(0)
    const [temaPeriodTwo, setTemaPeriodTwo] = useState(0)
    const [filterWillCollapse, setWillFilterCollapse] = useState(false)
    const [willRChart, setWillRChart] = useState(false)
    const [willRChartOptions, setWillRChartOptions] = useState(null)
    const [willRCharter, setWillRCharter] = useState(null)
    const [willRPeriodOne, setWillRPeriodOne] = useState(0)
    const [willRPeriodTwo, setWillRPeriodTwo] = useState(0)
    const [filterRSICollapse, setRSIFilterCollapse] = useState(false)
    const [rsiChart, setRSIChart] = useState(false)
    const [rsiChartOptions, setRSIChartOptions] = useState(null)
    const [rsiCharter, setRSICharter] = useState(null)
    const [rsiPeriodOne, setRSIPeriodOne] = useState(0)
    const [rsiPeriodTwo, setRSIPeriodTwo] = useState(0)
    const [filterADXCollapse, setADXFilterCollapse] = useState(false)
    const [adxChart, setADXChart] = useState(false)
    const [adxChartOptions, setADXChartOptions] = useState(null)
    const [adxCharter, setADXCharter] = useState(null)
    const [adxPeriodOne, setADXPeriodOne] = useState(0)
    const [adxPeriodTwo, setADXPeriodTwo] = useState(0)
    const [filterSDCollapse, setSDFilterCollapse] = useState(false)
    const [sdPeriodOne, setSDPeriodOne] = useState(0)
    const [sdPeriodTwo, setSDPeriodTwo] = useState(0)
    const [sdChart, setSDChart] = useState(false)
    const [sdChartOptions, setSDChartOptions] = useState(null)
    const [sdCharter, setSDCharter] = useState(null)
    const [frequency, setFrequency] = useState('')
    const [filterMACDCollapse, setMACDFilterCollapse] = useState(false)
    const [macdChart, setMACDChart] = useState(false)
    const [macdChartOptions, setMACDChartOptions] = useState(null)
    const [macdCharter, setMACDCharter] = useState(null)
    const [filterADLCollapse, setADLFilterCollapse] = useState(false)
    const [adlChart, setADLChart] = useState(false)
    const [adlChartOptions, setADLChartOptions] = useState(null)
    const [adlCharter, setADLCharter] = useState(null)
    const [selectedEquities, setSelectedEquities] = useState('');
    const [searchFocus, setSearchFocus] = useState(false)
    const [activeSuggestion, setActiveSuggestion] = useState(0)
    const [filteredSuggestions, setFilteredSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [ticker, setTicker] = useState('')
    const [searchTicker, setSearchTicker] = useState('')
    const [dailyData, setDailyData] = useState(null)
    const onFocus = () => setSearchFocus(!searchFocus);
    const router = useRouter();
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showDateOption, setShowDateOption] = useState(false)
    const [smaModal, setSMAModal] = useState(false)
    const [emaModal, setEMAModal] = useState(false)
    const [demaModal, setDEMAModal] = useState(false)
    const [temaModal, setTEMAModal] = useState(false)
    const [willrModal, setWillRModal] = useState(false)
    const [rsiModal, setRSIModal] = useState(false)
    const [adxModal, setADXModal] = useState(false)
    const [macdModal, setMACDModal] = useState(false)
    const [sdModal, setSDModal] = useState(false)
    const [adlModal, setADLModal] = useState(false)
    const [wmaModal, setWMAModal] = useState(false)


    const onHelperModal = (e) => {
      let name = e.target.name;
      if (name === 'sma'){
        setSMAModal(!smaModal)
      } else if (name === 'ema'){
        setEMAModal(!emaModal)
      }
      else if (name === 'wma'){
        setWMAModal(!wmaModal)
      }
      else if (name === 'dema'){
        setDEMAModal(!demaModal)
      }
      else if (name === 'tema'){
        setTEMAModal(!temaModal)
      }
      else if (name === 'willR'){
        setWillRModal(!willrModal)
      }else if (name === 'adx'){
        setADXModal(!adxModal)
      }else if (name === 'rsi'){
        setRSIModal(!rsiModal)
      }else if (name === 'sd'){
        setSDModal(!sdModal)
      }else if (name === 'macd'){
        setMACDModal(!macdModal)
      }else if (name === 'adl'){
        setADLModal(!adlModal)
      }
        
    }
    const fromRef = useRef()

    useEffect(() => {
      if (range?.from) {
        const timer = setTimeout(() => setShowDatePicker(false), 200)
        return () => clearTimeout(timer)
      }
    }, [range])
    
    
    // const {chartCreated:candleOne, createChart:CandleOneCreated} = useCandleStick(dailyData?dailyData?.data?.candle:null)
    const {chartCreated:candleOne, createChart:CandleOneCreated} = useNewCandleStick(dailyData?.data?.candle, dailyData?.data?.volume, dailyData?.data?.average_volume)



    
    const returnQuery = (e) => {
        e.preventDefault();

        router.push(`/stock-data/${searchTicker}`)
    }


  
    const allStocks = stockNames?.stocks


    const onSearchChange = (e) => {
        // const { suggestions  = allStocks;
        const userInput = e.target.value;

        // Filter our suggestions that don't contain the user's input
        const suggestionFilter = allStocks?.filter(
        suggestion =>
            (suggestion['symbol'].toLowerCase().indexOf(userInput.toLowerCase()) > -1) || (suggestion['name'].toLowerCase().indexOf(userInput.toLowerCase()) > -1)
        );
        // setActiveSuggestion(0)
        setFilteredSuggestions(suggestionFilter)
        setShowSuggestions(true)
        setTicker(userInput)

    };


    const onKeySuggestDown = (e) => {
        // const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key
        if (e.keyCode === 13) {
        setActiveSuggestion(0)
        setShowSuggestions(false)
        setTicker(filteredSuggestions[activeSuggestion])
        }
        // User pressed the up arrow
        else if (e.keyCode === 38) {
        if (activeSuggestion === 0) {
            return;
        }

        setActiveSuggestion(activeSuggestion - 1);
        }
        // User pressed the down arrow
        else if (e.keyCode === 40) {
        if (activeSuggestion - 1 === filteredSuggestions.length) {
            return;
        }

        setActiveSuggestion(activeSuggestion + 1);
        }
    };

    const onSuggestionClick = (item) => {

        setActiveSuggestion(0)
        setShowSuggestions(false)
        setFilteredSuggestions([])
        setSearchTicker(item)
        setTicker(item)

    };


    const renderSuggestedList = () => {
        return(
        <ListGroup variant="flush" className="d-inline-block" style={{position:'relative'}}>
        {filteredSuggestions?.map((suggestion, i) => {
            return(
            <ListGroup.Item key={i} as="li" onClick={() => onSuggestionClick(suggestion['symbol'])}>
                    {suggestion['symbol']} - {suggestion['name']} - {suggestion['exchange']}
                </ListGroup.Item>
            )
        })}
        </ListGroup>
        )
    }
  
  useEffect(() => {
    if (frequency === '1day') {
      setShowDateOption(false)
    } else{
      setShowDateOption(true)
    }
  }, [frequency])


const formatDate = (date) => {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

const handleUserDate = (e) => {
  console.log(e)
 
  const date = formatDate(e);
  console.log(date)
  setUserChartDate(date);
};

const handleDaySelect = (date) => {
  setRange(date);
  if (date) {
    setUserChartDate(date);
    console.log(userChartDate)
  } else {
    setUserChartDate('');
  }
};

const submitPeriodicityHandler = async(e) => {
    e.preventDefault();
    console.log(selectedEquities)
    let asset = selectedEquities ? selectedEquities[0] : ''
    let getDailyData;
    if (frequency === '1day'){
      getDailyData = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getdailyindicatortechnical/${asset}`)
    } else {
      getDailyData = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getintraindicatortechnical/${asset}/${frequency}/${userChartDate}`)
    }
    
    let results = (await getDailyData).data;
    console.log(results)
    setDailyData(results)
}


const submitMainStockHandler = (e) => {
    e.preventDefault();
    setSelectedEquities(ticker)
}

const submitSMAHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (smaPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/sma/${smaPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (smaPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/sma/${smaPeriodTwo}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    
    const {chart:smaCharting, chartOptions:smaChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${smaPeriodOne}`, `${smaPeriodTwo}`, `Simple Moving Average`)
    setSMACharter(smaCharting)
    setSMAChartOptions(smaChartOptions)
    setSMAChart(true)
  }


const submitEMAHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (emaPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/ema/${emaPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (emaPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/ema/${emaPeriodTwo}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    const {chart:emaCharting, chartOptions:emaChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${emaPeriodOne}`, `${emaPeriodTwo}`, `Exponential Moving Average`)
    setEMACharter(emaCharting)
    setEMAChartOptions(emaChartOptions)
    setEMAChart(true)
  
  }

const submitWMAHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (wmaPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/wma/${wmaPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (wmaPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/wma/${wmaPeriodTwo}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    const {chart:wmaCharting, chartOptions:wmaChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${wmaPeriodOne}`, `${wmaPeriodTwo}`, `Weighted Moving Average`)
    setWMACharter(wmaCharting)
    setWMAChartOptions(wmaChartOptions)
    setWMAChart(true)
  
  }

const submitDEMAHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (demaPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/dema/${demaPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (demaPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/dema/${demaPeriodTwo}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    const {chart:demaCharting, chartOptions:demaChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${demaPeriodOne}`, `${demaPeriodTwo}`, `Double Exponential Moving Average`)
    setDEMACharter(demaCharting)
    setDEMAChartOptions(demaChartOptions)
    setDEMAChart(true)
  
  }


const submitTEMAHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (temaPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/tema/${temaPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (temaPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/tema/${temaPeriodTwo}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    const {chart:temaCharting, chartOptions:temaChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${temaPeriodOne}`, `${temaPeriodTwo}`, `Triple Exponential Moving Average`)
    setTEMACharter(temaCharting)
    setTEMAChartOptions(temaChartOptions)
    setTEMAChart(true)
  
  }


const submitWRHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (willRPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/williams/${willRPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (willRPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/williams/${willRPeriodOne}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    const {chart:willRCharting, chartOptions:willRChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${willRPeriodOne}`, `${willRPeriodOne}`, `Williams % R Indicator`)
    setWillRCharter(willRCharting)
    setWillRChartOptions(willRChartOptions)
    setWillRChart(true)
  
  }

const submitRSIHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (rsiPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/rsi/${rsiPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (rsiPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/rsi/${rsiPeriodTwo}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    const {chart:rsiCharting, chartOptions:rsiChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${rsiPeriodOne}`, `${rsiPeriodTwo}`, `Relative Strength Index`)
    setRSICharter(rsiCharting)
    setRSIChartOptions(rsiChartOptions)
    setRSIChart(true)

}

const submitADXHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (adxPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/adx/${adxPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (adxPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/adx/${adxPeriodOne}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    const {chart:adxCharting, chartOptions:adxChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${adxPeriodOne}`, `${adxPeriodOne}`, `Average Directional Index`)
    setADXCharter(adxCharting)
    setADXChartOptions(adxChartOptions)
    setADXChart(true)
  
  }

const submitSDHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getDailyDataPeriodOne;
    let getDailyDataPeriodTwo;
    let periodOneResults= null;
    let periodTwoResults=null;
    if (sdPeriodOne > 0){
      getDailyDataPeriodOne = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/standardDeviation/${sdPeriodOne}`)
      periodOneResults = (await getDailyDataPeriodOne).data;
      
    } 
    
    if (sdPeriodTwo > 0) {
      getDailyDataPeriodTwo = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettechnicals/${asset}/${frequency}/standardDeviation/${sdPeriodTwo}`)
      periodTwoResults = (await getDailyDataPeriodTwo).data;
    }
    let finalData = null;
    if(periodOneResults?.data && periodTwoResults?.data){
      finalData = {'periodOne':periodOneResults.data, 'periodTwo':periodTwoResults.data}
    } else if (periodOneResults?.data){
      finalData = {'periodOne':periodOneResults}
    }
    else if (periodTwoResults){
      finalData = {'periodTwo':periodTwoResults}
    }
    const {chart:sdCharting, chartOptions:sdChartOptions} = technicalCharter(finalData?.periodOne, finalData?.periodTwo, `${sdPeriodOne}`, `${sdPeriodTwo}`, `Standard Deviation`)
    setSDCharter(sdCharting)
    setSDChartOptions(sdChartOptions)
    setSDChart(true)
  
  }

const submitMACDHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === '' || frequency === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getMacdDataResults;
    let macdDataResults= null;
    if (emaPeriodOne > 0 && emaPeriodTwo > 0 && emaPeriodSignal > 0){
      getMacdDataResults = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getmacdindicatortechnical/${asset}/${frequency}/${emaPeriodOne}/${emaPeriodTwo}/${emaPeriodSignal}`)
      macdDataResults = (await getMacdDataResults).data; 
    } 
    
    let finalData = null;
    if(macdDataResults?.data){
      finalData = {'macd':macdDataResults?.data}
    }

    const {chart:macdCharting, chartOptions:macdChartOptions} = plotMacdChart(finalData?.macd, `${emaPeriodOne}`, `${emaPeriodTwo}`,`${emaPeriodSignal}`, `MACD`);
    setMACDCharter(macdCharting);
    setMACDChartOptions(macdChartOptions);
    setMACDChart(true);
  
  }

const submitADLHandler = async(e) => {
  e.preventDefault();
  let asset = selectedEquities ? selectedEquities[0] : ''
  if(asset === ''){
    swal({
      title: `You Must Select an asset and a frequency first before Looking at any Indicator`,
      icon: "warning",
  });
  return
  }
    let getAdlDataLine;
    let adDataResults= null;
    if (emaPeriodOne > 0){
      getAdlDataLine = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getadlindicatortechnical/${asset}`)
      adDataResults = (await getAdlDataLine).data;   
    } 
    
    let finalData = null;
    if(adDataResults?.data){
      finalData = {'adl':adDataResults.data}
    }
    const {chart:adlCharting, chartOptions:adlChartOptions} = plotAdlChart(finalData?.adl, `Accumulation Distribution Line`)
    setADLCharter(adlCharting)
    setADLChartOptions(adlChartOptions)
    setADLChart(true)
  }


  
    return (
        
      <React.Fragment>
        <section className="d-flex align-items-center dark-overlay">
          <Image
            src={`/images/homepageImages/chart.jpg`}
            layout="fill"
            className="bg-image"
            alt="Hero image"
            loading="eager"
            priority={true}
          />
          <Container className="py-6 py-lg-7 text-white overlay-content text-center">
            <Row>
              <Col xl="10" className="mx-auto">
                <h1 className="display-3 fw-bold text-shadow">
                  {`Fintank Charting Platform`}
                </h1>
                <p className="text-lg text-shadow mt-3">{`Fintank's Charting Platform for Technical Indicators and Overlays`}</p>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="py-1 bg-gray-100">
          <Container>
            <div className="text-center pb-lg-4">
              <p className="subtitle text-secondary">
                {`Chart Equities With Ease Using our Technical Overlays`}
              </p>
              <h2 className="mb-3">{`The Fintank's Charting Platform`}</h2>
            </div>
            <Row>
            <Col
                lg="4"
                className="mb-1 mb-lg-0 text-center"
              >
                <div className="px-0 px-lg-3">
                  <div className="icon-rounded bg-primary-light mb-3">
                    <Icon
                      icon='earth-globe-1'
                      className="text-primary w-2rem h-2rem"
                    />
                  </div>
                  <h3 className="h5">Select Equities</h3>
                  <p className="text-muted">Choose Equities from the search bar in the selection secion below and hit search.</p>
                </div>
              </Col>
              <Col
                lg="4"
                className="mb-1 mb-lg-0 text-center"
              >
                <div className="px-0 px-lg-3">
                  <div className="icon-rounded bg-primary-light mb-3">
                    <Icon
                      icon='time-1'
                      className="text-primary w-2rem h-2rem"
                    />
                  </div>
                  <h3 className="h5">Select A Frequency to Chart</h3>
                  <p className="text-muted">Daily frequency shows data for the past 120 business days, If an intraday period is selected, you must select a from date and data shown to most recent data point. This frequency is utilized in the technical indicators.</p>
                </div>
              </Col>
              <Col
                lg="4"
                className="mb-1 mb-lg-0 text-center"
              >
                <div className="px-0 px-lg-3">
                  <div className="icon-rounded bg-primary-light mb-3">
                    <Icon
                      icon='compass-1'
                      className="text-primary w-2rem h-2rem"
                    />
                  </div>
                  <h3 className="h5">Select An Indicator to plot</h3>
                  <p className="text-muted">Indicators include SMA, EMA, WMA, DEMA, TEMA, ADX, A/D Line, MACD and RSI. This is based on the frequency selected.</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <Container fluid className="py-5 px-lg-5">
          <Row>
            <Col lg="3" className="pt-3">
                <div className="mb-4">
                    <Collapse in={filterCollapse}>
                        <div>
                        <div className="filter-block">
                      <h6 className="mb-3">Line and Candle Stick (Max 2 Assets)</h6>
                      <div className="mb-4">
                        <Form onSubmit={submitMainStockHandler}>
                            <Form.Label htmlFor="stock">
                            Add Stock
                            </Form.Label>
                            <InputGroup>
                            <Form.Control
                                id={"equity_search"}
                                placeholder="Search Ticker"
                                aria-label="Search"
                                size="sm"
                                type="text"
                                autoComplete="off"
                                required
                                value={ticker} 
                                onFocus={onFocus}
                                onChange={(e) => onSearchChange(e)}
                                onBlur={() => setTimeout(() => onFocus(), 333)} 
                                />
                                
                            <Button type="submit">
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                            </InputGroup>
                            </Form>
                            {(showSuggestions && filteredSuggestions?.length < 40) ?
                                <div onKeyDown = {(e) => onKeySuggestDown(e)}s>
                                    {renderSuggestedList()}
                                </div>:
                                ""
                                }
                            <div className="mt-4">
                          <Form onSubmit={submitPeriodicityHandler}>
                            <Form.Label htmlFor="stock">
                            Select Periodicity
                            </Form.Label>
                            
                              <Row>
                                <Col lg="6" className="pt-3">
                                  <Select
                                      name="guests"
                                      options={data.frequency && data.frequency}
                                      value={frequency}
                                      placeholder = {frequency}
                                      onChange = {(e) => setFrequency(e.value)}
                                      isSearchable
                                      className="form-control dropdown bootstrap-select"
                                      classNamePrefix="selectpicker"
                                  />
                                  </Col>
                                {showDateOption && 
                                <Col lg="4" className="pt-3">
                                      <div>
                                        <div className="d-flex align-items-center">
                                          <Form.Control
                                            type="text"
                                            value={userChartDate}
                                            onChange={handleDaySelect}
                                            placeholder="From"
                                            onClick={() => setShowDatePicker(true)}
                                            ref={fromRef}
                                          />
                                        </div>
                                        <Overlay
                                          target={fromRef.current}
                                          rootClose
                                          placement="bottom-end"
                                          show={showDatePicker}
                                          onHide={() => setShowDatePicker(!showDatePicker)}
                                        >
                                          {({ arrowProps, show: _show, popper, ...props }) => (
                                            <div
                                              {...props}
                                              style={{ ...props.style, zIndex: 1030 }}
                                              className={`position-absolute bg-white shadow rounded p-2 z-index-1030`}
                                            >
                                              <DayPicker
                                                mode="single"
                                                selected={range}
                                                onSelect={handleUserDate}
                                                numberOfMonths={size.width > 768 ? 2 : 1}
                                                style={{
                                                  "--rdp-accent-color": "#4e66f8",
                                                  zIndex: 1030,
                                                  position: "relative",
                                                }}
                                              />
                                            </div>
                                          )}
                                        </Overlay>
                                      </div>
                                </Col>}
                                <Col lg="2" className="pt-3">
                                  <Button type="submit">
                                    <FontAwesomeIcon icon={faSearch} />
                                  </Button>
                                </Col>
                              </Row>
                              </Form>
                          </div>
                      </div>
                      {selectedEquities && (
                        <div className="mb-0">
                          <Form.Label className="form-label">
                            Assets Selected
                          </Form.Label>
                          <ul className="list-inline mt-xl-1 mb-0">
                              <li className="list-inline-item">
                                <Form.Text>
                                    {selectedEquities}
                                </Form.Text>
                              </li>
                          </ul>
                        </div>
                      )}
                    </div>
                        </div>
                    </Collapse>
                  <Button
                    aria-expanded={filterCollapse}
                    onClick={() => setFilterCollapse(!filterCollapse)}
                    variant="link"
                    className="btn-collapse ps-0 text-primary"
                  >
                    {filterCollapse ? "Minimize" : "Select Equities To Chart"}
                  </Button>
                  <Collapse in={filterLineCollapse}>
                        <div>
                        <div className="filter-block">
                      <h4 className="mb-3">Add Indicators</h4>
                      <p>Click For Descriptions and Usage</p>
                      <div className="mb-4">
                      <Button
                      aria-expanded={filterSMACollapse}
                      onClick={() => setSMAFilterCollapse(!filterSMACollapse)}
                      variant="link"
                      className="btn-collapse ps-0 text-primary"
                    >
                      {filterSMACollapse ? "Close SMA Indicator" : "Add SMA Indicator"}
                    </Button>
                      <Button className='mb-3' name='sma' onClick={(e) => onHelperModal(e)}>Simple Moving Average</Button>
                        <Modal name='sma' show={smaModal} onHide={(e) => setSMAModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Simple Moving Average
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Simple Moving Average (SMA)</strong> is a widely used technical indicator in the field of technical analysis. It is a straightforward and easy-to-understand method for analyzing and visualizing the price trends of financial instruments such as stocks, currencies, commodities, and more. 
                                The SMA is primarily used to smooth out price data over a specified time period, making it easier to identify trends and potential turning points in the market.
                                Key characteristics of the Simple Moving Average (SMA) include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation: The SMA is calculated by summing up a set of closing prices over a specified time period (e.g., days, weeks, or months) and then dividing that sum by the number of periods in the calculation. For example, a 10-day SMA is calculated by adding the closing prices of the last 10 days and dividing by 10.</li>
                                  <li>Smoothing: The SMA is used to smooth out short-term price fluctuations and noise in the market, providing a clearer view of the underlying trend. This smoothing effect makes it easier to identify whether the price is in an uptrend, downtrend, or a sideways range.</li>
                                  <li>Trend Identification: Traders and analysts use SMAs to identify the direction of the prevailing trend. A rising SMA indicates an uptrend, while a declining SMA suggests a downtrend. When the price crosses above or below the SMA, it can signal potential trend reversals.</li>
                                  <li>Support and Resistance: SMAs can act as dynamic support and resistance levels. For example, in an uptrend, the SMA can serve as a support level, while in a downtrend, it can act as resistance. Traders often use these levels to make trading decisions.</li>
                                  <li>Timeframe Flexibility: SMAs can be calculated over various timeframes, allowing traders and analysts to tailor their analysis to their specific trading or investment strategy. Common SMA periods include 50-day, 100-day, and 200-day SMAs for longer-term analysis, and 10-day or 20-day SMAs for shorter-term analysis.</li>
                                  <li>Crossovers: One of the popular trading strategies involving SMAs is the moving average crossover. This occurs when a shorter-term SMA crosses above or below a longer-term SMA, signaling potential buy or sell opportunities.</li>
                                </ul>
                                The Simple Moving Average is a foundational tool in technical analysis, and it provides valuable insights into market trends and potential trade opportunities. It is often used in conjunction with other technical indicators and chart patterns to make more informed trading and investment decisions.
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='sma' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterSMACollapse}>
                        <div>
                        <div className="filter-block">
                        <Form onSubmit={submitSMAHandler}>
                            <Form.Label htmlFor="stock">
                            Select Period 1
                            </Form.Label>
                            <div className="mb-4">
                            <Row>
                                <Col lg="4">
                                  <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='smaPOne'
                                      placeholder={`Set SMA Period 1`}
                                      value={smaPeriodOne}
                                      onChange={(e) => setSmaPeriodOne(e.target.value)}
                                    />
                                  </div>
                                </Col>
                                </Row>
                            </div>
                            <Form.Label htmlFor="stock">
                            Select Period 2
                            </Form.Label>
                            <div className="mb-4">
                            <Row>
                                <Col lg="4">
                                  <div className="d-flex align-items-center">
                                    <Form.Control
                                        type="number"
                                        name='smaTwo'
                                        placeholder={`Set SMA Period 1`}
                                        value={smaPeriodTwo}
                                        onChange={(e) => setSmaPeriodTwo(e.target.value)}
                                      />
                                  </div>
                                </Col>
                                </Row>
                                <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add SMA
                                  </Button>
                                </Col>
                              </Row>
                            </div>  
                        </Form>
                        </div>
                        </div>
                    </Collapse>
                    <Button
                      aria-expanded={filterEMACollapse}
                      onClick={() => setEMAFilterCollapse(!filterEMACollapse)}
                      variant="link"
                      className="btn-collapse ps-0 text-primary"
                    >
                      {filterEMACollapse ? "Close EMA Indicator" : "Add EMA Indicator"}
                    </Button>
                    <Button className='mb-3' name='ema' onClick={(e) => onHelperModal(e)}>Exponential Moving Average</Button>
                        <Modal name='ema' show={emaModal} onHide={(e) => setEMAModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Exponential Moving Average
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Exponential Moving Average (EMA)</strong> is a key technical indicator widely used in technical analysis to assess and interpret price trends in financial markets. The EMA is a more responsive and weighted moving average compared to the Simple Moving Average (SMA). 
                                It places a greater emphasis on recent prices, making it especially effective for traders and analysts seeking to identify short to medium-term trends and reversals.
                                Key characteristics of the Exponential Moving Average (EMA) include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{` The EMA is calculated by giving greater weight to recent prices. The most recent price is assigned the highest weight, and the weight decreases exponentially as you move further back in time. The formula for calculating the EMA incorporates a smoothing factor, making it more responsive to recent price changes. The EMA at time 't' is calculated using the formula EMA(t) = (Price(t) * Smoothing Factor) + (EMA(t-1) * (1 - Smoothing Factor))`}</li>
                                  <li>Responsiveness: Due to its weighted calculation, the EMA reacts quickly to price changes. It is particularly useful for traders interested in capturing short-term price movements and identifying potential entry and exit points.</li>
                                  <li>Trend Confirmation: EMA crossovers can be used to confirm and trade in the direction of the prevailing trend. A shorter-term EMA crossing above a longer-term EMA is considered a bullish signal, while the reverse is considered bearish. These crossovers are used by traders to identify entry and exit points.</li>
                                  <li>Dynamic Support and Resistance: EMA levels often act as dynamic support or resistance levels. Traders look for price bounces or breaks at EMA levels, which can offer potential trading opportunities.</li>
                                  <li>Customizable Timeframes: Similar to SMAs, EMAs can be calculated for different timeframes, allowing traders to adapt their analysis to various trading strategies and market conditions.</li>
                                  <li>Risk Management: The EMA is valuable for risk management. Traders use EMA levels to set stop-loss orders or identify areas where they might want to take profits.</li>
                                  <li>Interpolation: EMAs are calculated by continuously updating the average with each new price data point, providing a continuously changing line on the price chart.</li>
                                </ul>
                                {`The Exponential Moving Average is a versatile tool that suits traders and analysts interested in capturing shorter-term trends and taking advantage of quick market movements. It's an important component of technical analysis and is often used alongside other technical indicators to make informed trading decisions.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='ema' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                        <Collapse in={filterEMACollapse}>
                        <div>
                        <div className="filter-block">
                        <Form onSubmit={submitEMAHandler}>
                            <Form.Label htmlFor="stock">
                            Select Period 1
                            </Form.Label>
                            <div className="mb-4">
                            <Row>
                                <Col lg="4">
                                  <div className="d-flex align-items-center">
                                    <Form.Control
                                      type="number"
                                      name='emaPOne'
                                      placeholder={`Set EMA Period 1`}
                                      value={emaPeriodOne}
                                      onChange={(e) => setEmaPeriodOne(e.target.value)}
                                    />
                                  </div>
                                </Col>
                                </Row>
                            </div>
                            <Form.Label htmlFor="stock">
                            Select Period 2
                            </Form.Label>
                            <div className="mb-4">
                            <Row>
                                <Col lg="4">
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                      type="number"
                                      name='emaTwo'
                                      placeholder={`Set EMA Period 2`}
                                      value={emaPeriodTwo}
                                      onChange={(e) => setEmaPeriodTwo(e.target.value)}
                                    />
                                  </div>
                                </Col>
                                </Row>
                                <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add EMA
                                  </Button>
                                </Col>
                              </Row>
                            </div> 
                        </Form>
                        </div>
                        </div>
                    </Collapse>
                    <Button
                      aria-expanded={filterWMACollapse}
                      onClick={() => setWMAFilterCollapse(!filterWMACollapse)}
                      variant="link"
                      className="btn-collapse ps-0 text-primary"
                      >
                        
                        {filterWMACollapse ? "Close WMA Indicator" : "Add WMA Indicator"}
                      </Button>
                      <Button className='mb-3' name='wma' onClick={(e) => onHelperModal(e)}>Weighted Moving Average</Button>
                        <Modal name='wma' show={wmaModal} onHide={(e) => setWMAModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Weighted Moving Average
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Weighted Moving Average (WMA)</strong> is a type of moving average that assigns different weights to different prices within the selected time period. Unlike the Simple Moving Average (SMA), where all prices have equal weight, WMA allows traders and analysts to give more significance to certain prices, often focusing on recent prices. 
                                This makes WMA more responsive to recent price movements and trends.
                                Key characteristics of the Weighted Moving Average (WMA) include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{`In the Weighted Moving Average, recent prices are assigned higher weights, while older prices have lower weights. The formula to calculate WMA for a given time period involves multiplying each price by a specific weight, summing these values, and then dividing by the sum of the weights. The formula for WMA at time 't' in a period of 'n' is calculated as follows: WMA(t)=(w1∗Price(t−1)+w2∗Price(t−2)+...+wn∗Price(t−n))/(w1+w2+...+wn)`}</li>
                                  <li>Customizable Weights: Traders and analysts can customize the weights based on their analysis. For example, they might assign higher weights to recent prices to give more importance to the most recent market behavior.</li>
                                  <li>Responsiveness: WMA is more responsive to recent price changes compared to SMA since it emphasizes recent prices. This responsiveness makes it valuable for short to medium-term trend analysis and for identifying potential entry and exit points in the market.</li>
                                  <li>Trend Identification: Similar to other moving averages, WMA helps in identifying trends. Rising WMA values indicate an uptrend, while falling values suggest a downtrend. Traders often look for crossovers with other WMAs or price to confirm trend changes.</li>
                                  <li>Forecasting: WMA can be used in time series forecasting to predict future price movements based on historical data. Weighting recent data more heavily allows the model to adapt quickly to changing market conditions.</li>
                                  <li>Volatility Adjustment: Traders can adjust the weights based on market volatility. During high volatility periods, assigning higher weights to recent prices can help capture short-term price fluctuations more accurately.</li>
                                </ul>
                                {`The Weighted Moving Average is a flexible tool that provides traders and analysts with the ability to focus on specific price points according to their trading strategies and market analysis. By customizing the weights, traders can adapt WMA to various market conditions and timeframes, making it a valuable tool in technical analysis.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='wma' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterWMACollapse}>
                      <div>
                      <div className="filter-block">
                      <Form onSubmit={submitWMAHandler}>
                      <Form.Label htmlFor="stock">
                          Select Period 1
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='wmaPOne'
                                      placeholder={`Set WMA Period 1`}
                                      value={wmaPeriodOne}
                                      onChange={(e) => setWmaPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div>
                          <Form.Label htmlFor="stock">
                          Select Period 2
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='wmaPTwo'
                                      placeholder={`Set WMA Period 2`}
                                      value={wmaPeriodTwo}
                                      onChange={(e) => setWmaPeriodTwo(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                              <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add WMA
                                  </Button>
                                </Col>
                              </Row>
                          </div>  
                      </Form>
                      </div>
                      </div>
                      </Collapse>
                      <Button
                      aria-expanded={filterDEMACollapse}
                      onClick={() => setDEMAFilterCollapse(!filterDEMACollapse)}
                      variant="link"
                      className="btn-collapse ps-0 text-primary"
                    >
                      {filterDEMACollapse ? "Close DEMA Indicator" : "Add DEMA Indicator"}
                    </Button>
                    <Button className='mb-3' name='dema' onClick={(e) => onHelperModal(e)}>Double Exponential Moving Average</Button>
                        <Modal name='dema' show={demaModal} onHide={(e) => setDEMAModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Double Exponential Moving Average
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Double Exponential Moving Average (DEMA) </strong> is a sophisticated technical indicator used in technical analysis to analyze and predict price trends in financial markets. DEMA is designed to reduce lag and provide more accurate signals compared to traditional moving averages, such as the Simple Moving Average (SMA) or Exponential Moving Average (EMA).
                                Key characteristics of the Double Exponential Moving Average (DEMA) include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{` DEMA is calculated using a two-step process. First, it computes a regular EMA of the price data. Next, it calculates another EMA of the previously computed EMA. The final DEMA value is obtained by doubling the first EMA and subtracting the second EMA. The formula for DEMA can be represented as follows: DEMA(t)=2∗EMA(t,n)−EMA(EMA(t,n),n). `}</li>
                                  <li>Lag Reduction: DEMA is specifically designed to reduce lag in comparison to other moving averages. By incorporating two EMAs, it captures price changes more quickly, making it a valuable tool for traders seeking timely and accurate trend signals.</li>
                                  <li>{`Trend Identification: DEMA helps traders and analysts identify trends in the market. When the DEMA line is rising, it suggests an uptrend, and when it's falling, it indicates a downtrend. Traders often use DEMA crossovers with price or other moving averages to make trading decisions.`}</li>
                                  <li>{`Precision: DEMA is known for its precision in identifying turning points and trends. It's especially useful in volatile markets where quick responses to price changes are essential.`}</li>
                                  <li>Signal Generation: Traders use DEMA to generate buy and sell signals. Crossovers between the DEMA line and the price chart can serve as entry or exit points in trading strategies.</li>
                                  <li>Adaptability: DEMA can be customized to different timeframes and market conditions, making it a versatile tool for both short-term and long-term analysis.</li>
                                  <li>Smoothing: DEMA provides smoother and more accurate results than traditional moving averages. It eliminates some of the noise often seen in price data, aiding in clearer trend analysis.</li>
                                </ul>
                                {`The Double Exponential Moving Average is a powerful tool for traders and analysts looking for a moving average that reacts quickly to market changes and generates precise signals for trend identification and trading decisions. It is particularly effective in volatile markets and for those who prioritize timely and accurate analysis.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='dema' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterDEMACollapse}>
                      <div>
                      <div className="filter-block">
                      <Form onSubmit={submitDEMAHandler}>
                      <Form.Label htmlFor="stock">
                          Select Period 1
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='demaPOne'
                                      placeholder={`Set DEMA Period 1`}
                                      value={demaPeriodOne}
                                      onChange={(e) => setDemaPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div>
                          <Form.Label htmlFor="stock">
                          Select Period 2
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                <Form.Control
                                      type="number"
                                      name='demaPTwo'
                                      placeholder={`Set DEMA Period 2`}
                                      value={demaPeriodTwo}
                                      onChange={(e) => setDemaPeriodTwo(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                              <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add DEMA
                                  </Button>
                                </Col>
                              </Row>
                          </div>
                      </Form>
                      </div>
                      </div>
                      </Collapse>
                      <Button
                      aria-expanded={filterTEMACollapse}
                      onClick={() => setTEMAFilterCollapse(!filterTEMACollapse)}
                      variant="link"
                      className="btn-collapse ps-0 text-primary"
                      >
                      {filterTEMACollapse ? "Close TEMA Indicator" : "Add TEMA Indicator"}
                    </Button>
                    <Button className='mb-3' name='tema' onClick={(e) => onHelperModal(e)}>Triple Exponential Moving Average</Button>
                        <Modal name='tema' show={temaModal} onHide={(e) => setTEMAModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Triple Exponential Moving Average
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Triple Exponential Moving Average (TEMA) </strong> is an advanced technical indicator used in technical analysis to provide a smoother, more responsive representation of price data. TEMA goes a step further than the Double Exponential Moving Average (DEMA) by incorporating a third exponential smoothing process. This makes it even more responsive to price changes and trends.
                                Key characteristics of the Triple Exponential Moving Average (TEMA) include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{`TEMA is calculated through a three-step process. First, it calculates an initial EMA of the price data. Next, it calculates a second EMA of the first EMA. Lastly, it calculates a third EMA of the second EMA. The final TEMA value is derived by triple-weighting the difference between the first EMA and three times the difference between the third and second EMAs. The formula for TEMA can be represented as follows: TEMA(t)=3∗EMA(t,n)−3∗EMA(EMA(t,n,n))+EMA(EMA(EMA(t,n),n),n)`}</li>
                                  <li>Reduced Lag: TEMA is designed to significantly reduce lag in comparison to other moving averages. Its three-step smoothing process makes it highly responsive to recent price data, enabling traders to identify trends and reversals more quickly.</li>
                                  <li>{`Trend Identification: TEMA helps traders and analysts identify trends in the market. A rising TEMA suggests an uptrend, while a falling TEMA indicates a downtrend. The precision of TEMA makes it an excellent tool for trend analysis.`}</li>
                                  <li>{`Signal Generation: Traders use TEMA to generate buy and sell signals. Crossovers between the TEMA line and the price chart or other moving averages can serve as entry or exit points in trading strategies.`}</li>
                                  <li>Adaptability: TEMA can be customized for different timeframes and market conditions, making it versatile for both short-term and long-term analysis.</li>
                                  <li>Smoothing: TEMA provides an even smoother representation of price data compared to other moving averages. It filters out noise and variations in the price series, aiding in clearer trend analysis.</li>
                                </ul>
                                {`The Triple Exponential Moving Average is a powerful tool for traders and analysts looking for an extremely responsive moving average that excels in reducing lag, providing accurate trend signals, and adapting to various market conditions. It is particularly valuable for traders who require precise and timely analysis in dynamic markets.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='tema' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterTEMACollapse}>
                      <div>
                      <div className="filter-block">
                      <Form onSubmit={submitTEMAHandler}>
                      <Form.Label htmlFor="stock">
                          Select Period 1
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='temaPOne'
                                      placeholder={`Set TEMA Period 1`}
                                      value={temaPeriodOne}
                                      onChange={(e) => setTemaPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div>
                          <Form.Label htmlFor="stock">
                          Select Period 2
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                <Form.Control
                                      type="number"
                                      name='temaPTwo'
                                      placeholder={`Set TEMA Period 2`}
                                      value={temaPeriodTwo}
                                      onChange={(e) => setTemaPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                              <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add TEMA
                                  </Button>
                                </Col>
                              </Row>
                          </div>
                      </Form>
                      </div>
                      </div>
                      </Collapse>
                      <Button
                      aria-expanded={filterWillCollapse}
                      onClick={() => setWillFilterCollapse(!filterWillCollapse)}
                      variant="link"
                      className="btn-collapse ps-0 text-primary"
                    >
                        {filterWillCollapse ? "Close Will %R Indicator" : "Add Will %R Indicator"}
                      </Button>
                      <Button className='mb-3' name='willR' onClick={(e) => onHelperModal(e)}>Williams Percent R</Button>
                        <Modal name='willR' show={willrModal} onHide={(e) => setWillRModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Williams %R
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Williams %R indicator </strong> often referred to as Williams Percent Range or %R, is a popular momentum oscillator used in technical analysis to assess overbought and oversold conditions of a financial asset. Developed by Larry Williams, this oscillator helps traders and analysts identify potential reversal points and the strength of a current trend.
                                Key characteristics of the Williams %R indicator include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{`The Williams %R is calculated based on the highest high and the lowest low prices over a specified look-back period, typically 14 periods. The formula for calculating %R is as follows: %R=(HighestHigh−Close)/(HighestHigh−LowestLow)×−100. %R values range from -100 to 0, with readings above -20 indicating overbought conditions and readings below -80 indicating oversold conditions.`}</li>
                                  <li>Overbought and Oversold Conditions: Williams %R is primarily used to identify overbought and oversold conditions. When the %R value exceeds -20, it suggests that the asset is overbought and may be due for a price correction. Conversely, when the %R value falls below -80, it indicates an oversold condition, potentially signaling a buying opportunity.</li>
                                  <li>{`Divergence: Traders often look for divergences between the %R indicator and the price chart. For example, if the price is making higher highs while %R is making lower highs, it may suggest a potential bearish divergence, indicating a weakening uptrend.`}</li>
                                  <li>{`Trend Confirmation: %R can be used to confirm the strength of a current trend. If the price is in an uptrend and %R remains consistently above -50, it suggests a strong bullish trend. Conversely, if the price is in a downtrend and %R stays consistently below -50, it indicates a strong bearish trend.`}</li>
                                  <li>{`Signal Generation: Traders use overbought and oversold readings in combination with other technical indicators or chart patterns to generate buy or sell signals. For example, a trader might consider selling when the %R is above -20 and buying when it's below -80.`}</li>
                                  <li>Short-Term Analysis: Williams %R is particularly suited for short-term analysis due to its sensitivity to recent price movements. It provides insights into short-term price reversals and corrections.</li>
                                </ul>
                                {`The Williams %R indicator is a valuable tool for traders and analysts looking to gauge the strength of trends and identify potential reversal points. By providing clear overbought and oversold readings, it helps traders make informed decisions in the dynamic world of financial markets.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='willR' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterWillCollapse}>
                      <div>
                      <div className="filter-block">
                      <Form onSubmit={submitWRHandler}>
                      <Form.Label htmlFor="stock">
                          Select Period 1
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                <Form.Control
                                      type="number"
                                      name='willPOne'
                                      placeholder={`Set WillR Period 1`}
                                      value={willRPeriodOne}
                                      onChange={(e) => setWillRPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div>
                          <Form.Label htmlFor="stock">
                          Select Period 2
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                <Form.Control
                                      type="number"
                                      name='willPTwo'
                                      placeholder={`Set WillR Period 2`}
                                      value={willRPeriodTwo}
                                      onChange={(e) => setWillRPeriodTwo(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                              <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add Will % R
                                  </Button>
                                </Col>
                              </Row>
                          </div>
                      </Form>
                      </div>
                      </div>
                      </Collapse>
                      <Button
                        aria-expanded={filterRSICollapse}
                        onClick={() => setRSIFilterCollapse(!filterRSICollapse)}
                        variant="link"
                        className="btn-collapse ps-0 text-primary"
                      >
                        {filterRSICollapse ? "Close RSI Indicator" : "Add RSI Indicator"}
                      </Button>
                      <Button className='mb-3' name='rsi' onClick={(e) => onHelperModal(e)}>Relative Strength Index</Button>
                        <Modal name='rsi' show={rsiModal} onHide={(e) => setRSIModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Relative Strength Index
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The  Relative Strength Index (RSI) </strong> is a widely used momentum oscillator in technical analysis that measures the speed and change of price movements in a financial asset. Developed by J. Welles Wilder, the RSI is a valuable tool for traders and analysts seeking to identify overbought and oversold conditions, as well as the strength and potential reversals of price trends.
                                Key characteristics of the Relative Strength Index (RSI) include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{`The RSI is calculated based on the average of the upward price changes (gains) and the average of the downward price changes (losses) over a specified look-back period, typically 14 periods. The formula for RSI can be represented as: RSI=100−100/(1+RS) Where RS (Relative Strength) is the ratio of average gains to average losses over the defined period.`}</li>
                                  <li>Overbought and Oversold Conditions: RSI is used to identify overbought and oversold conditions. Typically, an RSI reading above 70 indicates that the asset may be overbought and could potentially experience a price correction. Conversely, an RSI reading below 30 suggests that the asset may be oversold, signaling a potential buying opportunity.</li>
                                  <li>{`Divergence: Traders often look for divergences between the RSI indicator and the price chart. For example, if the price is making higher highs while RSI is making lower highs, it may suggest a bearish divergence, potentially indicating a weakening uptrend.`}</li>
                                  <li>{`Trend Strength: RSI provides insights into the strength of a current trend. When the RSI remains consistently above 70, it indicates a strong bullish trend, while an RSI consistently below 30 suggests a strong bearish trend.`}</li>
                                  <li>{`Signal Generation: Traders use RSI readings, overbought/oversold conditions, and potential divergence signals to generate buy or sell signals. For example, buying when RSI crosses above 30 and selling when it crosses below 70 are common strategies.`}</li>
                                  <li>Short to Medium-Term Analysis: RSI is particularly effective for short to medium-term analysis due to its sensitivity to recent price movements. It helps traders assess the potential for price reversals and corrections in the near future.</li>
                                </ul>
                                {`The Relative Strength Index is a valuable and versatile tool for traders and analysts seeking to gauge the strength of trends and identify potential reversal points. By offering clear overbought and oversold readings, RSI aids in making well-informed trading and investment decisions in financial markets.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='rsi' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterRSICollapse}>
                      <div>
                      <div className="filter-block">
                      <Form onSubmit={submitRSIHandler}>
                      <Form.Label htmlFor="stock">
                          Select Period 1
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='rsiPOne'
                                      placeholder={`Set RSI Period 1`}
                                      value={rsiPeriodOne}
                                      onChange={(e) => setRSIPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div>
                          <Form.Label htmlFor="stock">
                          Select Period 2
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                <Form.Control
                                      type="number"
                                      name='rsiPTwo'
                                      placeholder={`Set RSI Period 2`}
                                      value={rsiPeriodTwo}
                                      onChange={(e) => setRSIPeriodTwo(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                              <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add RSI
                                  </Button>
                                </Col>
                              </Row>
                          </div>
                      </Form>
                      </div>
                      </div>
                      </Collapse>
                      <Button
                      aria-expanded={filterADXCollapse}
                      onClick={() => setADXFilterCollapse(!filterADXCollapse)}
                      variant="link"
                      className="btn-collapse ps-0 text-primary"
                    > 
                      {filterADXCollapse ? "Close ADX Indicator" : "Add ADX Indicator"}
                    </Button>
                    <Button className='mb-3' name='adx' onClick={(e) => onHelperModal(e)}>Average Directional Index</Button>
                        <Modal name='adx' show={adxModal} onHide={(e) => setADXModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Average Directional Index
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Average Directional Index (ADX) </strong>  {`is a technical indicator used in the field of technical analysis to measure the strength of a trend, whether it's an uptrend or a downtrend. Developed by J. Welles Wilder, ADX is a non-directional indicator, which means it does not indicate the direction of the trend but rather focuses on its strength.`}
                                Key characteristics of the Average Directional Index (ADX) include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{` The ADX is calculated by taking the average of two directional indicators known as the Positive Directional Index (+DI) and the Negative Directional Index (-DI) over a specified look-back period, typically 14 periods. The formula for ADX can be summarized as follows: ADX=100∗(1−1/(1+DI)) Here, DI represents the directional movement, and the final ADX value is a number between 0 and 100.`}</li>
                                  <li>Strength of Trend: ADX is primarily used to gauge the strength of a price trend. A high ADX reading, typically above 25, indicates a strong trend, either up or down. A low ADX reading, below 20, suggests a weak or ranging market.</li>
                                  <li>{`Directional Movement: The +DI and -DI components of ADX measure the strength of positive (upward) and negative (downward) price movements, respectively. When +DI is greater than -DI, it suggests an uptrend, and when -DI is greater than +DI, it indicates a downtrend.`}</li>
                                  <li>{`Crossover Signals: Traders often look for crossovers between +DI and -DI to generate buy and sell signals. A crossover of +DI above -DI may be seen as a bullish signal, while the reverse is considered bearish.`}</li>
                                  <li>{`Trend Confirmation: ADX helps in confirming the presence and strength of a trend. A rising ADX value often corresponds to a strengthening trend, while a falling ADX suggests a weakening or ranging market.`}</li>
                                  <li>Market Volatility: ADX can also provide insights into market volatility. Increasing ADX values often correspond to higher volatility, while declining ADX values may indicate decreasing volatility.</li>
                                  <li>Risk Management: Traders use ADX to assess the strength of a trend before entering a trade, helping them to better manage risk and set appropriate stop-loss orders.</li>
                                </ul>
                                {`The Average Directional Index is a valuable tool for traders and analysts looking to assess the strength of price trends and make informed decisions about trading or investment strategies. By focusing on the strength of a trend, ADX helps traders avoid weak or ranging markets and capitalize on strong trends.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='adx' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterADXCollapse}>
                      <div>
                      <div className="filter-block">
                      <Form onSubmit={submitADXHandler}>
                      <Form.Label htmlFor="stock">
                          Select Period 1
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                <Form.Control
                                      type="number"
                                      name='adxOne'
                                      placeholder={`Set ADX Period 1`}
                                      value={adxPeriodOne}
                                      onChange={(e) => setADXPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div>
                          <Form.Label htmlFor="stock">
                          Select Period 2
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='adxPTwo'
                                      placeholder={`Set ADX Period 2`}
                                      value={adxPeriodTwo}
                                      onChange={(e) => setADXPeriodTwo(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                              <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add ADX
                                  </Button>
                                </Col>
                              </Row>
                          </div> 
                      </Form>
                      </div>
                      </div>
                      </Collapse>
                    <Button
                      aria-expanded={filterSDCollapse}
                      onClick={() => setSDFilterCollapse(!filterSDCollapse)}
                      variant="link"
                      className="btn-collapse ps-0 text-primary"
                    >
                      {filterSDCollapse ? "Close SD Indicator" : "Add SD Indicator"}
                    </Button>
                    <Button className='mb-3' name='sd' onClick={(e) => onHelperModal(e)}>Standard Deviation</Button>
                        <Modal name='sd' show={sdModal} onHide={(e) => setSDModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Standard Deviation
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>Standard Deviation </strong>  {`is a statistical measurement used in technical analysis to assess the volatility or price variability of a financial asset. In the context of trading and investing, it helps traders and analysts understand the extent to which an asset's price fluctuates over a specified period. Standard Deviation is commonly used as a component of various technical indicators and strategies.`}
                                Key characteristics of the Standard Deviation include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{`Standard Deviation is calculated by measuring the dispersion or spread of price data points around the mean (average) price. It quantifies how far individual prices deviate from the average. The formula for Standard Deviation involves taking the square root of the variance, which is the average of the squared differences between each price data point and the mean.`}</li>
                                  <li>Volatility Measurement: Standard Deviation serves as a measure of price volatility. A higher Standard Deviation value implies greater price variability, indicating a more volatile asset. Conversely, a lower value suggests relative price stability.</li>
                                  <li>{`Risk Assessment: Traders and investors use Standard Deviation to assess the risk associated with an asset. Assets with higher Standard Deviation values are considered riskier due to their greater price fluctuations. Understanding an asset's volatility is crucial for effective risk management.`}</li>
                                  <li>{`Technical Indicator Component: Standard Deviation is often incorporated into other technical indicators, such as Bollinger Bands, which use it to define price bands that expand or contract based on volatility. The combination of Standard Deviation and other indicators can help traders make decisions about entries and exits.`}</li>
                                  <li>{`Market Sentiment: Sudden increases in Standard Deviation can be indicative of changing market sentiment. High volatility might suggest uncertainty or potential changes in the market landscape.`}</li>
                                  <li>{`Historical Analysis: Traders use Standard Deviation to analyze an asset's historical price movements. By comparing the current Standard Deviation to past values, they can gauge whether the asset's price behavior is deviating from its historical norm.`}</li>
                                  <li>Risk Management: Standard Deviation is a valuable tool for setting stop-loss levels and determining position sizes. It helps traders tailor their risk management strategies to the specific volatility of the asset they are trading.</li>
                                </ul>
                                {`Standard Deviation provides traders and analysts with insights into the risk and potential rewards associated with a financial asset. By quantifying price variability, it aids in making informed decisions, whether for portfolio diversification, risk management, or entry and exit strategies in trading.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='sd' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterSDCollapse}>
                      <div>
                      <div className="filter-block">
                      <Form onSubmit={submitSDHandler}>
                      <Form.Label htmlFor="stock">
                          Select Period 1
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='sdOne'
                                      placeholder={`Set SD Period 1`}
                                      value={sdPeriodOne}
                                      onChange={(e) => setSDPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div>
                          <Form.Label htmlFor="stock">
                          Select Period 2
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='sdPTwo'
                                      placeholder={`Set SD Period 2`}
                                      value={sdPeriodTwo}
                                      onChange={(e) => setSDPeriodTwo(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                              <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add Standard Deviation
                                  </Button>
                                </Col>
                              </Row>
                          </div> 
                      </Form>
                      </div>
                      </div>
                      </Collapse>
                      <Button
                        aria-expanded={filterMACDCollapse}
                        onClick={() => setMACDFilterCollapse(!filterMACDCollapse)}
                        variant="link"
                        className="btn-collapse ps-0 text-primary"
                      >
                        
                        {filterMACDCollapse ? "Close MACD Indicator" : "Add MACD Indicator"}
                      </Button>
                      <Button className='mb-3' name='macd' onClick={(e) => onHelperModal(e)}>Moving Average Convergence Divergence (MACD)</Button>
                        <Modal name='macd' show={macdModal} onHide={(e) => setMACDModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Moving Average Convergence Divergence (MACD): Select Period 1 (Longer) and Period 2 (Shorter) and Period 3 (Signal Line)
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Moving Average Convergence Divergence (MACD)</strong> {`is a popular and versatile technical indicator used in technical analysis to identify trends, momentum shifts, and potential buy or sell signals. Developed by Gerald Appel, the MACD is a trend-following and momentum oscillator that combines multiple exponential moving averages to provide valuable insights into price movements.`}
                                Key characteristics of the MACD include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{`The MACD is calculated by subtracting a longer-term Exponential Moving Average (EMA) from a shorter-term EMA. Additionally, the MACD includes a signal line, which is an EMA of the MACD line itself. The formula for calculating the MACD is as follows: MACD Line: EMA short - EMA long, Signal Line: EMA(MACD)`}</li>
                                  <li>Trend Identification: The MACD helps traders identify the direction and strength of a trend. When the MACD line is above the signal line, it suggests a bullish (upward) trend. Conversely, when the MACD line is below the signal line, it indicates a bearish (downward) trend.</li>
                                  <li>{`Momentum Analysis: MACD is a momentum oscillator, meaning it measures the speed and magnitude of price changes. When the MACD line diverges from the signal line, it can suggest a change in momentum, which traders often use as a potential signal to enter or exit trades.`}</li>
                                  <li>{`Histogram: The MACD histogram is created by subtracting the signal line from the MACD line. It provides a visual representation of the difference between the two lines. Positive histogram bars indicate a bullish momentum, while negative bars represent bearish momentum.`}</li>
                                  <li>{`Signal Generation: Traders use MACD crossovers as buy or sell signals. A bullish crossover occurs when the MACD line crosses above the signal line, while a bearish crossover happens when the MACD line crosses below the signal line.`}</li>
                                  <li>{`Divergence Analysis: Traders also look for divergences between the MACD and the price chart. For instance, when the price makes higher highs while the MACD makes lower highs, it may signal a bearish divergence, suggesting a potential trend reversal.`}</li>
                                  <li>Customization: Traders can adjust the timeframes and parameters of the MACD to suit their trading strategies and time horizons.</li>
                                </ul>
                                {`The Moving Average Convergence Divergence is a versatile and widely used indicator that provides traders and analysts with information about trends, momentum, and potential trade signals. By incorporating multiple moving averages, the MACD offers a comprehensive view of market dynamics and is a valuable tool for making informed trading decisions.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='macd' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                      <Collapse in={filterMACDCollapse}>
                      <div>
                      <div className="filter-block">
                      <Form onSubmit={submitMACDHandler}>
                      <Form.Label htmlFor="stock">
                          Select Period 1
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='emaPOne'
                                      placeholder={`Set EMA Short Period`}
                                      value={emaPeriodOne}
                                      onChange={(e) => setEmaPeriodOne(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div>
                          <Form.Label htmlFor="stock">
                          Select Period 2
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                      type="number"
                                      name='emaPTwo'
                                      placeholder={`Set EMA Long Period`}
                                      value={emaPeriodTwo}
                                      onChange={(e) => setEmaPeriodTwo(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                          </div> 
                          <Form.Label htmlFor="stock">
                          Select Period 3
                          </Form.Label>
                          <div className="mb-4">
                          <Row>
                              <Col lg="4">
                                <div className="d-flex align-items-center">
                                <Form.Control
                                      type="number"
                                      name='emaSignal'
                                      placeholder={`Set EMA Period Signal`}
                                      value={emaPeriodSignal}
                                      onChange={(e) => setEmaPeriodSignal(e.target.value)}
                                    />
                                </div>
                              </Col>
                              </Row>
                              <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add MACD
                                  </Button>
                                </Col>
                              </Row>
                          </div>    
                      </Form>
                      </div>
                      </div>
                      </Collapse>
                      <Button
                        aria-expanded={filterADLCollapse}
                        onClick={() => setADLFilterCollapse(!filterADLCollapse)}
                        variant="link"
                        className="btn-collapse ps-0 text-primary"
                        >
                        {filterADLCollapse ? "Close AD Line Indicator" : "Add AD Line Indicator"}
                        </Button>
                      <Button className='mb-3' name='adl' onClick={(e) => onHelperModal(e)}>Accumulation Distribution Line (A/D Line)</Button>
                        <Modal name='adl' show={adlModal} onHide={(e) => setADLModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-uppercase" as="h6">
                                Accumulation Distribution Line (A/D Line)
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-muted">
                                <strong>The Accumulation Distribution Line (A/D Line)</strong> {`is a technical indicator used in technical analysis to assess the accumulation or distribution of a financial asset. It is designed to provide insights into the flow of money in and out of an asset, helping traders and analysts understand the strength of a trend and potential reversals.`}
                                Key characteristics of the Accumulation Distribution Line (A/D Line) include:
                                <ul className="text-muted fw-light mt-3">
                                  <li>Calculation:{`The A/D Line is calculated based on the relationship between the closing price and trading volume of an asset. It evaluates whether the price closes near the high (indicating accumulation) or near the low (indicating distribution) within a given period. The formula for the A/D Line can be summarized as follows: A/D Line = Previous A/D Line + [(Current Close - Previous Close) / (High - Low)] * Volume Where "High" and "Low" represent the price range for the period, and "Volume" is the trading volume for the period.`}</li>
                                  <li>{`Accumulation and Distribution: The A/D Line primarily helps in distinguishing between accumulation and distribution phases. When the A/D Line is rising, it suggests accumulation, meaning that more buyers are willing to enter the market. Conversely, when it's falling, it indicates distribution, indicating that more sellers are active.`}</li>
                                  <li>{`Confirmation of Price Trends: Traders often use the A/D Line to confirm the strength of price trends. If the A/D Line is rising along with an uptrend in prices, it reinforces the bullish trend. Conversely, if the A/D Line is declining during a downtrend, it confirms the bearish trend.`}</li>
                                  <li>{`Divergence Analysis: Traders look for divergences between the A/D Line and the price chart to identify potential trend reversals. For example, if the price is making lower lows while the A/D Line is making higher lows, it may suggest a bullish divergence, indicating a potential trend reversal.`}</li>
                                  <li>{`Volume Confirmation: The A/D Line incorporates volume data, providing additional insight into the strength of price movements. A strong trend with high trading volume is often considered more reliable.`}</li>
                                  <li>{`Signal Generation: Traders may use the A/D Line in combination with other technical indicators to generate buy or sell signals. For instance, a crossover of the A/D Line above a moving average may be used as a bullish signal.`}</li>
                                  <li>Long-Term Analysis: The A/D Line can be applied to various timeframes, making it suitable for both short-term and long-term analysis.</li>
                                </ul>
                                {`The Accumulation Distribution Line is a valuable tool for traders and analysts looking to assess the flow of money into or out of an asset. By combining price and volume data, it offers insights into market dynamics, helps confirm trends, and provides potential signals for making informed trading and investment decisions.`}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-end">
                                <Button name='adl' onClick={(e) => onHelperModal(e)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                        <Collapse in={filterADLCollapse}>
                        <div>
                        <div className="filter-block">
                        <Form onSubmit={submitADLHandler}>
                            <Form.Label htmlFor="stock">
                            Add Indicators
                            </Form.Label>
                            <div className="mb-4">
                            <Row>
                                <Col lg="12" className="pt-3">
                                <Button
                                    type="submit"
                                    className={`h-100 ${
                                      props.btnClassName ? props.btnClassName : ""
                                    }`}
                                  >
                                    Add Accumulation Distribution Line (A/D Line)
                                  </Button>
                                </Col>
                              </Row>
                            </div>  
                        </Form>
                        </div>
                        </div>
                        </Collapse>

                        {(showSuggestions && filteredSuggestions?.length < 40) ?
                                <div onKeyDown = {(e) => onKeySuggestDown(e)}s>
                                    {renderSuggestedList()}
                                </div>:
                                ""
                                }
                        </div>
                      </div>
                    </div>
                    </Collapse>
                  <Button
                    aria-expanded={filterLineCollapse}
                    onClick={() => setLineFilterCollapse(!filterLineCollapse)}
                    variant="link"
                    className="btn-collapse ps-0 text-primary"
                  >
                    {filterLineCollapse ? "Close Technical Indicators" : "Add Technical Indicators"}
                  </Button>
                </div>
            </Col>
            <Col lg="9">
              {candleOne &&
              <Row>
                <ReactApexChart options={CandleOneCreated?.options} series={CandleOneCreated?.series} type="candlestick" height={550} />
                <ReactApexChart options={CandleOneCreated?.optionsBar} series={CandleOneCreated?.seriesBar} type="bar" height={300} />
              </Row>
              }
              {smaChart &&
              <Row>
                  <Line options={smaChartOptions} data={smaCharter} height={50} width={100}/>
              </Row>
              }
              {emaChart &&
                <Row>
                    <Line options={emaChartOptions} data={emaCharter} height={50} width={100}/>
                </Row>
              }
              {wmaChart &&
                <Row>
                    <Line options={wmaChartOptions} data={wmaCharter} height={50} width={100}/>
                </Row>
              }
              {demaChart &&
                <Row>
                    <Line options={demaChartOptions} data={demaCharter} height={50} width={100}/>
                </Row>
              }
              {temaChart &&
                <Row>
                    <Line options={temaChartOptions} data={temaCharter} height={50} width={100}/>
                </Row>
              }
              {willRChart &&
                <Row>
                    <Line options={willRChartOptions} data={willRCharter} height={50} width={100}/>
                </Row>
              }
              {rsiChart &&
                <Row>
                    <Line options={rsiChartOptions} data={rsiCharter} height={50} width={100}/>
                </Row>
              }
              {adxChart &&
                <Row>
                    <Line options={adxChartOptions} data={adxCharter} height={50} width={100}/>
                </Row>
              }
              {sdChart &&
                <Row>
                    <Line options={sdChartOptions} data={sdCharter} height={50} width={100}/>
                </Row>
              }
              {macdChart &&
                <Row>
                    <Chart options={macdChartOptions} data={macdCharter} height={50} width={100}/>
                </Row>
              }
              {adlChart &&
                <Row>
                    <Line options={adlChartOptions} data={adlCharter} height={50} width={100}/>
                </Row>
              }
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
}



export default ChartArea