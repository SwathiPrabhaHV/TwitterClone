import React from 'react';
import './Timeline.css';
import Tweet from './Tweet';
import axios from 'axios';
// import './Tweet.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {withRouter} from 'react-router-dom';
import io from 'socket.io-client';
import FlashMessage from 'react-flash-message';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

 class Timeline extends React.Component{
  constructor(props){
    super(props);
    this.state={
      tweets:[],
      author:"",
      username:"",
      flash:false,
      message:""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadData=this.loadData.bind(this);
    this.socket= io('http://localhost:5000');
    this.subscribeToEvents=this.subscribeToEvents.bind(this);

  }

  componentDidMount(){
      this.loadData();
  }

  subscribeToEvents = () => {

  
    this.socket.on('send_tweet', data => {
    
        this.setState({ tweets: [data, ...this.state.tweets] });
    });
        this.socket.on('send_likes', data => {
          this.setState({
              tweets: this.state.tweets.map(tweet => tweet._id === data._id ? data : tweet)
          });
      });
    
  };

  loadData(){
     this.subscribeToEvents();
     axios.get('/tweets')
     .then((res)=>{
       
       if(typeof(res.data) !== "string"){
        this.setState({
            author:res.data.pop(),
            tweets:res.data
        })
      }
      else{
        this.setState({
          flash:true,
          message:res.data
        })
      }
     })
    
     .catch(err=>console.log(err))
     
  }

  handleSubmit(e){
    e.preventDefault();
    const form=document.forms.post;
    const post={
      tweet:form.tweet.value,
      username:this.state.author
    }
    if(post.tweet.length<280){
    axios.post('/tweets', post)
      .then(res =>  {
        if(res.status===200){
            

        }
      })
      .catch(err=>{
          if(err){
            this.setState({flash:true,message:err.data});
            console.log(err);

          }
        });
        form.tweet.value="";
      }
      else{
        this.setState({
          flash:true,
          message:"Post Limit of 280 characters exceeded"
        })
      
      }
    
  }

  render(){
    var tweets=this.state.tweets.map((array)=>
    <Tweet key={array._id} tweet={array}/>
  );
  console.log(this.state.tweets);
    return(
      <div  className="timeline-wrapper">
        
          <Container fluid>
            <Form name="post" onSubmit={this.handleSubmit}>
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
              <Col xs="12">
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Hi,{this.state.author}</Form.Label>
                    <Form.Control as="textarea" name="tweet"rows="1" placeholder="What is going on?" />
                </Form.Group>
              </Col>
              <Button className="timeline-button" variant="primary" type="submit">
                  Post
              </Button>
            </Form>
            </Container>
           
            <div className="tweet-list">
              {tweets}
            </div>
            
    
      </div>
    );
  }
}
export default withRouter(Timeline);
