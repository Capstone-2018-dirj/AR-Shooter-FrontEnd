import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from '../styles/gameover';
import { Button } from 'native-base';
import TypeWriter from 'react-native-typewriter';
import socket from '../socket';
const LEAVE_ROOM = 'LEAVE_ROOM';

const GameOver = props => {
  function goToLobby() {
    props.navigation.navigate('Lobby');
  }
  function goToAllRooms() {
    //User Also has to leave room.
    //TEST
    let room = props.navigation.state.params.room;
    socket.emit(LEAVE_ROOM, room);
    props.navigation.navigate('AllRooms');
  }

  return (
    <View style={styles.main}>
      <View style={styles.items}>
        <TypeWriter style={styles.mainTitle} typing={1}>
          Mission Failure.
        </TypeWriter>
      </View>
      <View style={styles.items}>
        <View style={{ alignSelf: 'center', margin: 0 }}>
          <Image
            style={styles.image}
            source={require('../assets/images/game-over.png')}
          />
        </View>
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          onPress={goToLobby}
          bordered
          light
          style={{ marginTop: 40 }}
          full>
          <Text style={{ letterSpacing: 2, color: 'white' }}>Try Again?</Text>
        </Button>
        <Button
          onPress={goToAllRooms}
          bordered
          light
          style={{ marginTop: 40 }}
          full>
          <Text style={{ letterSpacing: 2, color: 'white' }}>
            Abort Mission
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default GameOver;
