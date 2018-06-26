import React, { Component } from 'react';
import {
  Container,
  Button,
  Icon,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text
} from 'native-base';
import { SERVER_URL } from 'react-native-dotenv';
import io from 'socket.io-client';
import axios from 'axios';
const host = SERVER_URL;

export default class AllRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: {},
      loading: false
    };
    this.socket = this.props.navigation.state.params.socket;
  }

  componentDidMount() {
    this.getRooms();
  }
  getRooms = () => {
    const url = `${host}/rooms`;
    this.setState({ loading: true });
    axios
      .get(url)
      .then(res => res.data)
      .then(res => {
        this.setState({
          rooms: res,
          loading: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
  render() {
    let rooms = Object.keys(this.state.rooms);
    let { navigate } = this.props.navigation;
    return (
      <Container style={{ backgroundColor: '#3D464E' }}>
        <Button transparent onPress={() => this.props.navigation.goBack()}>
          <Icon style={styles.backButton} name="arrow-back" />
        </Button>
        <Content>
          <Text style={styles.title}>All Rooms</Text>

          <List>
            {rooms &&
              rooms.map(room => {
                return (
                  <ListItem
                    avatar
                    key={room}
                    onPress={() => navigate('ARScene', { socket: this.socket })}
                  >
                    <Left>
                      <Thumbnail
                        source={{
                          uri:
                            'http://freedesignfile.com/upload/2017/08/alien-icon-vector.png'
                        }}
                      />
                    </Left>
                    <Body>
                      <Text>{room}</Text>
                      <Text note>Stuff goes here.</Text>
                    </Body>
                    <Right>
                      <Text note>
                        {this.state.rooms[room]} player(s) active.
                      </Text>
                    </Right>
                  </ListItem>
                );
              })}
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = {
  backButton: {
    color: 'black'
  },
  title: {
    fontFamily: 'Orbitron',
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 2
  }
};
