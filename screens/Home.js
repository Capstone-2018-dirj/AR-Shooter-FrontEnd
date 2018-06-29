import React, { Component } from 'react';
import styles from '../styles/globals';
import { Form, Item, Input, Label, Button } from 'native-base';
import { Text, View, Image } from 'react-native';

export default class Home extends Component {
  constructor() {
    super();
    this.handleAddRoomsScreen = this.handleAddRoomsScreen.bind(this);
  }

  handleAddRoomsScreen() {
    const { navigate } = this.props.navigation;
    navigate('AllRooms');
  }
  render() {
    return (
      <View style={styles.main}>
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
              <Input />
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
