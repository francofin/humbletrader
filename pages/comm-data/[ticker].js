import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {Container,Row,Col,Form,Button, ToggleButton, Badge, Overlay} from "react-bootstrap";
import UseWindowSize from "@hooks/UseWindowSize";
import roomData from "@data/stock-research.json";
import blog from "@data/blog.json";
import SwiperGallery from "@components/SwiperGallery";
import Image from "@components/CustomImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { useStockReturns } from "@hooks/useStockReturns";
import { useStockChart } from "@hooks/useStockCharts";
import swal from 'sweetalert';
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
import { Line, Bar } from 'react-chartjs-2';
import { useCommodData } from "@hooks/useCommodityData";


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





export function getAllPostIds() {
  return blog.posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }))
}

export function getPostData(slug) {
  for (var i = 0; i < blog.posts.length; i++) {
    if (blog.posts[i].slug == slug) {
      return blog.posts[i]
    }
  }
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


export async function getServerSideProps({query }) {

    const ticker = query.ticker
    // const stockRequested = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/commod-data/${ticker}`);
    // const data = stockRequested.data
    // console.log(data)

    const dailyStockData = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getdailycommoddata/${ticker}`);
    const dailyData = dailyStockData.data;
    const labels = dailyData.dates;
    const prices = dailyData.prices;

    
    const postData = getPostData("escape-city-today")
    return {
        props: {
        nav: {
            light: true,
            classes: "shadow",
            color: "white",
        },
        // title: postData.title,
        postData,
        ticker,
        dailyData,
        labels,
        prices,

        },
    }
}
const StockDetail = (props) => {
  const stockData = props.ticker
  const requestedData = useCommodData(stockData)
  

  const chartData = {
    type:'line',
    labels:props.labels,
    datasets: [{
      label: stockData.symbol,
      data:props.prices,
      borderColor: 'rgb(50, 166, 168)',
      backgroundColor: 'rgba(50, 166, 168, 0.5)',
      pointRadius: 1
    }]
  }

  const [dataForStock, setDataForStock] = useState(null);
  const [position, setPosition] = useState(null);
  const [frequency, setFrequency] = useState('30d');
  const [buttonClass, setButtonClass] = useState('outline-primary')

  const {chartLabels, chartReturns} = useStockReturns(props.dailyData,frequency)
  const {chartCreated, createChart} = useStockChart(frequency, chartLabels,chartReturns);
  

  useEffect(() => {
    setDataForStock(requestedData ? requestedData[0] : "")
  }, [requestedData])



  const size = UseWindowSize()
  const [range, setRange] = useState({
    from: false,
    to: false,
  })

  const groupByN = (n, data) => {
    let result = []
    for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n))
    return result
  }

  const adjustTimeStamp = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(date).toLocaleDateString(undefined, options)
  }

  const groupedAmenities = roomData.amenities && groupByN(4, roomData.amenities)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const fromRef = useRef()
  const toRef = useRef()
  useEffect(() => {
    if (range?.from && (!range?.to || range.to !== range.from)) {
      const timer = setTimeout(() => setShowDatePicker(false), 200)
      return () => clearTimeout(timer)
    }
  }, [range])


  const changeFrequency = (frequency) => {
    setFrequency(frequency);
  }



  return (
    <React.Fragment>
      <section>
        <SwiperGallery data={roomData.swiper} />
        <Container className="py-5">
          <Row>
            <Col lg="8">
              <div className="text-block">
                {stockData.name && <h1>{stockData.name}: {stockData.symbol}</h1>}
                {stockData.exchange && (
                  <div className="text-muted text-uppercase mb-4">
                    {stockData.exchange}
                  </div>
                )}
              </div>
              {roomData.frequencies && (
                <React.Fragment>
                  <div className="text-block">
                    <h4 className="mb-4">Commodity Price Movements</h4>
                    <Row>
                      <Line options={options} data={chartData} style={{height:'100px'}}/>
                    </Row>
                  </div>
                  <div className="text-block">
                    <h4 className="mb-2">Return Frequency</h4>
                    <ul className="list-inline">
                      {roomData.frequencies.map((freq, index) => (
                        <li
                          key={index}
                          className="list-inline-item mb-2"
                        >
                          <ToggleButton 
                            type="radio"
                            bg="light"
                            value={freq.value}
                            variant={freq.value === frequency ? 'primary' : buttonClass}
                            onClick = {() => changeFrequency(freq.value)}
                          >
                            {freq.label}
                          </ToggleButton >
                        </li>
                      ))}
                    </ul>
                  </div>
                  {chartCreated && <div className="text-block">
                    <h4 className="mb-4">Rolling Returns: {stockData.symbol}</h4>
                    <Row>
                      <Line options={options} data={createChart} style={{height:'100px'}}/>
                    </Row>
                  </div>}
                </React.Fragment>
              )}
              
              <div className="py-5">
              <Button
                  type="button"
                  variant="outline-primary"
                  // onClick={() => setReviewCollapse(!reviewCollapse)}
                >
                  Add Commodity to Profile
                </Button>
              </div>
            </Col>
            <Col lg="4">
              <div
                style={{ top: "100px" }}
                className="p-4 shadow ms-lg-4 rounded sticky-top"
              >
                <p className="text-muted">
                  <span className="text-primary h4">
                    Current Price: ${dataForStock?.price && dataForStock?.price}
                  </span>{" "}
                </p>
                <hr className="my-4" />
                {Number(dataForStock?.change) > 0 ?
                  <h5 className="text-sm text-center" style={{color:"green"}}>
                  % Change: {Number(dataForStock?.changesPercentage).toFixed(1)}%
                </h5> :
                <h5 className="text-sm text-center" style={{color:'red'}}>
                  % Change: {Number(dataForStock?.changesPercentage).toFixed(1)}%
                </h5>
                }
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                Day High: {Number(dataForStock?.dayHigh).toFixed(2)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                Day Low: {Number(dataForStock?.dayLow).toFixed(2)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Market Cap: {Intl.NumberFormat().format(dataForStock?.mktCap)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Year High: ${dataForStock?.yearHigh}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Year Low: ${dataForStock?.yearLow}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  50 Day Average: ${dataForStock?.priceAvg50}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  200 Day Average: ${dataForStock?.priceAvg200}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Average Volume {Intl.NumberFormat().format(dataForStock?.avgVolume)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Open: ${dataForStock?.open}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Previous Close: ${dataForStock?.previousClose}
                </h5>
                <hr className="my-4" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default StockDetail
