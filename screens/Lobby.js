import React, { Component } from 'react';
import { Content, Button, Icon } from 'native-base';
import { Text, View } from 'react-native';
import socket from '../socket'

const START_GAME = 'START_GAME';
const GAME_STARTED = 'GAME_STARTED';

export default class Lobby extends Component {
  constructor() {
    super();
    this.startGame = this.startGame.bind(this);
  }
  componentDidMount() {
    let { navigate } = this.props.navigation;
    socket.on(GAME_STARTED, () => {
      navigate('ARScene');
    });
  }
  startGame() {
    socket.emit(START_GAME);
  }
  render() {

    return (
      <View style={styles.main}>
        <Button transparent onPress={() => this.props.navigation.goBack()}>
          <Icon style={styles.backButton} name="arrow-back" />
        </Button>
        <Content style={styles.items}>
          <Text style={styles.title}>Lobby</Text>
          <Button onPress={this.startGame} style={{ marginTop: 40 }} full light>
            <Text style={{ letterSpacing: 2 }}>Start Game</Text>
          </Button>
        </Content>
      </View>
    );
  }
}

const styles = {
  main: {
    backgroundColor: '#3D464E',
    flex: 1,
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: 'Orbitron',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 60,
    letterSpacing: 2
  },
  items: {
    marginLeft: 20,
    marginRight: 20
  },
  backButton: {
    marginTop: 10,
    color: 'black'
  }
};
