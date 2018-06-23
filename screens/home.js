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
const host = "http://172.16.25.175:3030";

export default class FloatingLabelExample extends Component {
  constructor() {
    super();
    this.socket = io(host);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    const { navigate } = this.props.navigation;
    navigate('ARScene', {socket: this.socket});
  }
  render() {
    return (
      <View style={styles.main}>
        <Content style={styles.items}>
          <Text style={styles.title}>AR SHOOTER </Text>
          <Form>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input />
            </Item>
          </Form>
        </Content>
        <Button onPress={this.handlePress} style={{ marginTop: 40 }} full light>
          <Text style={{ letterSpacing: 2 }}>Start Game</Text>
        </Button>
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