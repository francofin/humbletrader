import React, {useState} from "react"
import Link from "next/link"
import { Card, Badge } from "react-bootstrap"
import Stars from "@components/Stars"
import Image from "./CustomImage"
import Icon from "./Icon"
import marketImages from "@data/markets.json"

const CardNews = (props) => {
  const data = props.data
  const [articleData, setArticleData] = useState(data)


  // useEffect(() => {
  //   setArticleData(data)

    
  // }, [data])

//   console.log("props", articleData)


  return (
    <Card className="h-100 border-0 shadow">
      <div
        style={{
          minHeight: "200px",
        }}
        className="card-img-top overflow-hidden dark-overlay"
      >
        {articleData?.image.thumbnail ? 
        <Image
        src={`${articleData?.image ? `/api/imagefetcher?url=${encodeURIComponent(articleData?.image.thumbnail.contentUrl)}` :`/images/${marketImages.marketImages[5].img}`}`}
        layout="fill"
        className="bg-image"
        alt={data?.name}
        sizes={
          props.sizes
            ? props.sizes
            : "(max-width:576px) 100vw, (max-width:991px) 50vw, 280px"
        }
      /> : 
      <Image
          src={`${articleData?.image ? `/api/imagefetcher?url=${encodeURIComponent(articleData?.image)}` :`/images/${marketImages.marketImages[5].img}`}`}
          layout="fill"
          className="bg-image"
          alt={data?.name}
          sizes={
            props.sizes
              ? props.sizes
              : "(max-width:576px) 100vw, (max-width:991px) 50vw, 280px"
          }
        />}
        
        <Link href={data?.url}>
          <a className="tile-link" />
        </Link>
        <div className="card-img-overlay-bottom z-index-20">
          <h5 className="text-white text-shadow" dangerouslySetInnerHTML={{__html: `${data?.name ? data?.name.slice(0,15) : data?.title.slice(0,15)}`}} />
          <p className="text-white mb-2 text-xs" dangerouslySetInnerHTML ={{__html: `${data?.provider ? data?.provider[0].name: data?.site}`}} />
        </div>
        <div className="card-img-overlay-top d-flex justify-content-between align-items-center">
          <Badge pill bg="transparent" className="px-3 py-2">
            {data?.category ? data?.category : " "}
          </Badge>
        </div>
      </div>
      <Card.Body>
        <p className="text-sm text-muted mb-3" dangerouslySetInnerHTML ={{__html: `${data?.description ? data?.description.substring(0, 115) + "..." : data?.text.substring(0, 115) + "..."}`}} />
          
        {/* <p className="text-sm mb-0">
          {data.tags.map((tag, index) => (
            <a key={index} className="me-1" href="#">
              {tag}
              {index < data.tags.length - 1 && ","}
            </a>
          ))}
        </p> */}
      </Card.Body>
    </Card>
  )
}

export default CardNews
