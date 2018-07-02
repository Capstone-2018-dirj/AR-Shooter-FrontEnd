import React, { Component } from 'react';
import { Content, Button, Icon, Toast } from 'native-base';
import { Text, View } from 'react-native';
import socket from '../socket';
import styles from '../styles/globals';

const START_GAME = 'START_GAME';
const GAME_STARTED = 'GAME_STARTED';
const LEAVE_ROOM = 'LEAVE_ROOM';

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false
    };
    this.startGame = this.startGame.bind(this);
    this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
  }

  componentDidMount() {
    let { navigate } = this.props.navigation;
    socket.on(GAME_STARTED, () => {
      navigate('ARScene');
    });
  }
  componentWillUnmount(){
    this.handleLeaveRoom();
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
        <Content style={styles.items}>
          <Text style={styles.title}>Lobby</Text>
          <Button
            bordered
            dark
            onPress={this.startGame}
            style={{ marginTop: 40 }}
            full>
            <Text style={{ letterSpacing: 2 }}>Blast Off</Text>
          </Button>
          <Button
            bordered
            dark
            onPress={() => {
              this.props.navigation.navigate('GameOver');
            }}
            style={{ marginTop: 40 }}
            full>
            <Text style={{ letterSpacing: 2 }}>Game Over.</Text>
          </Button>
          <Button
            bordered
            dark
            onPress={() => {
              this.props.navigation.navigate('Winner');
            }}
            style={{ marginTop: 40 }}
            full>
            <Text style={{ letterSpacing: 2 }}>Winner</Text>
          </Button>
        </Content>
      </View>
    );
  }
}
