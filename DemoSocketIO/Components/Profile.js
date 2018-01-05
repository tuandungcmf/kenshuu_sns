import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';

import io from 'socket.io-client/dist/socket.io.js';

var e;


export default class Profile extends Component {
  //Server
  constructor(props){
    super(props);
    e = this;
    this.socket = io('http://localhost:3000', {jsonp:false});
    this.state ={
      maunen: 'green',
      text: '...'
    }
    this.socket.on('server-send-color',function(data){
      e.setState({
        maunen:data,
        text:data
      });
    });
  }
  clickme(){
    this.socket.emit('client-sent-color', this.state.text);
  }
  render() {
    return (
      <View style={{ padding:50,flex: 1,backgroundColor: this.state.maunen}}>
        <Text>SOCKET IO</Text>
        <TextInput
          style={{height: 40, borderColor: '#fff', borderWidth: 1, padding:10}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
        <TouchableOpacity
          onPress={()=>this.clickme()}
          style={{marginTop:10,height: 40, borderColor: '#000', borderWidth: 1, padding:10}}>
          <Text>Change</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});
