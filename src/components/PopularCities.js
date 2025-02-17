import React from "react"
import Link from "next/link"
import { Container, Row, Col, Card } from "react-bootstrap"
import data from "@data/popular_cities.json"
import Image from "./CustomImage"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons"
import marketImages from "@data/markets.json"

const PopularCities = (props) => {
 
  const getRandomIndexNumber = () => {
    let imageDataLength = props.topicImage.length;
    let randomIndex = Math.floor(Math.random() * imageDataLength)
    return randomIndex
  }


  return (
    <section className={`py-6 ${props.greyBackground ? "bg-gray-100" : ""}`}>
      <Container>
        <Row className="mb-5">
          <Col md="8">
            <p className="subtitle text-primary">{props.subTitle}</p>
            <h2>{props.title}</h2>
          </Col>
          <Col
            md="4"
            className="d-md-flex align-items-center justify-content-end"
          >
            {/* Maybe Ad Space */}
            {/* {data.buttonLink && (
              <Link href={data.buttonLink}>
                <a className="text-muted text-sm">
                  {data.button}
                  <FontAwesomeIcon icon={faAngleDoubleRight} className="ms-2" />
                </a>
              </Link>
            )} */}
          </Col>
        </Row>
        <Row>
          {props.blockStories &&
            props.blockStories.map((story, index) => (
              <Col
                key={index}
                lg={index === 0 ? "8" : "4"}
                className="d-flex align-items-lg-stretch mb-4"
              >
                <Card className="shadow-lg border-0 w-100 border-0 hover-animate overflow-hidden">
                  <Image
                    src={`/images/${props?.topicImage[getRandomIndexNumber()]?.img}`}
                    layout="fill"
                    alt="Card image"
                    className="bg-image"
                  />
                  <Link href={story.url}>
                    <a className="tile-link" />
                  </Link>
                    <Card.Header className="mt-3 border-0 py-0 position-relative d-flex align-items-center text-white justify-content-center h-50" style={{background:"rgba(78,78,78,0.5)"}}>
                        <div>
                          <h6 className="mb-0" dangerouslySetInnerHTML ={{__html: `${story.description ?story.description.slice(0,100) : story.text.slice(0,100)}....`}} />
                        </div>
                    </Card.Header>
                    <div className="d-flex align-items-center text-white bold justify-content-center py-6 py-lg-7 position-relative">
                        <p className="text-uppercase mb-0" dangerouslySetInnerHTML={{__html: `Source: ${story.provider ? story.provider[0].name : story.site}`}} />
                    </div>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </section>
  )
}

export default PopularCities
