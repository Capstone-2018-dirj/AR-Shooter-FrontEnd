import React, { Component } from 'react';
import {
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Icon,
  Toast
} from 'native-base';
import { Text, View } from 'react-native';

export default class Rooms extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      showToast: false
    };
    this.handleAllRooms = this.handleAllRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  createRoom() {
    if (this.state.name) {
      this.props.navigation.state.params.socket.emit(
        'createRoom',
        this.state.name
      );
      Toast.show({
        text: 'Room Created!',
        position: 'top',
        buttonText: 'Okay'
      });
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
  handleAllRooms() {
    const { navigate } = this.props.navigation;
    navigate('AllRooms', { socket: this.props.navigation.state.params.socket });
  }

  render() {
    return (
      <View style={styles.main}>
        <Button transparent onPress={() => this.props.navigation.goBack()}>
          <Icon style={styles.backButton} name="arrow-back" />
        </Button>
        <Content style={styles.items}>
          <Text style={styles.title}>LOBBY </Text>
          <Form>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input value={this.state.name} onChangeText={this.handleChange} />
            </Item>
            <Button
              onPress={this.createRoom}
              style={{ marginTop: 40 }}
              full
              light>
              <Text style={{ letterSpacing: 2 }}>Create a Room</Text>
            </Button>
          </Form>
          <Button
            onPress={this.handleAllRooms}
            style={{ marginTop: 40 }}
            full
            light>
            <Text style={{ letterSpacing: 2 }}>Join a Room</Text>
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
