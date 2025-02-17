import React, { useEffect, useState, useMemo, useContext } from "react";
import Link from "next/link";
import { idbPromise } from "@utils/helpers";
import "react-day-picker/dist/style.css";
import Select from "react-select"
import Swiper from "@components/Swiper"
import {Container,Row,Col,Form,Button, ToggleButton, Badge, Overlay} from "react-bootstrap";
import data from "@data/index.json"
import axios from 'axios';
import { useEquitySpreadCharter } from "@hooks/useEquitySpreadChart";
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
  


const EquityCharts = ({data}) => {
    const equitySpreadData = data.equitySpreadData;
    const [roneTwofrequency, setRoneTwoFrequency] = useState(frequencies[0].value)
    const [roneMidfrequency, setRoneMidFrequency] = useState(frequencies[0].value)
    const [rtwoMidfrequency, setRtwoMidFrequency] = useState(frequencies[0].value)
    const [roneVGfrequency, setRoneVGFrequency] = useState(frequencies[0].value)
    const [rtwoVGfrequency, setRtwoVGFrequency] = useState(frequencies[0].value)
    const [spNasfrequency, setSpNasFrequency] = useState(frequencies[0].value)
    const [spQfrequency, setSpQFrequency] = useState(frequencies[0].value)
    const [usTotVCDfrequency, setUsTotVCDFrequency] = useState(frequencies[0].value)
    const [usTotVCSfrequency, setUsTotVCSFrequency] = useState(frequencies[0].value)
    const [usTotVHCfrequency, setUsTotVHCFrequency] = useState(frequencies[0].value)
    const [usTotVFinfrequency, setUsTotVFinFrequency] = useState(frequencies[0].value)
    const [usTotVMatfrequency, setUsTotVMatFrequency] = useState(frequencies[0].value)
    const [usTotVIndfrequency, setUsTotVIndFrequency] = useState(frequencies[0].value)
    const [tsxVSCIfrequency, setTsxVSCIFrequency] = useState(frequencies[0].value)
    const [tsxVMinfrequency, setTsxVMinFrequency] = useState(frequencies[0].value)
    const [tsxVBankfrequency, setTsxVBankFrequency] = useState(frequencies[0].value)
    const [acwifrequency, setAcwiFrequency] = useState(frequencies[0].value)
    const [eafefrequency, setEafeFrequency] = useState(frequencies[0].value)
    const [eafeVGfrequency, setEafeVGFrequency] = useState(frequencies[0].value)
    const [spTSXfrequency, setSpTSXFrequency] = useState(frequencies[0].value)

    const {indexChartCreated:roneVRTwoChartCreated, createIndexChart:roneVRTwoChart, indexName:roneVRTwoName} = useEquitySpreadCharter(data.russell2V1, equitySpreadData?.rone_v_rtwo_pack, roneTwofrequency)
    const {indexChartCreated:roneVRMidChartCreated, createIndexChart:roneVRMidChart, indexName:roneVRMidName} = useEquitySpreadCharter(data.rmidVROne, equitySpreadData?.rone_rmid_pack, roneMidfrequency)
    const {indexChartCreated:rtwoVRMidChartCreated, createIndexChart:rtwoVRMidChart, indexName:rtwoVRMidName} = useEquitySpreadCharter(data.russell2VMid, equitySpreadData?.rtwo_rmid_pack, rtwoMidfrequency)
    const {indexChartCreated:roneVGChartCreated, createIndexChart:roneVGChart, indexName:roneVGName} = useEquitySpreadCharter(data.rOneVG, equitySpreadData?.ronev_v_roneg_pack, roneVGfrequency)
    const {indexChartCreated:rtwoVGChartCreated, createIndexChart:rtwoVGChart, indexName:rtwoVGName} = useEquitySpreadCharter(data.russell2VG, equitySpreadData?.rtwov_v_rtwog_pack, rtwoVGfrequency)
    const {indexChartCreated:sp5VNasChartCreated, createIndexChart:sp5VNasChart, indexName:sp5VNasName} = useEquitySpreadCharter(data.spVNas, equitySpreadData?.sp500_v_nasd_pack, spNasfrequency)
    const {indexChartCreated:sp5VQChartCreated, createIndexChart:sp5VQChart, indexName:sp5VQName} = useEquitySpreadCharter(data.spVSPQ, equitySpreadData?.sp500_v_sp500q_pack, spQfrequency)
    const {indexChartCreated:usTotVCDChartCreated, createIndexChart:usTotVCDChart, indexName:usTotVCDName} = useEquitySpreadCharter(data.usCDVusTot, equitySpreadData?.ustot_v_uscd_pack, usTotVCDfrequency)
    const {indexChartCreated:usTotVCSChartCreated, createIndexChart:usTotVCSChart, indexName:usTotVCSName} = useEquitySpreadCharter(data.usCSVusTot, equitySpreadData?.ustot_v_uscs_pack, usTotVCSfrequency)
    const {indexChartCreated:usTotVHCChartCreated, createIndexChart:usTotVHCChart, indexName:usTotVHCName} = useEquitySpreadCharter(data.usHCVusTot, equitySpreadData?.ustot_v_ushc_pack, usTotVHCfrequency)
    const {indexChartCreated:usTotVFinChartCreated, createIndexChart:usTotVFinChart, indexName:usTotVFinName} = useEquitySpreadCharter(data.usFinVusTot, equitySpreadData?.ustot_v_usfin_pack, usTotVFinfrequency)
    const {indexChartCreated:usTotVMatChartCreated, createIndexChart:usTotVMatChart, indexName:usTotVMatName} = useEquitySpreadCharter(data.usMatVusTot, equitySpreadData?.ustot_v_usmat_pack, usTotVMatfrequency)
    const {indexChartCreated:usTotVIndChartCreated, createIndexChart:usTotVIndChart, indexName:usTotVIndName} = useEquitySpreadCharter(data.usIndVusTot, equitySpreadData?.ustot_v_usind_pack, usTotVIndfrequency)
    const {indexChartCreated:spTsxChartCreated, createIndexChart:spTsxChart, indexName:spTsxName} = useEquitySpreadCharter(data.spTsx, equitySpreadData?.sptsxpack, spTSXfrequency)
    const {indexChartCreated:tsxVSCIChartCreated, createIndexChart:tsxVSCIChart, indexName:tsxVSCIName} = useEquitySpreadCharter(data.tsxVSci, equitySpreadData?.tsx_v_tsxsci_pack, tsxVSCIfrequency)
    const {indexChartCreated:tsxVMinChartCreated, createIndexChart:tsxVMinChart, indexName:tsxVMinName} = useEquitySpreadCharter(data.tsxVMin, equitySpreadData?.tsx_v_tsxmin_pack, tsxVMinfrequency)
    const {indexChartCreated:tsxVBankChartCreated, createIndexChart:tsxVBankChart, indexName:tsxVBankName} = useEquitySpreadCharter(data.tsxVBank, equitySpreadData?.tsx_v_tsxbank_pack, tsxVBankfrequency)
    const {indexChartCreated:acwiVExUSChartCreated, createIndexChart:acwiVExUSChart, indexName:acwiVExUSName} = useEquitySpreadCharter(data.acwi, equitySpreadData?.acwi_v_acwiexus_pack, acwifrequency)
    const {indexChartCreated:eafeVEafeSCChartCreated, createIndexChart:eafeVEafeSCChart, indexName:eafeVEafeSCName} = useEquitySpreadCharter(data.eafeVSC, equitySpreadData?.eafe_v_eafesc_pack, eafefrequency)
    const {indexChartCreated:eafeVGChartCreated, createIndexChart:eafeVGChart, indexName:eafeVGName} = useEquitySpreadCharter(data.eafeVG, equitySpreadData?.eafev_v_eafeg_pack, eafeVGfrequency)



    return (
      <Container>
      <Row className="pt-3">
            <Col lg="12">
            <div className="text-block">
                <h3 className="mb-3">Index Cap and Style Spread Charts</h3>
                <p className="text-muted fw-light">
                  {`Spread between Large, Small and Mid Cap as well as Style Spreads including Value and Growth.`}
                </p>
            </div>
            </Col>
          </Row>
        {(roneVRTwoChartCreated && roneVRMidChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
                <div>
                  <h3 className="mb-3">Russell 1000 Versus Russell 2000 (R2000-R1000)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 1000 and the Russell 2000 serves as a valuable indicator of relative performance between large-cap and 
                      small-cap stocks in the U.S. equity market. A widening spread, with the Russell 1000 outpacing the Russell 2000, 
                      can signal investor preference for larger, more established companies, often associated with a risk-averse sentiment or 
                      expectations of slower economic growth. Conversely, a narrowing spread, with the Russell 2000 outperforming, may reflect 
                      a risk-on sentiment, suggesting investors are more willing to embrace smaller companies 
                      and potentially anticipate stronger economic growth. This spread helps gauge market sentiment and sector rotation dynamics.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={roneTwofrequency}
                    placeholder = {roneTwofrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRoneTwoFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={roneVRTwoChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Russell 1000 Versus Russell Mid Cap (R1000-RMID)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 1000 and the Russell Mid Cap provides insights into the performance of large-cap stocks 
                      versus mid-cap stocks in the U.S. equity market. A widening spread, with the Russell 1000 outperforming the Russell Mid Cap, 
                      may indicate investor preference for larger, more established companies, potentially reflecting risk-averse sentiment or economic 
                      uncertainty. Conversely, a narrowing spread, with the Russell Mid Cap outperforming, may signal a risk-on sentiment, 
                      suggesting investors are favoring mid-sized companies and potentially anticipating stronger economic growth. 
                      This spread offers a glimpse into market sentiment and sector rotation dynamics within the mid to large-cap range.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={roneMidfrequency}
                    placeholder = {roneMidfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRoneMidFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={roneVRMidChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(rtwoVRMidChartCreated && roneVGChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Russell 2000 Versus Russell Mid Cap (R2000-RMID)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 2000 and the Russell Mid Cap provides valuable insights into the performance of small-cap 
                      stocks versus mid-cap stocks in the U.S. equity market. A widening spread, with the Russell 2000 outperforming the Russell Mid Cap, 
                      often indicates investor preference for smaller, more agile companies, potentially reflecting an appetite for higher risk 
                      and a belief in robust economic growth. Conversely, a narrowing spread, with the Russell Mid Cap outperforming, 
                      may suggest a more cautious market sentiment, where investors are favoring mid-sized companies perceived as relatively stable. 
                      This spread helps assess market sentiment and sector rotation dynamics within the mid to small-cap range and can offer clues about risk appetite and economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={rtwoMidfrequency}
                    placeholder = {rtwoMidfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRtwoMidFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={rtwoVRMidChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Russell 1000 Value Versus Russell 1000 Growth (R1VAL-R1GRO)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 1000 Value Index and the Russell 1000 Growth Index provides insights into the performance of 
                      value-oriented versus growth-oriented stocks in the U.S. equity market. A widening spread, with the Russell 1000 Value Index 
                      outperforming the Growth Index, often indicates investor preference for mature, dividend-paying companies with attractive valuations. 
                      This can be seen as a sign of value-seeking behavior and a more conservative approach. Conversely, a narrowing spread, with the 
                      Russell 1000 Growth Index outperforming, may suggest investors are leaning towards companies with higher growth potential, 
                      even if they carry higher valuations. This spread helps gauge market sentiment 
                      and sector rotation dynamics within the large-cap segment, offering insights into investors' risk preferences and views on the economy.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={roneVGfrequency}
                    placeholder = {roneVGfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRoneVGFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={roneVGChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(rtwoVGChartCreated && sp5VNasChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Russell 2000 Value Versus Russell 2000 Growth (R2VAL-R2GRO)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 2000 Value Index and the Russell 2000 Growth Index offers insights into the performance of 
                      value-oriented small-cap stocks versus growth-oriented small-cap stocks in the U.S. equity market. A widening spread, with the 
                      Russell 2000 Value Index outperforming the Growth Index, often indicates investor preference for smaller companies with solid
                       fundamentals and lower valuations, reflecting a value-oriented strategy. Conversely, a narrowing spread, with the 
                       Russell 2000 Growth Index outperforming, may suggest a market sentiment favoring smaller companies with higher growth potential, 
                       even if they come with higher valuations. This spread helps assess investor sentiment 
                      and sector rotation dynamics within the small-cap segment, shedding light on risk preferences and economic outlook among investors. 
                      Indices represented by the ETF's that track their performance.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={rtwoVGfrequency}
                    placeholder = {rtwoVGfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRtwoVGFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={rtwoVGChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P 500 Versus the NASDAQ Composite (NASD-SP500)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P 500 Index and the Nasdaq Composite Index provides valuable insights into the performance of 
                      two prominent U.S. equity benchmarks. A widening spread, with the S&P 500 outperforming the Nasdaq, often signifies 
                      investor preference for a more diversified mix of large-cap companies across various sectors, reflecting a balanced approach 
                      to equity investments. Conversely, a narrowing spread, with the Nasdaq outperforming, may indicate investor appetite for 
                      technology-focused and high-growth companies, potentially signaling a risk-on sentiment and optimism about the tech sector. 
                      This spread helps gauge market sentiment and sector rotation dynamics 
                      within the U.S. equity market, offering insights into investor preferences, risk appetite, and economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={spNasfrequency}
                    placeholder = {spNasfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setSpNasFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={sp5VNasChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(sp5VQChartCreated && usTotVCDChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P 500 Versus S&P 500 Quality (SPQUAL-SP500)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P 500 Index and the S&P 500 Quality Index offers insights into the performance of the broader 
                      market compared to a subset of high-quality companies within the S&P 500. A widening spread, with the S&P 500 outperforming 
                      the Quality Index, often suggests that investors are favoring a more diversified approach, which may include companies of 
                      varying quality levels. Conversely, a narrowing spread, with the Quality Index outperforming, may indicate that investors 
                      are seeking out higher-quality, more stable companies within the S&P 500, potentially reflecting a risk-averse sentiment 
                      or concerns about economic stability. This spread helps assess market sentiment and sector rotation dynamics, revealing investor 
                      preferences for quality versus broader market exposure and offering insights into risk appetite and economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={spQfrequency}
                    placeholder = {spQfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setSpQFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={sp5VQChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Consumer Discretionary (USCD-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Consumer Discretionary Index provides insights into 
                        the performance of the entire U.S. stock market compared to a specific sector focused on consumer discretionary goods and services. 
                        A widening spread, with the US Total Market outperforming the Consumer Discretionary Index, typically indicates that investors are 
                        favoring a more diversified approach, including sectors beyond consumer discretionary. Conversely, a narrowing spread, with the 
                        Consumer Discretionary Index outperforming, may signal that investors are increasingly interested in consumer-oriented companies, 
                        suggesting optimism about consumer spending and economic growth. This spread helps gauge market sentiment 
                        and sector-specific dynamics, offering insights into investor preferences, economic outlook, and consumer-related trends.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVCDfrequency}
                    placeholder = {usTotVCDfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVCDFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVCDChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(usTotVCSChartCreated && usTotVHCChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Consumer Staples (USCS-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Consumer Staples Index provides insights into the performance of the entire 
                      U.S. stock market compared to a specific sector focused on consumer staples, which includes essential, non-cyclical goods like food, 
                      beverages, and household products. A widening spread, with the US Total Market outperforming the Consumer Staples Index, 
                      often indicates that investors are favoring a broader market exposure, potentially signaling confidence in economic growth 
                      and a willingness to take on more risk. Conversely, a narrowing spread, with the Consumer Staples Index outperforming, 
                      may suggest that investors are seeking defensive, recession-resistant assets, reflecting a more risk-averse sentiment 
                      or concerns about economic stability. This spread helps assess market sentiment, sector rotation dynamics, and investor preferences regarding risk and economic conditions.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVCSfrequency}
                    placeholder = {usTotVCSfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVCSFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVCSChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Health Care (USHC-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Health Care Index offers insights into the performance of the overall 
                      U.S. stock market in comparison to a specific sector focused on healthcare-related companies. A widening spread, 
                      with the US Total Market outperforming the Health Care Index, often suggests that investors are favoring a more diversified approach, 
                      potentially indicating confidence in various sectors beyond healthcare. Conversely, a narrowing spread, 
                      with the Health Care Index outperforming, may indicate a preference for healthcare stocks, 
                      reflecting investor confidence in the resilience of the healthcare sector, regardless of broader market conditions. This spread 
                      helps assess market sentiment and sector-specific dynamics, offering insights into investor preferences, healthcare trends, and risk appetite.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVHCfrequency}
                    placeholder = {usTotVHCfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVHCFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVHCChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(usTotVFinChartCreated && usTotVMatChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Financials (USFIN-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Financials Index provides insights into the performance of the overall 
                      U.S. stock market compared to a specific sector focused on financial companies. A widening spread, with the 
                      US Total Market outperforming the Financials Index, often indicates that investors are favoring a more diversified approach, 
                      potentially signaling confidence in various sectors beyond financials. Conversely, a narrowing spread, with the Financials Index 
                      outperforming, may suggest a preference for financial companies, reflecting investor optimism about the health of the financial sector, 
                      interest rate trends, and economic conditions. This spread helps assess market sentiment and sector-specific dynamics, offering insights 
                      into investor preferences, financial sector trends, and expectations for economic factors like interest rates and banking activities.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVFinfrequency}
                    placeholder = {usTotVFinfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVFinFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVFinChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Basic Materials (USMAT-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Basic Materials Index provides insights into the performance of the overall 
                      U.S. stock market compared to a specific sector focused on basic materials companies. A widening spread, 
                      with the US Total Market outperforming the Basic Materials Index, often indicates that investors are favoring a more diversified approach, 
                      potentially signaling confidence in various sectors beyond basic materials. Conversely, a narrowing spread, 
                      with the Basic Materials Index outperforming, may suggest a preference for companies in the basic materials sector, 
                      reflecting investor optimism about economic growth and infrastructure development. 
                      This spread helps assess market sentiment and sector-specific dynamics, 
                      offering insights into investor preferences, trends in the basic materials sector, and economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVMatfrequency}
                    placeholder = {usTotVMatfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVMatFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVMatChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(usTotVIndChartCreated && spTsxChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Industrials (USIND-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Industrials Index provides insights into the performance of the overall 
                      U.S. stock market compared to a specific sector focused on industrial companies. A widening spread, with the US Total Market 
                      outperforming the Industrials Index, often indicates that investors are favoring a more diversified approach, potentially 
                      signaling confidence in various sectors beyond industrials. Conversely, a narrowing spread, with the Industrials Index outperforming, 
                      may suggest a preference for companies in the industrial sector, reflecting investor optimism about economic growth, manufacturing, 
                      and infrastructure development. This spread helps assess market sentiment and sector-specific dynamics, 
                      offering insights into investor preferences, trends in the industrial sector, and economic outlook, particularly in terms of manufacturing and infrastructure investment.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVIndfrequency}
                    placeholder = {usTotVIndfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVIndFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVIndChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P 500 Versus the S&P/TSX Composite (TSX-SP500)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P 500 Index and the S&P/TSX Index provides insights into the relative performance of the 
                      U.S. and Canadian equity markets. A widening spread, with the S&P 500 outperforming the S&P/TSX, 
                      often suggests that investors are favoring U.S. equities, potentially reflecting confidence in the U.S. economy, 
                      a stronger U.S. dollar, or sector-specific dynamics within the S&P 500. Conversely, a narrowing spread, 
                      with the S&P/TSX outperforming, may indicate a preference for Canadian equities, 
                      reflecting investor optimism about the Canadian economy, commodity prices, or other factors specific to the Canadian market. 
                      This spread helps assess investor sentiment and potential shifts in allocation between U.S. and 
                      Canadian assets, offering insights into market preferences, currency movements, and economic outlooks for both countries.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={spTSXfrequency}
                    placeholder = {spTSXfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setSpTSXFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={spTsxChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(tsxVSCIChartCreated && tsxVMinChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P/TSX Composite Versus the S&P/TSX Small Cap Index (TSXSCI-TSX)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P/TSX Index and the S&P/TSX Small Cap Index offers insights into the performance of 
                      larger Canadian companies versus smaller-cap Canadian companies. A widening spread, with the S&P/TSX outperforming 
                      the Small Cap Index, often suggests that investors are favoring larger, more established companies, 
                      potentially reflecting a risk-averse sentiment or confidence in well-established businesses. Conversely, a narrowing spread, with the Small Cap Index outperforming, may indicate a preference for smaller-cap companies, reflecting optimism about their growth potential, economic conditions, or sector-specific trends within the small-cap segment. 
                      This spread helps assess investor sentiment and sector-specific dynamics, offering insights into preferences for 
                      larger versus smaller Canadian companies and potential shifts in risk appetite or economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={tsxVSCIfrequency}
                    placeholder = {tsxVSCIfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setTsxVSCIFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={tsxVSCIChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P/TSX Composite Versus the S&P/TSX Mining Index (TSXMIN-TSX)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P/TSX Index and the S&P/TSX Mining Index provides insights into the relative performance of 
                      the broader Canadian equity market and the mining sector. A widening spread, with the S&P/TSX outperforming the Mining Index, 
                      often suggests that investors are favoring a more diversified approach, potentially reflecting confidence in various sectors 
                      beyond mining or commodity markets. Conversely, a narrowing spread, with the Mining Index outperforming, may indicate a 
                      preference for mining-related companies, reflecting optimism about commodity prices, resource sector trends, 
                      or economic conditions related to mining activities. This spread helps assess investor sentiment and sector-specific dynamics, 
                      offering insights into preferences for broader market exposure versus a focus on the mining sector, and potential shifts in commodity market conditions.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={tsxVMinfrequency}
                    placeholder = {tsxVMinfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setTsxVMinFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={tsxVMinChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(tsxVBankChartCreated && acwiVExUSChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P/TSX Composite Versus the S&P/TSX Banking Index (TSXBANKS-TSX)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P/TSX Index and the S&P/TSX Banking Index provides insights into the relative performance of 
                      the broader Canadian equity market and the banking sector within Canada. A widening spread, with the S&P/TSX outperforming the 
                      Banking Index, often suggests that investors are favoring a more diversified approach, potentially reflecting confidence in v
                      arious sectors beyond banking or specific dynamics within the broader market. Conversely, a narrowing spread, with the 
                      Banking Index outperforming, may indicate a preference for banking-related companies, 
                      reflecting investor optimism about the financial sector, interest rate trends, or economic conditions linked to the banking industry. 
                      This spread helps assess investor sentiment and sector-specific dynamics, offering insights into preferences for broader market 
                      exposure versus a focus on the banking sector, and potential shifts in financial market conditions or economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={tsxVBankfrequency}
                    placeholder = {tsxVBankfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setTsxVBankFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={tsxVBankChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">MSCI ACWI Versus MSCI ACWI Ex US Stocks (ACWIEXUS-ACWI)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the MSCI ACWI (All Country World Index) and the MSCI ACWI Ex US Index provides insights into the 
                      relative performance of global equities inclusive of the United States versus the performance of global equities 
                      excluding U.S. stocks. A widening spread, with the MSCI ACWI outperforming the Ex US Index, often suggests that 
                      investors are favoring U.S. equities over international markets, potentially reflecting confidence in the U.S. economy, 
                      currency trends, or specific dynamics within U.S. stock markets. Conversely, a narrowing spread, 
                      with the Ex US Index outperforming, may indicate a preference for international stocks, 
                      reflecting optimism about global economic conditions, emerging markets, or currency factors. 
                      This spread helps assess investor sentiment and sector-specific dynamics on a global scale, 
                      offering insights into preferences for U.S. versus international market exposure and potential shifts in 
                      global economic conditions or currency trends.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={acwifrequency}
                    placeholder = {acwifrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setAcwiFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={acwiVExUSChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(eafeVEafeSCChartCreated && eafeVGChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">MSCI EAFE Versus the MSCI EAFE Small Cap Index (EAFESC-EAFE)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the MSCI EAFE (Europe, Australasia, and the Far East) Index and the MSCI EAFE Small Cap Index 
                      provides insights into the relative performance of larger-cap international equities within developed markets 
                      compared to smaller-cap international stocks. A widening spread, with the MSCI EAFE outperforming the Small Cap Index, 
                      often suggests that investors are favoring larger, more established companies in international markets, 
                      potentially reflecting a risk-averse sentiment or confidence in well-established businesses overseas. Conversely, 
                      a narrowing spread, with the Small Cap Index outperforming, may indicate a preference for smaller-cap international companies, 
                      reflecting optimism about their growth potential, economic conditions, or sector-specific trends within the small-cap segment. 
                      This spread helps assess investor sentiment and sector-specific dynamics within developed international markets, offering insights 
                      into preferences for larger versus smaller international equities and potential shifts in risk appetite or economic outlook abroad.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={eafefrequency}
                    placeholder = {eafefrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setEafeFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={eafeVEafeSCChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">MSCI EAFE Value Versus the MSCI EAFE Growth Index (EAFEV-EAFEG)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the MSCI EAFE Value Index and the MSCI EAFE Growth Index offers insights into the relative performance of 
                      value-oriented versus growth-oriented stocks within developed international markets. A widening spread, with the 
                      EAFE Value Index outperforming the Growth Index, often indicates that investors are favoring value stocks, 
                      which are typically characterized by lower valuations and dividends, potentially reflecting a cautious or defensive market sentiment. 
                      Conversely, a narrowing spread, with the Growth Index outperforming, may suggest that investors are leaning towards 
                      growth-oriented stocks, which are often associated with higher valuations and potential for higher earnings growth, 
                      reflecting a risk-on sentiment or confidence in economic growth. This spread helps assess investor sentiment and 
                      sector-specific dynamics within developed international markets, 
                      offering insights into preferences for value versus growth stocks and potential shifts in market conditions or economic outlook abroad.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={eafeVGfrequency}
                    placeholder = {eafeVGfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setEafeVGFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={eafeVGChart} height={100} width={200}/>
              </Col>
            </Row>
          }
        </Container>
    )
}

export default EquityCharts;