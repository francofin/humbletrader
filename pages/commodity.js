import React, {useEffect, useState} from "react"
import Link from "next/link"
import Select from "react-select"
import sector from "@data/sectors-subsectors.json"
import {Container, Button, Form, InputGroup, Row, Col, Badge, Breadcrumb, Modal} from "react-bootstrap"
import universe from "@data/universe.json"
import axios from 'axios';
import { useRouter } from "next/router"
import {connect} from 'react-redux';
import screenerAction from '@src/actions/screenerAction'
import { bindActionCreators } from "redux"
import CommodListPagination from "@components/CommodPagination"


export function getAllPostIds() {
  return universe.posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }))
}
  
export async function getPostData(slug) {
  for (var i = 0; i < universe.posts.length; i++) {
    if (universe.posts[i].slug == slug) {
      return {
        stockItem: universe.posts[i],
        slug
      }
    }
  }
}

export async function getServerSideProps({ params, query }) {
  // const parameters= getAllPostIds()

let res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/universe-data/commod`);
let data = res.data;

const totalStocks = data.count
const resultsPerPage = 20


const numberOfPages = totalStocks/resultsPerPage

return {
  props: {
    nav: {
      light: true,
      classes: "shadow",
      color: "white",
    },
    loggedUser: false,
    title: "Fintank Stock Screener",
    data,
    numberOfPages,
    totalStocks,
    resultsPerPage
  },
}
}

const Universe = (props) => {

  const [modal, setModal] = useState(false)

   
  const univerData = props.data.items
  

  const [universe, setUniverse] = useState(props.data.items)

  // let sectorFilter = null
  const [sectorHookFilter, setSectorFilter] = useState('All');
  // let stockData = univerData;
  let filterData = univerData;
  const [numberOfStocks, setNumberOfStocks] = useState(props.totalStocks);
  const [limitIndex, setLimitIndex] = useState(props.resultsPerPage);



  const router = useRouter();


  let queryParams;
  if(typeof window !== 'undefined'){
    queryParams = new URLSearchParams(window.location.search);
  }


  useEffect(() => {
    const setUniverseData = async() => {
        await setUniverse(univerData)
    }

    setUniverseData()
  }, [univerData])
  

  

  return (
    <section className="py-5">
      <Container>
        <Breadcrumb listProps={{ className: "ps-0 justify-content-center" }}>
          <Link href="/" passHref>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item active>Host view</Breadcrumb.Item>
        </Breadcrumb>
        <div className="d-flex justify-content-between align-items-end mb-5">
          <h1 className="hero-heading mb-0">{`Commodities`}</h1>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-column flex-lg-row mb-5 mt-5">
          <div className="me-3">
            <p className="mb-3 mb-lg-0">
              There are <strong>{props.data.count}</strong> Commodities <i>Some Commodities May not be listed</i>
            </p>
          </div>
        </div>
        <CommodListPagination dataProps={universe} itemsPerPage={limitIndex} />
       
      </Container>
    </section>
  )
}

function mapStateToProps(state){
  return {
    screenerAction:state.screener
  }
}

function mapDispatchToProps(dispatch){

  return bindActionCreators({
    screenerActionRun:screenerAction
  }, dispatch)

}

export default connect(mapStateToProps, mapDispatchToProps)(Universe);
