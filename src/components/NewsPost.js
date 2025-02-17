import React from "react"
import Link from "next/link"
import Image from "./CustomImage"

import { Card, Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons"

const NewsPost = (props) => {
  const post = props.data

  const adjustTimeStamp = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(date).toLocaleDateString(undefined, options)
  }

  return (
    <Card className="border-0 h-100 shadow">
      <Link href={`${post.url}`}>
        <a className="">
          <Image
            src={`/api/imagefetcher?url=${encodeURIComponent(post.image)}`}
            alt="..."
            width={1080}
            height={720}
            layout="intrinsic"
            className="img-fluid card-img-top"
            loading={props.eager ? "eager" : "lazy"}
          />
        </a>
      </Link>
      <Card.Body>
        <a
          href="#"
          className="text-uppercase text-muted text-sm letter-spacing-2"
        >
          {post.site}
        </a>
        <h5 className="my-2">
          <Link href={`${post.url}`}>
            <a className="text-dark" target="_blank">{post.title}</a>
          </Link>
        </h5>
        <p className="text-gray-500 text-sm my-3">
          <FontAwesomeIcon icon={faClock} className="me-2" />
          {adjustTimeStamp(post.publishedDate)}
        </p>
        <p className="my-2 text-muted text-sm">{post.text.substring(0, 115) + "..."}</p>
        <Link href={`${post.url}`} passHref>
          <Button className="ps-0" variant="link" target="_blank">
            Read more <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Button>
        </Link>
      </Card.Body>
    </Card>
  )
}

export default NewsPost
