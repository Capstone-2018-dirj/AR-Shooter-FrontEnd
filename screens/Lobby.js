import React, { Component } from 'react';
import { Content, Button, Icon, Toast } from 'native-base';
import { Text, View, Image } from 'react-native';
import socket from '../socket';
import styles from '../styles/globals';
import ListPlayers from '../components/listPlayers';
import { AppLoading } from 'expo';

const START_GAME = 'START_GAME';
const GAME_STARTED = 'GAME_STARTED';
const LEAVE_ROOM = 'LEAVE_ROOM';

const UPDATE_ROOMS = 'UPDATE_ROOMS';

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      room: []
    };
    this.startGame = this.startGame.bind(this);
    this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }

  componentDidMount() {
    let { navigate } = this.props.navigation;
    socket.on(GAME_STARTED, () => {
      navigate('ARScene', { room: this.props.navigation.state.params.room });
    });

    socket.on(UPDATE_ROOMS, rooms => {
      const currRoom = rooms[this.props.navigation.state.params.room];
      this.setState({ room: currRoom });
    });
  }

  startGame() {
    if (!this.disableButton()) {
      socket.emit(START_GAME);
    } else {
      Toast.show({
        text: 'Game is still in session. Please wait for it to end.',
        buttonText: 'Okay'
      });
    }
  }

  handleLeaveRoom() {
    let room = this.props.navigation.state.params.room;
    socket.emit(LEAVE_ROOM, room);
    Toast.show({
      text: 'Left Room',
      buttonText: 'Okay'
    });
    this.props.navigation.navigate('AllRooms');
  }

  disableButton() {
    if (this.state.room.some(player => player.inSession)) return true;
    return false;
  }

  render() {
    return (
      <View style={styles.main}>
        <Button
          style={styles.backButtonContainer}
          transparent
          onPress={this.handleLeaveRoom}>
          <Icon style={styles.backButton} name="arrow-back" />
        </Button>
        <Text style={styles.title}>Lobby</Text>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20
            
          }}>
          <Image
            style={styles.informativeImage}
            source={require('../assets/images/Instructional.gif')}
            onLoad={this.handleImageLoaded}
          />
          <Text style={styles.informativeText}>
            Before Blasting off, ensure phones are upright and stacked on top of
            eachother.
          </Text>
        </View>
        <Button
          bordered
          dark
          onPress={this.startGame}
          style={{
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10
          }}
          full>
          <Text style={{ letterSpacing: 2 }}>Blast Off</Text>
        </Button>
        <Content>
          <ListPlayers names={this.state.room} />;
        </Content>
      </View>
    );
  }
}
