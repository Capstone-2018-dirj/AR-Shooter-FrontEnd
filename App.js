import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Home from './screens/Home';
import ARScene from './screens/ARScene';
import GameOver from './screens/GameOver';
import Winner from './screens/Winner';
import AllRooms from './screens/AllRooms';
import Lobby from './screens/Lobby';
import { Font, AppLoading } from 'expo';
import { Root } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Orbitron: require('./assets/fonts/Orbitron/Orbitron-Regular.ttf'),
      Teko: require('./assets/fonts/Teko/Teko-Regular.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    if (this.state.fontLoaded) {
      return (
        <Root>
          <RootNavigator />
        </Root>
      );
    }
    return <AppLoading />;
  }
}

const RootNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    ARScene: { screen: ARScene },
    AllRooms: { screen: AllRooms },
    Lobby: { screen: Lobby },
    GameOver: { screen: GameOver },
    Winner: { screen: Winner }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
