import React, { Component } from 'react';
import { Content, Button, Icon, Toast } from 'native-base';
import { Text, View } from 'react-native';
import socket from '../socket';
import styles from '../styles/globals';
import ListPlayers from '../components/listPlayers';

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
  }

  componentDidMount() {
    let { navigate } = this.props.navigation;
    socket.on(GAME_STARTED, () => {
      navigate('ARScene');
    });

    socket.on(UPDATE_ROOMS, rooms => {
      const currRoom = rooms[this.props.navigation.state.params.room];
      this.setState({ room: currRoom });
    });
  }

  componentWillUnmount() {
  }
  startGame() {
    socket.emit(START_GAME);
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
        <Button
          bordered
          dark
          onPress={this.startGame}
          style={{
            marginTop: 40,
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20
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
