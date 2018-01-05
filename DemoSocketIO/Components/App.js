import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Navigator,
  BackAndroid
} from 'react-native';
import {Scene, Reducer, Router, Modal, Actions} from 'react-native-router-flux';

import { StackNavigator } from 'react-navigation';

import Login from './Login';
import Profile from './Profile';
// import Users from './Users';
// import ChatRoom from './ChatRoom';

import io from 'socket.io-client/dist/socket.io.js';

var e;

//Login
const Application = StackNavigator(
  {Home: { screen: Login },
   Profile: { screen: Profile }
  },
  { navigationOptions: { header: false}
});

export default class App extends Component {
  render() {
    return (
      <Application />
    );
  }
}
