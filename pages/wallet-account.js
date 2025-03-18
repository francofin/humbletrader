import React, {useContext, useState, useEffect} from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDropzone } from "react-dropzone";
import { useUserAccounts } from "@hooks/useAccounts";
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
import { Wallet as XrplWallet } from "xrpl";
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



const UserAccount= () => {

    const [preview, setPreview] = useState('/images/homeImages/simpleonthesurface.jpg');
      const [userImage, setUserImage] = useState([]);
      const [profilePictureUrl, setProfilePictureUrl] = useState(null)
      const [userInfo, setUserInfo] = useState(null);
      const [updateInfo, setUpdateInfo] = useState(false);
      const [seed, setSeed] = useState("")
      const [newSeed, setNewSeed] = useState("")
      const [addressGenerated, setAddressGenerated] = useState("")
      const [userWatchList, setuserWatchList] = useState([]);
      const [analysisLink, setAnalysisLink] = useState("/stock-data/[ticker]");
      const [linkAs, setLinkAs] = useState(`/stock-data/`)
      const {addAccount} = useUserAccounts();
      const router = useRouter();
    
      const [modal, setModal] = useState(false)
      const [modalGenerate, setModalGenerate] = useState(false)

    
      const onClickModal = () => {
          setModal(!modal)
      }

      const onClickModalGenerate = () => {
        setModalGenerate(!modalGenerate)
    }

      const adjustTimeStamp = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric"}
        return new Date(date).toLocaleDateString(undefined, options)
      }

      const handleSeedChange = (event) => {
        setSeed(event.target.value);
      }

      const handleImportAccount = (event) => {
        event.preventDefault();
        const newAccount = XrplWallet.deriveWallet(seed);
        const account = {address: newAccount.classicAddress, seed: newAccount.seed}
        addAccount(account);
        swal({
            title: `Success, You have successully Added Your Accounts`,
            icon: "success",
        });
      }

      const handleGenerateAddress = (event) => {
        event.preventDefault();
        const newWallet = XrplWallet.generate();
        setNewSeed(newWallet.seed);
        setAddressGenerated(newWallet.classicAddress);
        swal({
            title: `Success, You have successully Generated an address`,
            icon: "success",
        });
      }

      const handleSave = (event) => {
        event.preventDefault();
     
        const account = {address:addressGenerated, seed: newSeed}
        addAccount(account);
        swal({
            title: `Success, You have successully Added Your Accounts`,
            icon: "success",
        });
      }

      const handleCancel = () => {
        setNewSeed("");
      }

      //derive address with seed, create new account object, add account to app state, add app to local storage

    return (
        <React.Fragment>
          <section className="d-flex align-items-center hero py-3 py-lg-7">
              <Image
                src={preview}
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
                      Wallet Address
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
                        <p className="mb-0">Coins on WatchList</p>
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
                    <Button variant="primary" onClick={onClickModal}>
                        Import Accounts
                    </Button>
                    <Modal show={modal} onHide={onClickModal}>
                        <Modal.Header closeButton>
                            <Modal.Title className="text-uppercase" as="h6">
                            Account Import
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="text-muted">
                            <strong>XRP Wallet</strong> Import your accounts{" "}
                            <a href="#">More Info on our Screener</a>
                            </p>
                            <div className="w-100 py-2 px-md-2 px-xxl-2 position-relative">
                            
                                <Form className="form-validate" onSubmit={handleImportAccount}>
                                <Row className="min-vh-20">
                                <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                                    <div className="mb-4">
                                    <Form.Label htmlFor="loginUsername">Family Seed</Form.Label>
                                    <Form.Control aria-label="Default select example" type="text" required onChange={handleSeedChange} value={seed}> 
    
                                    </Form.Control>
                                    </div>
                                </Col>
                                </Row>                     
                                <div className="d-grid">
                                    <Button type="submit">Import</Button>
                                </div>
                                </Form>
                                
                                <hr data-content="Get More Information" className="my-3 hr-text letter-spacing-2" />
                                <hr className="my-4" />
                                <p className="text-sm text-muted">
                                {`See our Disclosures For more information using wallet select.`}{" "}
                                <a href="#">Terms and Conditions</a> and{" "}
                                <a href="#">Privacy Policy</a>.
                                </p>
                            </div>
                            
                        </Modal.Body>
                        <Modal.Footer className="justify-content-end">                  
                            <Button variant="outline-muted" onClick={onClickModal}>
                            Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <hr/>
                    <Button variant="success" onClick={onClickModalGenerate}>
                        Generate New Account
                    </Button>
                    <Modal show={modalGenerate} onHide={onClickModalGenerate}>
                        <Modal.Header closeButton>
                            <Modal.Title className="text-uppercase" as="h6">
                            Generate New Account
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="text-muted">
                            <strong>XRP Wallet</strong> Generate Account{" "}
                            <a href="#">This will create a new seed and rAddress, but you will need to save to add it to your account. Send some XRP to activate it.</a>
                            </p>
                            <div className="w-100 py-2 px-md-2 px-xxl-2 position-relative">
                            
                                <Form className="form-validate" onSubmit={handleImportAccount}>
                                <Row className="min-vh-20">
                                <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                                    <div className="mb-4">
                                    <Form.Label htmlFor="loginUsername">Family Seed</Form.Label>
                                    <p className="text-muted">
                                        <strong>Addresss: {addressGenerated}</strong>.{" "}
                                    </p>
                                    <p className="text-muted">
                                        <strong>Family Seed: {newSeed}</strong>.{" "}
                                    </p>
                                    </div>
                                </Col>
                                </Row>
                                <div className="d-grid mb-2">
                                    <Button onClick={handleGenerateAddress} variant="success">Generate new account</Button>
                                </div>

                                <div className="d-grid mb-2">
                                    <Button onClick={handleSave}>Save to Wallet</Button>
                                </div>
                                <div className="d-grid">
                                    <Button variant="warning" onClick={handleCancel}>Cancel</Button>
                                </div>
                                </Form>
                                
                                <hr data-content="Get More Information" className="my-3 hr-text letter-spacing-2" />
                                <hr className="my-4" />
                                <p className="text-sm text-muted">
                                {`See our Disclosures For more information using wallet select.`}{" "}
                                <a href="#">Terms and Conditions</a> and{" "}
                                <a href="#">Privacy Policy</a>.
                                </p>
                            </div>
                            
                        </Modal.Body>
                        <Modal.Footer className="justify-content-end">                  
                            <Button variant="outline-muted" onClick={onClickModal}>
                            Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                  </p>
                  {/* {watchlistAnalysis && watchlistAnalysis?.data?.map((stock, i) => {
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
                  })} */}
                  </div>
                  </Card.Body>
                </Card>
                
              </Col>
            </Row>
          </Container>
        </section>
        </React.Fragment>
      )

}


export default UserAccount;