import React from 'react';
import './Login.css';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import {withRouter} from 'react-router-dom';
import FlashMessage from 'react-flash-message';
import Alert from 'react-bootstrap/Alert';
import {Link} from 'react-router-dom';


class Login extends React.Component{
  constructor(props) {
    super(props);
   var isLoggedIn=this.props.isLoggedIn;
    isLoggedIn=true;

    this.state={
    flash:false,
    message:""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

handleSubmit(e){
  e.preventDefault();
  const form=document.forms.login;
   const login={
    username:form.username.value,
    password:form.password.value,
  }
  axios.post('/login', login)
    .then(res =>  {
      if(res.status===200){
        this.props.history.push('/tweets');
      }
    })
    .catch(err=>{
        if(err){
          this.setState({
            flash:true,
            message:err.response.data
          });
        }
      });
  }

  render(){
      return(
        <div className="login-wrapper">
              <Form name="login" onSubmit={this.handleSubmit}>
              {
                this.state.flash &&
                <div>
                  <Alert variant="danger">
                    <FlashMessage duration={50000000}>
                        <strong>{this.state.message}</strong>
                    </FlashMessage>
                  </Alert>
              </div>
            }
            <Form.Group controlId="formUsername" >
              <Col xs={12}>
                <Form.Label>Username</Form.Label>
                <Form.Control name="username" type="text" placeholder="Enter username" />
              </Col>
            </Form.Group>

            <Form.Group  controlId="formPassword">
              <Col xs={12}>
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Password" />
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <span>Not a member? </span><Link to="/register">Sign up</Link>
          </div>
    );
  }
}
export default withRouter(Login);
