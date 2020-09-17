import React from 'react';
import './Login.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import {Redirect} from 'react-router-dom';
import Login from './Login';
import {withRouter} from 'react-router-dom';
import FlashMessage from 'react-flash-message';

class Register extends React.Component{
  constructor(props) {
  super(props);
  this.state={
    flash:false,
    message:""
  };
  this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    const form=document.forms.login;
    const newUser={
      username:form.username.value,
      email:form.email.value,
      password:form.password.value,
      confirmPassword:form.confirmPassword.value
    }
    console.log(newUser.test);
    //Validation before post
    if(newUser.password==="" || newUser.confirmPassword==="" || newUser.username==="" ||  newUser.email===""){
      this.setState({
        flash:true,
        message:"Please fill in all the fields"
      });
    }
    else if(newUser.password!==newUser.confirmPassword)
      this.setState({
        flash:true,
        message:"Passwords doesnot match"
      });
    else if(newUser.password.length<8)
      this.setState({
        flash:true,
        message:"Password must be more than 8 characters long"
      })
    console.log(newUser);
    if(!this.state.flash){
    axios.post('/register', newUser)
      .then(res =>  {
        if(res.status===200){
         
          this.props.history.push('/login');
          
        }
        
      })
      .catch(err=>{
        if(err){
          console.log(err);
          this.setState({
            flash:true,
            message:err.response.data
          });
        }
      });
    }
   form.username.value="";
   form.email.value="";
   form.password.value="";
   form.confirmPassword.value="";
 }

  render(){
      var flash=this.state.flash;
      return(
        <div className='login-wrapper'>
        <Form name="login" onSubmit={this.handleSubmit}>
        {
          flash &&
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

            <Form.Group  controlId="formEmail">
              <Col xs={12}>
                <Form.Label>Email address</Form.Label>
                <Form.Control name="email" type="email" placeholder="Enter email address" />
              </Col>
            </Form.Group>

            <Form.Group  controlId="formPassword">
              <Col xs={12}>
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Password" />
              </Col>
            </Form.Group>

            <Form.Group  controlId="formConfirmPassword">
              <Col xs={12}>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control name="confirmPassword" type="password" placeholder="Confirm Password" />
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          </div>
    );
  }
}
export default withRouter(Register);
