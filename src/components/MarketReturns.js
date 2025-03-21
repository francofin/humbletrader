import React from "react"
import Link from "next/link"
import { Card } from "react-bootstrap"
import Icon from "./Icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowTrendDown, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons"

const MarketReturns = (props) => {


  return (
    <Card className="h-100 border-0 shadow">
      <div className="card-img-top overflow-hidden my-2 px-3" >
        {props.data.changesPercentage > 0 ?
          <FontAwesomeIcon icon={faArrowTrendUp} size="6x" pull="left" style={{color:"green"}}/> :
          <FontAwesomeIcon icon={faArrowTrendDown} size="6x" pull="left" style={{color:"red"}}/>
        }
      
        <Link href="/detail-rooms">
          <a
            className="tile-link"
            // aria-label={`Read more about ${data.title}`}
          />
        </Link>
        <div className="card-img-overlay-top text-end">
          <a
            className="card-fav-icon position-relative z-index-40"
            href="#"
            // aria-label={`Add ${data.title} to wishlist`}
          >
            <Icon icon="heart-1" className="text-white" />
          </a>
        </div>
      </div>
      <hr />
      <Card.Body className="d-flex align-items-center">
        <div className="w-100">
          <Card.Title as="h6">
            <Link href="#">
              <a className="text-decoration-none text-dark">{props.data.symbol}</a>
            </Link>
            <p>
              {props.data.name}
            </p>
          </Card.Title>
          <Card.Subtitle className="d-flex mb-3" as="div">
            {props.data.changesPercentage > 0 ?
                <p className="flex-grow-1 mb-0 text-md" style={{color:"green"}}>
                {(props.data.changesPercentage).toFixed(2)}% 
              </p>:
              <p className="flex-grow-1 mb-0 text-md" style={{color:"red"}}>
              {(props.data.changesPercentage).toFixed(2)}% 
            </p>
            }
            
            <p className="flex-shrink-1 mb-0 card-stars text-xs text-end">
              {/* <Stars stars={data.stars} /> */}
            </p>
          </Card.Subtitle>
          <Card.Text className="text-muted">
            <span className="h4 text-primary">${(props.data.price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  )
}

export default MarketReturns
