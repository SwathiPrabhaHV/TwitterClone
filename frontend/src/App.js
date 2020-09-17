import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';
import './Tweet.css';
import {BrowserRouter as Router,
        Switch,
        Link,
        Route,
        Redirect} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Timeline from './Timeline';
class  App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isLoggedIn:true
    }
  }

    render(){
      let button;
      if(this.state.isLoggedIn){
        button=  <Nav className="mr-auto">
        <Nav.Link href="/login">Login </Nav.Link>
        <Nav.Link href="/register">Signup</Nav.Link>
        </Nav>

      }
      else{
        button=<Nav className="mr-auto">
          <Nav.Link href="/login">Logout</Nav.Link>
          </Nav>
      }
     
      return(
        <Router>
          <div>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="/login" >Twitter</Navbar.Brand>
                {button}
              </Navbar>
              <Switch>
            <Route path='/login'><Login isLoggedIn={this.state.isLoggedIn}/></Route>
            <Route path='/register'><Register /></Route>
            <Route path='/tweets'><Timeline /></Route>
            <Redirect from="/" to="/login" />
          </Switch>
      </div>
    </Router>
        );
      }
}

export default App;
