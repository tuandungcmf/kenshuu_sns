import React, {Platform, StyleSheet, Dimensions, View, Text, Navigator, Component} from 'react-native';
import GiftedMessenger from 'react-native-gifted-messenger';
// import API from './Api';

// You need to set `window.navigator` to something in order to use the socket.io
// client. You have to do it like this in order to use the debugger because the
// debugger in React Native runs in a webworker and only has a getter method for
// `window.navigator`.
// Remove this after socket.io releases with this patch
// https://github.com/socketio/engine.io-parser/pull/55
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

import io from 'socket.io-client/dist/socket.io.js';

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    const socketServer = 'http://'+API.serverIP+':4000';

    const options = {transports: ['websocket'], forceNew: true};
    this.socket = io(socketServer, options);

    this._messages = [];

    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      allLoaded: false,
      chatRoomId: null,
      page: 0
    };
  }

  componentDidMount() {
    this._getChatRoom();

    this.socket.emit('add user', this.props.senderId);

    // Socket events
    this.socket.on('connect', () => {
      console.log('connected to socket.io server');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected from socket.io server');
    });

    var that = this;
    this.socket.on('new message', function (data) {
      console.log('new message', JSON.stringify(data));
      that.handleReceive({
        text: data.message,
        name: that.props.recipientEmail,
        image: null,
        position: 'left',
        date: new Date(),
        uniqueId: Math.round(Math.random() * 10000),
      });
    });

  }

  componentWillUnmount() {}

  _getChatRoom = async() => {
    try {
      let accessToken = await API.getToken();

      let data = {
        sender_id: this.props.senderId,
        recipient_id: this.props.recipientId
      }

      let response = await API.request('POST', 'http://'+API.serverIP+':3000/v1/chat_rooms', data, accessToken);
      console.log("get chat room", JSON.stringify(response));

      let chatRoomId = response.chat_room_id;
      console.log('chatRoomId', chatRoomId);

      this.setState({chatRoomId: chatRoomId});

      this._getChatMessages();
    } catch(error) {
      console.error("_getChatRoom error: ", error);
    }
  }

  _getChatMessages = async() => {
    try {
      // display a loader until you retrieve the messages from your server
      this.setState({
        isLoadingEarlierMessages: true,
        page: this.state.page + 1
      });

      let accessToken = await API.getToken();

      let response = await API.request('GET', 'http://'+API.serverIP+':3000/v1/chat_rooms/'+this.state.chatRoomId+'/chat_messages/page/'+this.state.page, null, accessToken);
      console.log("get chat messages", JSON.stringify(response));

      if (response.length == 0) {
        this.setState({
          isLoadingEarlierMessages: false, // hide the loader
          allLoaded: true, // hide the `Load earlier messages` button
        });
        return;
      }

      //let chatMessages = response;
      let chatMessages = response.reverse();
      console.log('chat messages', chatMessages);

      let earlierMessages = [];

      for (let msg of chatMessages) {
        if (this._messages.find( m => m.uniqueId === msg.chat_message_id )) {
          continue;
        }
        earlierMessages.push({
          text: msg.message,
          name: (msg.user_id == this.props.senderId) ? this.props.senderEmail : this.props.recipientEmail,
          image: null,
          position: (msg.user_id == this.props.senderId) ? 'right' : 'left',
          date: new Date(msg.created_at),
          uniqueId: msg.chat_message_id
        });
      }

      setTimeout(() => {
        this.setState({
          isLoadingEarlierMessages: false,
        });
        this.setMessages(earlierMessages.concat(this._messages));
      }, 500);

    } catch(error) {
      console.error("_getChatMessages error: ", error);
    }
  }

  setMessages(messages) {
    this._messages = messages;

    // append the message
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {
    message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
    this.setMessages(this._messages.concat(message));

    this.socket.emit('new message', {
      message: message.text,
      chatRoomId: this.state.chatRoomId,
      senderId: this.props.senderId,
      recipientId: this.props.recipientId
    });
  }

  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    this.setMessages(this._messages.concat(message));
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          autoFocus={false}
          blurOnSubmit={true}
          submitOnReturn={true}
          keyboardShouldPersistTaps={false}
          maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}

          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}

          loadEarlierMessagesButton={!this.state.allLoaded}
          isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}
          onLoadEarlierMessages={this._getChatMessages.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 64 : 44,
  }
});

module.exports = ChatRoom;
