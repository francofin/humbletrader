import React from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  InputGroup,
  Breadcrumb,
  Form,
  Button,
} from "react-bootstrap"
import data from "@data/knowledge-base.json"
import Link from "next/link"
import Support from "@components/Support"
import Icon from "@components/Icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleRight, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faFile } from "@fortawesome/free-regular-svg-icons"
import axios from 'axios';
import Image from "@components/CustomImage"
import CardPost from "@components/CardPost"

export async function getServerSideProps() {

    const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/journals/`);
  // console.log(res)
    const data = res.data;
  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: "Knowledge base",
      data
    },
  }
}

const KnowledgeBase = (props) => {
  const articles = props.data.indexes
  return (
    <React.Fragment>
        <section className="d-flex align-items-center dark-overlay">
          <Image
            src={`/images/homepageImages/research2.jpg`}
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
                  {`Research Articles`}
                </h1>
                <p className="text-lg text-shadow mt-3">A Collection of Interesting reads to learn and master different topics</p>
              </Col>
            </Row>
          </Container>
        </section>
      <section className="hero py-5 py-lg-7">
        <Container className="position-relative">
          <Breadcrumb
            listProps={{
              className: "ps-0 justify-content-center",
            }}
          >
            <Link href="/" passHref>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>{props.title}</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="hero-heading">Knowledge Base</h1>
          <Row>
            <Col xl="8" className="mx-auto">
              <Form>
                <p className="text-muted mb-4">
                  The Following are links that I have found interesting and have allowed me to understand different topics pertaining
                  to Finance, Programming, mostly in python, Quantitative Investing, Data Science and Different areas of Macro
                  Economic Analysis.
                </p>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row className="mb-5">
            {articles &&
                articles.map((post, index) => {
                  // the first post is featured
                  if (index >= 0)
                    return (
                      <Col
                        key={index}
                        sm="6"
                        lg="4"
                        className="mb-4 hover-animate"
                      >
                        <CardPost data={post} index={index} />
                      </Col>
                    )
                })}
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default KnowledgeBase
