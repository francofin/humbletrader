import React, { useEffect, useState, useMemo, useContext } from "react";
import Link from "next/link";
import { idbPromise } from "@utils/helpers";
import "react-day-picker/dist/style.css";
import Select from "react-select"
import Swiper from "@components/Swiper"
import {Container,Row,Col,Form,Button, Tab, Nav, Overlay} from "react-bootstrap";
import data from "@data/index.json"
import { useRouter } from "next/router";
import axios from 'axios';
import { useIndexPerformance } from "@hooks/useIndexPerformance";
import swal from 'sweetalert';
import { isAuthenticatedUser } from '@utils/isAuthenticated';
import tabData from "@data/searchTabs.json";
import { useEquitySpreadCharter } from "@hooks/useEquitySpreadChart";
import { useCapitalMarketCharter } from "@hooks/useCapitalMarketsCharts";
import { useHomeIndex } from "@hooks/useHomeIndex"
import { useStockNames } from "@hooks/useStockNames"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { useIndexPagePrices } from "@hooks/useIndexPagePrices";
import EquityCharts from "@components/EquityCharts";
import EconomicCharts from "@components/EconomicCharts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const fetcher = async (url) => {
  const res = await axios.get(url)
  
  const resData = res.data
  return resData
}

export const frequencies = [
  {
      "value":"Quarterly",
      "label":"Quarterly"
  },
  {
      "value":"Yearly",
      "label":"Yearly"
  },
  {
      "value":"Three Year",
      "label":"Three Year"
  }
]

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

export async function getServerSideProps() {

  const URL = `${process.env.NEXT_PUBLIC_FINTANK_API_URL}/economic-data/`;
  const economicRequest = await fetcher(URL);
  const economicData = economicRequest.economic
  const equitySpreadData = economicRequest.equity_markets
  const tenYr = '10Y';
  const fiveYr = '5Y';
  const twoYr = '2Y';
  const thirtyYr = '30Y';
  const mlhy = 'MLHY';
  const twoVTen ='TWOVTEN';
  const fiveVTen = 'FIVEVTEN';
  const tenVThirty = 'TENVTHIRTY';
  const twoVFive = 'TWOVFIVE';
  const tenVMlhy = 'TENVMLHY';
  const cpi = 'CPI';
  const unemp = 'UNEMP';
  const nonFarm = 'NONFARM';
  const eafeVSC = 'EAFEVSC';
  const eafeVG = 'EAFEVG';
  const acwi = 'ACWI';
  const rOneVG = 'RONEVG';
  const russell2V1 = 'R2V1';
  const rmidVROne = 'RMIDV1';
  const russell2VMid = 'R2VMID';
  const russell2VG = 'R2VG';
  const spVNas = 'SPVNAS';
  const spVSPQ = 'SPVSPQ';
  const usFinVusTot = 'USFINVTOT';
  const usMatVusTot = 'USMATVTOT';
  const usHCVusTot = 'USHCVTOT';
  const usCSVusTot = 'USCSVTOT';
  const usCDVusTot = 'USCDVTOT';
  const usIndVusTot = 'USINDVTOT';
  const tsxVSci = 'TSXVSCI';
  const tsxVMin = 'TSXMINVCOMP';
  const tsxVBank = 'TSXBANKVCOMP';
  const spTsx = 'USCAN';


  
  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: "Fintank",
      data,
      economicData,
      equitySpreadData,
      tenYr,fiveYr,twoYr,thirtyYr,mlhy,twoVTen,fiveVTen,tenVThirty,
      twoVFive,tenVMlhy,cpi,unemp,nonFarm,
      eafeVSC,eafeVG,acwi,spTsx,
      rOneVG,russell2V1,rmidVROne,russell2VMid,russell2VG,
      spVNas,spVSPQ,
      usFinVusTot,usMatVusTot,usHCVusTot,
      usCSVusTot,usCDVusTot,usIndVusTot,
      tsxVSci,
      tsxVMin, 
      tsxVBank
    },
  }
}

