import React, { Component } from 'react';
import { Content, Button, Icon } from 'native-base';
import { Text, View } from 'react-native';
import socket from '../socket';
import styles from '../styles/globals';

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
    console.log(this.props.navigation);
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
