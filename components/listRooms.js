import React from 'react';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text
} from 'native-base';

const ListRooms = props => {
  let rooms = props.rooms;

  rooms = Object.keys(rooms);
  return (
    <Content style={{ marginLeft: 20, marginRight: 20 }}>
      <Container style={{ backgroundColor: '#3D464E' }}>
        <List style={{ marginTop: 0 }}>
          {rooms &&
            rooms.map(room => {
              return (
                <ListItem
                  avatar
                  key={room}
                  onPress={() => props.navigate('Lobby')}>
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
                      {props.rooms[room].length} player(s) active.
                    </Text>
                  </Right>
                </ListItem>
              );
            })}
        </List>
      </Container>
    </Content>
  );
};

export default ListRooms;

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
