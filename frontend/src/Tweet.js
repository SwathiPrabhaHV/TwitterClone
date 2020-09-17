import React from 'react';
import like from './like.png';
import './Tweet.css';
import axios from 'axios';
import moment from 'moment';
import io from 'socket.io-client';

class Tweet extends React.Component{
  constructor(props){
    super(props);
    this.state=({
      likes:this.props.tweet.likes
    })
    this.handleLike=this.handleLike.bind(this);
    
  }
    
 component

  handleLike(e){
    e.preventDefault();
    var tweet=this.props.tweet;
    axios.post('/likes', tweet)
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
  }
  render(){
    const tweet=this.props.tweet;
    const _id=this.props._id;
  var username="";
    if(tweet.username.username!==undefined)
      username=tweet.username.username;
      else {
        username=tweet.username;
      }
      return(
        
        <div className="tweet">
          <strong>{username} </strong> . <span>{moment(tweet.createdAt).format('MMM Do YYYY')}</span>
          
      <p>{tweet.tweet} </p>
          
          <button  type="button" onClick={this.handleLike}>
              <img src={like} alt="Like" />
                {tweet.likes}
          </button> 
        </div>
      );
  }
}
export default Tweet;
