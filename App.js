import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Home from './screens/home';
import ARScene from './screens/ARScene';
import GameOver from './screens/gameOver';
import Rooms from './screens/rooms';
import { Font, AppLoading } from 'expo';

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
      return <RootNavigator />;
    }
    return <AppLoading />;
  }
}

const RootNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    ARScene: { screen: ARScene },
    GameOver: { screen: GameOver },
    Rooms: { screen: Rooms }
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
