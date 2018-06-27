import React, { Component } from 'react';

import { Content, Form, Item, Input, Label, Button } from 'native-base';
import { Text, View } from 'react-native';

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
        <Content style={styles.items}>
          <Text style={styles.title}>AR SHOOTER </Text>
          <Form>
            <Item floatingLabel>
              <Label>Player Name</Label>
              <Input />
            </Item>
            <Button
              onPress={this.handleAddRoomsScreen}
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
