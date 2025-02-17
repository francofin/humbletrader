import React, {useContext, useState, useEffect} from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDropzone } from "react-dropzone";
import { DjangoAuthContext } from '@context/authContext';
import { Container, Row, Col, Card, Badge, Modal, Button, Form, ListGroup, Nav } from "react-bootstrap"
import { faCheck, faTimes, faDownload, faSearch, faAngleLeft, faAngleRight, faHeart } from "@fortawesome/free-solid-svg-icons"
import data from "@data/user-profile.json"
import CardRoom from "@components/CardRoom"
import Icon from "@components/Icon"
import Image from "@components/CustomImage"
import { isAuthenticatedUser } from '@utils/isAuthenticated';
import axios from 'axios';
import { useUserWatchList } from "@hooks/useWatchList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useWatchListCovar } from "@hooks/useCovarWatchList";
import { useWatchListLineChart } from "@hooks/useWatchListLineChart";
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
import { Line, Bar, Scatter } from 'react-chartjs-2';

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

export async function getServerSideProps({req}){
  const access_token = req.cookies.access;
  const user = await isAuthenticatedUser(access_token);

  if (!user){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  let userIsAuthenticated;
    if(access_token){
      userIsAuthenticated = await isAuthenticatedUser(access_token);
    }else{
      userIsAuthenticated =null
    }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/get_portfolio/`,{
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

  const userAnalysis = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/userwatchlistanalysis/`,{
    headers: {
        Authorization: `Bearer ${access_token}`
    },
  });

  const userYTDAnalysis = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/userytdanalysis/`,{
    headers: {
        Authorization: `Bearer ${access_token}`
    },
  });

  
  const watchlistAnalysis = userAnalysis.data;
    
  const watchList = res.data;

  const ytdAnalysis = userYTDAnalysis.data;



    return {
      props: {
        access_token,
        watchList,
        watchlistAnalysis,
        ytdAnalysis,
        userIsAuthenticated,
        nav: {
          light: true,
          classes: "shadow",
          color: "white",
        },
        loggedUser: true,
        title: "User Portfolio",
      }
    }
}

const UserProfile = ({access_token, watchList, watchlistAnalysis, ytdAnalysis, userIsAuthenticated}) => {
  const {user, loading, logout, updated, imageData,
    clearErrors, updateUser, setUpdated, avatar,removeFromWatchlist,
    error, handleImageUpload, handleImageRemove, getUserWatchlist} = useContext(DjangoAuthContext);

  
  const [preview, setPreview] = useState('/images/homeImages/simpleonthesurface.jpg');
  const [userImage, setUserImage] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null)
  const [userInfo, setUserInfo] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(false);
  const [firstName, setFirstName] = useState("")
  const [password, setPassword] = useState("")
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("")
  const [userWatchList, setuserWatchList] = useState([]);
  const [analysisLink, setAnalysisLink] = useState("/stock-data/[ticker]");
  const [linkAs, setLinkAs] = useState(`/stock-data/`)
  const router = useRouter();

  const [modal, setModal] = useState(false)

  const onClickModal = () => {
      setModal(!modal)
  }

  useEffect(() => {
      setUserInfo(user);
      setFirstName(user?.first_name);
      setLastName(user?.last_name);
      setPassword(user?.password);
      setEmail(user?.email)
      
  }, [user]);


  const watchListCalls = useUserWatchList(watchList);
  const ytdWatchlistAnalysis = ytdAnalysis?.data

  const {chartCreated:volChartUp, createChart:volChart} = useWatchListCovar(ytdWatchlistAnalysis?.contr_to_vol, ytdWatchlistAnalysis?.stocks)
  const {chartCreated:retChartUp, createChart:retChart} = useWatchListCovar(ytdWatchlistAnalysis?.contr_to_ret, ytdWatchlistAnalysis?.stocks)
  const {chartCreated:createdChart, createChart:chartData, chartOptions} = useWatchListLineChart(ytdWatchlistAnalysis?.dates, ytdWatchlistAnalysis?.prices)


  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
        setUserImage(acceptedFiles.map((file) => {
            // fileResizerAndUpload(file);
            
            setProfilePictureUrl(file);
            handleImageUpload(file);
            Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
              setPreview(file["preview"]);
              
            } 
        ),
      )
    },
  })


  const handleSubmit = (e) => {
    e.preventDefault();
 
    const formData = new FormData();
    
    formData.append("profile_picture_cs", avatar);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    console.log("Avatar", avatar)
    updateUser(formData, access_token)
}




const removeImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    formData.append("profile_picture_cs", "");
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    console.log("Avatar", avatar)
    updateUser(formData, access_token)

    handleImageRemove()
}

const adjustTimeStamp = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric"}
  return new Date(date).toLocaleDateString(undefined, options)
}

const removeStock = (e) => {
  if(userIsAuthenticated){
    removeFromWatchlist(e.target.text, access_token)
    // console.log(e.target.text)
    
  } else {
    swal({
      title: `You Must Create An Account In Order To Track Your Watch List. Thank You`,
      icon: "warning",
  });
  }
  
}

  return (
    <React.Fragment>
      <section className="d-flex align-items-center hero py-3 py-lg-7">
          <Image
            src={user?.profile_picture_cs ? user?.profile_picture_cs :preview}
            layout="fill"
            className="bg-image"
            alt="Stock Research"
            loading="eager"
            priority={true}
          />
          <Container className="py-6 py-lg-7 text-white overlay-content text-center">
            <Row>
              <Col xl="10" className="mx-auto">
   
                <h1 className="text-lg text-shadow mt-3"></h1>
              </Col>
            </Row>
          </Container>
        </section>
    
    <section className="py-5">
      <Container>
        <Row>
          <Col lg="3" className="me-lg-auto">
            <Card className="border-0 shadow mb-6 mb-lg-0">
              <Card.Header className="bg-gray-100 py-4 border-0 text-center">
                <div className="avatar avatar-xxl p-2 mb-2">
                <div className="position-relative h-100 overflow-hidden rounded-circle">
                    <Image
                    src={`/images/homeImages/fintank3.png`}
                    alt=""
                    width={144}
                    height={144}
                    layout="fixed"
                    />
                </div>
                </div>
                <h5>
                  {user?.first_name} {user?.last_name}
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-rounded icon-rounded-sm bg-primary-light me-2">
                    <Icon
                      icon="diploma-1"
                      className="text-primary svg-icon-md "
                    />
                  </div>
                  <div>
                    <p className="mb-0">{watchListCalls?.length} Stocks on WatchList</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div
                    className={`icon-rounded icon-rounded-sm ${
                      data.verified ? "bg-primary-light" : "bg-gray-200"
                    } me-2`}
                  >
                    <Icon
                      icon={data.verified ? "checkmark-1" : "close-1"}
                      className={`${
                        data.verified ? "text-primary" : "text-muted"
                      } svg-icon-md`}
                    />
                  </div>
                  <div>
                    <p className="mb-0">
                      {data.verified ? "Verified" : "Unverified"}
                    </p>
                  </div>
                </div>
                <hr />
                <h6>How To Add Stocks To Your WatchList</h6>
                <Card.Text className="text-muted" as="ul">
                  {data.provided.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Card.Text>
                <div
              style={{ top: "100px" }}
              className="p-4 shadow ms-lg-4 rounded sticky-top"
            >
              <p className="text-muted text-center">
                <span className="text-primary h5">
                  Price Performance Since Adding to Watchlist
                </span>{" "}
              </p>
              {watchlistAnalysis && watchlistAnalysis?.data?.map((stock, i) => {
                return (<div key={i}>
                        <hr className="my-1" />
                        <h5 className="text-sm text-center">
                        {stock.symbol}: {Number(stock?.return_since_addition) > 0 ? 
                        <span className="text-sm text-center" style={{color:'green'}}>
                        {Number(stock?.return_since_addition).toFixed(2)}%
                        </span> : 
                        <span className="text-sm text-center" style={{color:'red'}}>
                        {Number(stock?.return_since_addition).toFixed(2)}%
                        </span>}
                        </h5>
                      </div>)
              })}
              </div>
              </Card.Body>
            </Card>
            
          </Col>
          <Col lg="9" className="ps-lg-5">
            <h1 className="hero-heading mb-0">{`Welcome Back @${user?.first_name}!`}</h1>
            <div className="text-block">
              <p>
                <Badge bg="primary" text="secondary">
                  Joined in {adjustTimeStamp(user?.created_at)}
                </Badge>
              </p>
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
            <div className="text-block">
              <h4 className="mb-5">{`@${user?.first_name}'s WatchList`}</h4>
              <Row>
              {watchListCalls ?
              <ListGroup className="shadow mb-5">
              {watchListCalls?.map((stock, index) => (
                <Link href={analysisLink} as={`${linkAs}${stock.symbol}`} passHref key={index}>
                  <ListGroup.Item action className="p4" as="a">
                    <Row>
                      <Col lg="4" className="align-self-center mb-4 mb-lg-0">
                        <div className="d-flex align-items-center mb-3">
                          <h2 className="h5 mb-0">{stock.name}</h2>
                          {/* <Avatar
                            image={`/content/img/avatar/${booking.avatar}`}
                            size="sm"
                            className="ms-3  avatar-border-white"
                            cover
                            alt=""
                          /> */}
                        </div>
                        <Badge
                          bg={
                            stock.change > 0
                              ? "success" : "danger"
                          }
                          text={
                            stock.founded && "success"
                          }
                          className="p-2"
                          pill
                        >
                          Price: {stock.price}
                        </Badge>
                      </Col>
                      <Col lg="8">
                        <Row>
                          <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                            <h6 className="label-heading">Ticker</h6>
                            <p className="text-sm fw-bold">{stock.symbol}</p>
                            <h6 className="label-heading">Name</h6>
                            <p className="text-sm fw-bold">{stock.name}</p>
                          </Col>
                          <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                            <h6 className="label-heading">Change</h6>
                            <p className="text-sm fw-bold">%{stock.changesPercentage}</p>
                            <h6 className="label-heading">Price/Earnings</h6>
                            <p className="text-sm fw-bold">{stock.pe}</p>
                          </Col>
                          <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                            <h6 className="label-heading">Day High</h6>
                            <p className="text-sm fw-bold">{stock.dayHigh}</p>
                            <h6 className="label-heading">Day Low</h6>
                            <p className="text-sm fw-bold">{stock.dayLow}</p>
                          </Col>
                          <Col xs="12" lg="3" className="align-self-center">
                            {stock.earningsAnnouncement && 
                              <span
                              className={`${
                                stock.date_first_added ? "text-primary" : "text-muted"
                              } text-sm text-uppercase me-4 me-lg-0`}
                            >
                              <h6 className="label-heading">Earnings Announcement</h6>
                              <FontAwesomeIcon
                                icon={stock.earningsAnnouncement ? faCheck : faTimes}
                                className="me-2"
                              />
                              {adjustTimeStamp(stock.earningsAnnouncement)}
                            </span>
                            
                            }
                            <br className="d-none d-lg-block" />
                          </Col>
                          
                        </Row>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                    
                </Link>
                
              ))}
              </ListGroup>
              : ''}
              {watchListCalls && (
                  <React.Fragment>
                    <h5>Click to Remove Stock From Watchlist</h5>
                    <Nav className="nav-pills-custom">
                      {watchListCalls?.map((stock, index) => (
                        <Nav.Item key={stock.symbol}>
                          <Button
                            variant="link"
                            key={stock.symbol}
                            onClick={(e) => removeStock(e)}
                            >
                            <Nav.Link>
                              {stock.symbol}
                            </Nav.Link>
                          </Button>
                        </Nav.Item>
                      ))}
                    </Nav>
                  </React.Fragment>
                )}
              </Row>
              <Row>
              {(volChartUp && retChartUp && watchListCalls) &&
               
                <React.Fragment>
                  <h4 className="mb-5">WatchList Analyis</h4>
                  <Row className="pt-3">
                    <Col lg="6">
                        <div>
                          <h5 className="mb-3">Contribution To Watchlist Volatility </h5>
                        </div>
                      <Bar options={barOptions} data={volChart} height={400} width={300}/>
                    </Col>
                    <Col lg="6">
                        <div>
                          <h5 className="mb-3">Contribution to Watchlist Return</h5>
                        </div>
                      <Bar options={barOptions} data={retChart} height={400} width={300}/>
                    </Col>
                  </Row>
                </React.Fragment>}
                </Row>
                <Row>
                {(createdChart && watchListCalls) &&
                  <section className="py-4 bg-gray-100">
                    <div className="text-block">
                        <h6 className="mb-3">{`@${user?.first_name}'s WatchList Price Moves`}</h6>
                      </div>
                      <Container>
                    
                        <Row className="pt-3">
                          <Col lg="12">
                            <Line options={chartOptions} data={chartData} height={100} width={200}/>
                          </Col>
                        </Row>
                    </Container>
                  </section>}
                </Row>
            </div>
            {/* <div className="text-block">
              <Reviews data={data.reviews} />
              <ReviewForm />
            </div> */}
          </Col>
        </Row>
      </Container>
    </section>
    </React.Fragment>
  )
}

export default UserProfile
