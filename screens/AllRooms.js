import React, { Component } from 'react';
import { Form, Item, Input, Label, Button, Icon, Toast } from 'native-base';
import { Text, View } from 'react-native';
import ListRooms from '../components/listRooms';
const CREATE_ROOM = 'CREATE_ROOM';
import styles from '../styles/globals';
import socket from '../socket';

export default class Rooms extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      showToast: false,
      loading: false
    };
    this.createRoom = this.createRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  createRoom() {
    let navigate = this.props.navigation.navigate;
    if (this.state.name) {
      socket.emit(CREATE_ROOM, this.state.name);

      navigate('Lobby', { room: this.state.name });
    } else {
      Toast.show({
        text: 'Please Enter Room Name!',
        buttonText: 'Okay'
      });
    }
  }
  handleChange(text) {
    this.setState({ name: text });
  }
  render() {
    let navigate = this.props.navigation.navigate;
    return (
      <View style={styles.main}>
        <Button transparent onPress={() => this.props.navigation.goBack()}>
          <Icon style={styles.backButton} name="arrow-back" />
        </Button>
        <View style={styles.items}>
          <Text style={styles.title}>AR SHOOTER</Text>
          <Form>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input value={this.state.name} onChangeText={this.handleChange} />
            </Item>
            <Button
              onPress={this.createRoom}
              style={{ marginTop: 40 }}
              full
              light
            >
              <Text style={{ letterSpacing: 2 }}>Create a Room</Text>
            </Button>
          </Form>
        </View>
        <Text style={styles.smallTitle}>All Rooms</Text>
        <ListRooms navigate={navigate} />
      </View>
    );
  }
}