const CapitalMarketIndicators = (props) =>{
  const router = useRouter();
  const indexData = useHomeIndex();
  const chartData = props;
  const [chosenTab, setChosenTab] = useState(tabData.marketSearchTabs.tabs[0].title);


  const {data:stockNames} = useStockNames();
  const allStocks = stockNames?.stocks.filter((stock, i) => (stock.universe === "sp500") || (stock.universe === "tsx"));

  const randomTickerSearch = () => {
    let randomIndex = Math.floor(Math.random()*allStocks?.length)
    let randomSymbol = allStocks[randomIndex].symbol
    console.log(randomSymbol);
    router.push(`/stock-data/${randomSymbol}`)
  }

  const changeTab = (e) => {
    setChosenTab(e)
  }



  return (
    <React.Fragment>
      <section className="hero-home">
        <Swiper
          className="hero-slider"
          wrapperClasses="dark-overlay"
          data={data.swiperImages}
          simple
          effect="fade"
          speed={2000}
          autoplay={{
            delay: 10000,
          }}
        />
        <Container className="py-6 py-md-7 text-white z-index-20">
          <Row>
            <Col xl="10">
              {data.hero && (
                <div className="text-center text-lg-start">
                  <p className="subtitle letter-spacing-4 mb-2 text-secondary text-shadow">
                    {data.hero.subTitle}
                  </p>
                  <h1 className="display-3 fw-bold text-shadow">
                    {`Capital Market Indicators`}
                  </h1>
                </div>
              )}
              {allStocks ?
                <Button onClick={randomTickerSearch}>
                  Random Ticker Search
                </Button> :
                <Button onClick={randomTickerSearch} disabled={true}>
                Random Ticker Search
              </Button>
              }
              
            </Col>
          </Row>
        </Container>
      </section>
      {data.topBlocks && (
        <section className="py-6 bg-gray-100">
          <Container>
            <div className="text-center pb-lg-4">
              <p className="subtitle text-primary">
                {data.topBlocks.subTitle}
              </p>
              <h2 className="mb-5">{data.topBlocks.title}</h2>
            </div>
            <Swiper
                className="swiper-container-mx-negative pt-3 pb-5"
                wrapperClasses="dark-overlay"
                indexReturns
                perView={1}
                md={2}
                lg={3}
                xl={4}
                data={indexData.data}
                loop
                speed={1000}
                pagination
                autoplay={{
                  delay: 5000,
                }}
              />
          </Container>
        </section>
      )}

      <section className="py-0 bg-gray-100">
        <Container>
          <Tab.Container id="top-tabs" defaultActiveKey={tabData.marketSearchTabs.tabs[0].title}>
          <Nav variant="tabs" className="search-bar-nav-tabs" onSelect={changeTab}>  
            {tabData.marketSearchTabs &&
              tabData.marketSearchTabs.tabs.map((tab, index) => (
                <Nav.Item
                  key={index}
                  className={
                    index < tabData.marketSearchTabs.tabs.length - 1 ? "me-2" : ""
                  }
                >
                  <Nav.Link eventKey={tab.title} value={tab.title}>{tab.title}</Nav.Link>
                </Nav.Item>
              ))}
          </Nav>
          <section className="py-0 bg-white-100">
            <Tab.Content>
                <Tab.Pane eventKey={chosenTab}>
                {chosenTab === tabData.marketSearchTabs.tabs[0].title ? 
                  <EquityCharts data={chartData}/> : 
                  chosenTab === tabData.marketSearchTabs.tabs[1].title ? <EconomicCharts data={chartData}/> : ""
                }
                </Tab.Pane>
            </Tab.Content>
            
          </section>
          </Tab.Container>
        </Container>
      </section>
    </React.Fragment>
  )

}


export default CapitalMarketIndicators