import React, { Component } from 'react';
import styles from '../styles/globals';
import { Form, Item, Input, Label, Button, Toast } from 'native-base';
import { Text, View, Image } from 'react-native';
import BgAudio from 'react-native-background-audio';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      playerName: ''
    };
    this.nameChangeHandler = this.nameChangeHandler.bind(this);
    this.handleAddRoomsScreen = this.handleAddRoomsScreen.bind(this);
  }

  handleAddRoomsScreen() {
    const { navigate } = this.props.navigation;
    if (this.state.playerName)
      navigate('AllRooms', { playerName: this.state.playerName });
    else
      Toast.show({
        text: 'Please Enter Player Name!',
        buttonText: 'Okay',
        position: 'top'
      });
  }
  nameChangeHandler(text) {
    this.setState({ playerName: text });
  }

  render() {
    return (
      <View style={styles.main}>
        {/*<BgAudio options={audio_options} />*/}
        <Text style={styles.mainTitle}>SPACE COWBOY </Text>
        <View style={styles.items}>
          <View style={{ alignSelf: 'center', margin: 0 }}>
            <Image
              style={styles.image}
              source={require('../assets/images/space-cowboy.png')}
            />
          </View>
          <Form>
            <Item floatingLabel autofocus="true">
              <Label>Player Name</Label>
              <Input
                style={{ margin: 0 }}
                value={this.state.playerName}
                onChangeText={this.nameChangeHandler}
              />
            </Item>
            <Button
              bordered
              dark
              onPress={this.handleAddRoomsScreen}
              style={{ marginTop: 40 }}
              full>
              <Text style={{ letterSpacing: 2 }}>Join/Create a Room</Text>
            </Button>
          </Form>
        </View>
      </View>
    );
  }
}

const audio_options = {
  source: { local: require('../assets/audio/No_Surprises_8-bit_.mp3') } //ex. require('./music/sample.mp3')
};
