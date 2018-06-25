import React from 'react';
import { Text, View, FlatList} from 'react-native';
import axios from 'axios';
const host = 'http://172.16.25.175:3030';

class AllRooms extends React.Component {
  constructor() {
    super();
    this.state = {
      rooms: {}
    };
  }
  componentDidMount() {
    axios
      .get(`${host}/rooms`)
      .then(res => res.data)
      .then(rooms => this.setState({ rooms }));
  }

  render() {
    let { rooms } = this.state;
    console.log(rooms);

    return (
      <View style={styles.main}>
        {rooms &&
          Object.keys(rooms).map(room => (
            <Text key={room}>
              {room} {rooms[room]}
            </Text>
          ))}
      </View>
    );
  }
}

export default AllRooms;

const styles = {
  main: {
    backgroundColor: '#3D464E',
    flex: 1
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
