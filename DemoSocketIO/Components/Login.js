import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  AsyncStorage
} from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
var e;
export default class Login extends Component {
  //Server
  constructor(props){
    super(props);
    e = this;
    this.socket = io('http://localhost:3000', {jsonp:false});
    this.state ={
      username:'',
      password:''
    }
    this.socket.on('server-send-color',function(data){
      e.setState({
        maunen:data,
        text:data
      });
    });
  }
  clickme(){
    this.socket.emit('client-sent-color', {
      userId: this.state.username,
      passWord: this.state.password
    });
  }


  componentDidMount(){
    this._loadInitialState().done();
  }

  _loadInitialState = async () =>{
    var value = await AsyncStorage.getItem('user');
    if(value !== null){
      this.props.navigation.navigate('Profile');
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <KeyboardAvoidingView behavior="padding">
              <StatusBar
                barStyle="light-content"
              />
              <View style={styles.logoContainer}>
                <Image source={{uri: 'https://trycode.jp/favicon.ico'}}
                style={styles.logo} />
                <Text style={styles.title}>研修SNS</Text>
              </View>
              <View style={styles.loginForm}>
                <TextInput
                  style={styles.input}
                  returnKeyType="next"
                  placeholder="Username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={this.state.username}
                  onChangeText = { (username) => this.setState({username}) }
                  onSubmitEditing={()=>this.passwordInput.focus()}
                />
                <TextInput
                  style={styles.input}
                  returnKeyType="go"
                  placeholder="Password"
                  secureTextEntry
                  value={this.state.password}
                  onChangeText = { (password) => this.setState({password}) }
                  ref={(input)=>this.passwordInput = input}
                />

                <Text style={styles.instructions}></Text>
                <TouchableOpacity onPress={()=>this.clickme()} style={styles.button}>
                  <Text style={styles.textlogin}>Login</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.about}>
                <Text>お問い合わせ先：trycode@iterative.co.jp</Text>
                <Text>Copyright © Iterative corp</Text>
              </View>
            </KeyboardAvoidingView>
        </View>
    );
  }

  login = () => {
    fetch('http://localhost:5432/users',{
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((res) => {

        if(res.success === true){
          AsyncStorage.setItem('user',res.user);
          this.props.navigation.navigate('Profile');
        }
        else{
          alert(res.message);
        }

    })
    .done();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  loginForm:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  about:{
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 15
  },
  title:{
    fontSize:25,
    color:'#005068',
    padding:10,
		marginBottom: 20
  },
	logo:{
		width: 60,
		height: 60,
		borderRadius:5
	},
  input:{
		height:40,
		width:300,
		borderColor:'#d4d4d4',
		borderWidth:0.5,
		margin:5,
		padding: 10,
    borderRadius: 20
	},
  button: {
    height:40,
    width:300,
    alignItems: 'center',
    backgroundColor: '#05A5D1',
    padding: 10,
    borderRadius: 20
  },
  textlogin:{
    color: '#fff'
  }
});
