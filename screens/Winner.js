import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from '../styles/winner';
import { Button } from 'native-base';
import TypeWriter from 'react-native-typewriter';

const Winner = props => {
  function goToLobby() {
    props.navigation.navigate('Lobby');
  }
  function goToAllRooms() {
    //User Also has to leave room.
    props.navigation.navigate('AllRooms');
  }
  return (
    <View style={styles.main}>
      <View style={styles.items}>
        <TypeWriter style={styles.mainTitle} typing={1}>
          Mission Success!
        </TypeWriter>
      </View>
      <View style={styles.items}>
        <View style={{ alignSelf: 'center', margin: 0 }}>
          <Image
            style={styles.image}
            source={require('../assets/images/astronaut-spinning.gif')}
          />
        </View>
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          onPress={goToLobby}
          bordered
          dark
          style={{ marginTop: 40 }}
          full>
          <Text style={{ letterSpacing: 2 }}>Try Again?</Text>
        </Button>
        <Button
          onPress={goToAllRooms}
          bordered
          dark
          style={{ marginTop: 40 }}
          full>
          <Text style={{ letterSpacing: 2 }}>Abort Mission</Text>
        </Button>
      </View>
    </View>
  );
};

export default Winner;
