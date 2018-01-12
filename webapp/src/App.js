import React from 'react';

import io from 'socket.io-client';
import './App.css';

export default class App extends React.Component {
   constructor(props) {
       super(props);
       //begin with state,
       this.state = {
           messages: [], // msg list
           user: {id: '', name: ''},
           userOnline:[]
       }
       this.socket = null;
   }
   //Connect to server nodejs
   componentWillMount() {
       console.log(this.state.user)
       this.socket = io('localhost:8000');

       this.socket.on('sentMsg', (response) => {this.setState({messages: response})}); //listen with new message

       this.socket.on('loginFail', (response) => {alert('Username is used !')}); //login fail
       this.socket.on('loginSuccess', (response) => {this.setState({user: {id: this.socket.id, name: response}})}); //login ok
       this.socket.on('updateUserList', (response) => {this.setState({userOnline: response})}); //update users list
       this.socket.on('server-sent-channel',  (response) => {this.setState({listChannel: response})});
       this.socket.on('server-sent-channel-socket', (response) => {this.setState({channelSocketInfo: response})});


   }

   //sent event socket newMessage with data is message
   sendnewMessage() {
       this.socket.emit("newMessage", this.refs.messageInput.value); //sent event to server
   }

   login() {
       this.socket.emit("login", this.refs.name.value);
   }

   newroom(){
        this.socket.emit("newroom", this.refs.txtRoom.value);
   }

   render () {
        return (
           <div className="app__content">
               <div className="left">
                   <h3>CHANNEL:</h3>
                   <div className="listChannel">
                      {this.state.listChannel}
                   </div>
               </div>
               <h4 className="currentChannel">{this.state.channelSocketInfo}</h4>
          {/* check user */}
              { this.state.channelSocketInfo ?
                <div className="chat_window">
                    {/*  user online */}
                    <div className="top_menu">
                        <ul className="user">
                        <span className="user-name">{this.state.user.name}</span>
                            <p>Online</p>
                            {this.state.userOnline.map(item =>
                                <li key={item.id}><span>{item.name}</span></li>
                            )}
                        </ul>
                    </div>
                {/* message */}
                    <div className="content">
                        {this.state.messages}
                        <div className="">
                            <div className="bottom_wrapper">
                                <div  className="message_input_wrapper">
                                     <input ref="messageInput" type="text" className="message_input" placeholder="Type your message here" />
                                </div>
                                <div className="send_message" onClick={this.sendnewMessage.bind(this)} >
                                     <div className='icon'></div>
                                     <div className='text'>Send</div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                :
                  <div className="login_form">{/* form login */}
                      <input type="text" name="name" ref="name"></input>
                      <input type="button" name="" value="Login" onClick={this.login.bind(this)}></input>
                      <input type="text" name="txtRoom" ref="txtRoom"></input>
                      <input type="button" name="" value="New Room" onClick={this.newroom.bind(this)}></input>
                  </div>
              }
            </div>
        )
    }
}
