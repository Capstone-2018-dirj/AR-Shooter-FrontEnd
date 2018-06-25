import React, { Component } from 'react';
import { Content, Form, Item, Input, Label, Button, Icon } from 'native-base';
import { Text, View } from 'react-native';

export default class Rooms extends Component {
  constructor() {
    super();
    this.state = {
      name: ''
    };

    this.createRoom = this.createRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  createRoom() {
    this.props.navigation.state.params.socket.on('createRoom', this.state.name);
  }
  handleChange(text) {
    this.setState({ name: text });
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
    color: 'black'
  }
};
