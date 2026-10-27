import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaBoxOpen, FaChartLine, FaMoneyBill, FaPen, FaStar, FaUser } from "react-icons/fa";
import { FaClockRotateLeft, FaGear, FaRightFromBracket } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../components/store/slices/userSlices";
import { TiUserDelete } from "react-icons/ti";

export default function UserProfile() {

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  console.log("Profile user:", user);

    function handleLogout() {
      
      //remove auth data + session persistence
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("staySignedIn");
      localStorage.removeItem("loginTime");
  
      //clear redux states
      dispatch(logout());
  
      //refresh back to home
      window.location.href = "/";
    }

    function deleteAccount(){
      localStorage.removeItem("registeredUser");
      //clear redux states
      dispatch(logout());

      //refresh back to home
      window.location.href = "/";
    }

  return (
    <Container className="mt-5">
      <Row className="g-4">
        <Col lg={3}>
          <Card>
              
  
              <Card.Body>
                <div>
                  <h6 className="fw-bold mb-0 text-primary">Account</h6>
                  <small className="text-muted">Manage your settings</small> 
                </div>

                <hr />

                <Button variant="primary" className="w-100 text-start d-flex align-items-center mb-2 gap-2"><FaUser /> My profile</Button>
                <Button variant="link" className="w-100 text-start text-decoration-none d-flex align-items-center mb-2 gap-2"><FaClockRotateLeft /> Order History</Button>
                <Button variant="link" className="w-100 text-start text-decoration-none d-flex align-items-center mb-2 gap-2"><FaGear /> Account Settings</Button>

                <hr className="my-4"/>

                <Button variant="link" className="w-100 text-start text-danger text-decoration-none d-flex align-items-center mb-2 gap-2" onClick={handleLogout}><FaRightFromBracket /> Sign out</Button>
                <Button variant="link" className="w-100 text-start text-danger text-decoration-none d-flex align-items-center mb-2 gap-2" onClick={deleteAccount}><TiUserDelete /> Delete Account</Button>
              </Card.Body>
          </Card>
        </Col>
        <Col lg={9}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <div>
                    <h2 className="fw-bold mb-1">{user?.fullName}</h2>
                    <p className="text-muted mb-2">{user?.email}</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge rounded-pill px-3 py-2 bg-success">Premium member</span>
                      <span className="badge rounded-pill px-3 py-2 bg-light text-dark">Member since 2026</span>
                    </div>
                  </div>
                </Col>
                <Col md={4} >
                <Button variant="primary" className="w-100 mb-2"> <FaPen className="me-2" /> Edit Profile</Button>
                <Button variant="outline-primary" className="w-100"><FaChartLine className="me-2" /> View Analytics</Button>
                </Col>
              </Row>  
            </Card.Body>
          </Card>
          <Row className="gap-3 mb-4">
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-center rounded-2" style={{width:"40px", height:"40px", backgroundColor:"hsla(243, 75%, 59%, 0.20)"}}>
                    <FaBoxOpen />
                  </div>
                  <small className="mb-2">Total orders</small>
                  <h4 className="fw-bold mb-0">24</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-center rounded-2" style={{width:"40px", height:"40px", backgroundColor:"#6CF8BB33"}}>
                    <FaMoneyBill />
                  </div>
                  <small className="mb-2">Wallet Balance</small>
                  <h4 className="fw-bold mb-0">$1,248.50</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-center rounded-2" style={{width:"40px", height:"40px", backgroundColor:"hsla(243, 75%, 59%, 0.20)"}}>
                    <FaStar />
                  </div>
                  <small className="mb-2">Loyalty Points</small>
                  <h4 className="fw-bold mb-0">4,800</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
