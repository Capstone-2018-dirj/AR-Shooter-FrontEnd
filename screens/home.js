import React, { Component } from 'react';
import io from 'socket.io-client';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button
} from 'native-base';
import { Text, View } from 'react-native';
const host = 'http://172.16.25.175:3030';

export default class FloatingLabelExample extends Component {
  constructor() {
    super();
    this.socket = io(host);
    this.handleCreateRooms = this.handleCreateRooms.bind(this);
  }

  handleCreateRooms() {
    const { navigate } = this.props.navigation;
    navigate('Rooms', { socket: this.socket });
  }
  render() {
    return (
      <View style={styles.main}>
        <Content style={styles.items}>
          <Text style={styles.title}>AR SHOOTER </Text>
          <Form>
            <Item floatingLabel>
              <Label>Player Name</Label>
              <Input />
            </Item>
            <Button
              onPress={this.handleCreateRooms}
              style={{ marginTop: 40 }}
              full
              light>
              <Text style={{ letterSpacing: 2 }}>Join/Create a Room</Text>
            </Button>
          </Form>
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
  }
};
