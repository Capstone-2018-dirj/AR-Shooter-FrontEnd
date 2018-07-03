import React from 'react';
import { Toast } from 'native-base';
import { TouchableOpacity, Vibration, View, Image, Text } from 'react-native';
import { AR, Audio } from 'expo';
import * as Progress from 'react-native-progress';
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from 'expo-graphics';
// import { _throwIfAudioIsDisabled } from 'expo/src/av/Audio';
import socket from '../socket';
import { loadSounds, playSound, prepareSound } from '../utils/sound'
import laser from '../assets/audio/laser.mp3';

import styles from '../styles/globals';
const MAXRANGE = 5;

// socket events
const SHOT = 'SHOT';
const SHOOT = 'SHOOT';
const UPDATE_PLAYER_MOVEMENT = 'UPDATE_PLAYER_MOVEMENT';
const YOU_HIT = 'YOU_HIT';
const WINNER = 'WINNER';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.position = new THREE.Vector3();
    this.aim = new THREE.Vector3();
    this.clock = new THREE.Clock();
    this.arrows = [];
    this.state = {
      hasShot: false,
      gameDisabled: true,
      health: 10,
      crosshair: 150
    };
    this.cooldown = this.cooldown.bind(this);
    prepareSound();
    loadSounds({
      hit: laser
    });
  }
  componentDidMount() {
    // Turn off extra warnings
    this.logs = console.log;
    console.log = () => {};
    THREE.suppressExpoWarnings();

    const { navigate } = this.props.navigation;

    setTimeout(() => {
      this.setState({ gameDisabled: false });
    }, 5000);

    socket.on(SHOT, () => {
      Vibration.vibrate(1000);
      this.setState(prevState => ({ health: prevState.health - 1 }));
      if (this.state.health <= 0) {
        navigate('GameOver', { room: this.props.navigation.state.params.room });
      }
    });

    socket.on(YOU_HIT, () => {
      //do something with image, maybe zoom in for a second?
      this.setState({crosshair: 200})
      setTimeout(() => this.setState({crosshair: 150}), 200);
    });

    socket.on(WINNER, () => {
      navigate('Winner', { room: this.props.navigation.state.params.room });
    });

    socket.on('disconnect', () => {
      Toast.show({
        text:
          'You have been disconnected from server. Please restart your app.',
        duration: 10000,
        position: 'top'
      });
    });
    this.interval = setInterval(() => {
      socket.emit(UPDATE_PLAYER_MOVEMENT, {
        position: this.position,
        aim: this.aim
      });
    }, 50);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    socket.off(SHOT);
    socket.off(UPDATE_PLAYER_MOVEMENT);
    socket.off(WINNER);
    console.log = this.logs; // assigns console.log back to itself
  }

  //Limits the firing Rate of a player to every 500MS by toggling the Touchable Opacity
  cooldown = () => {
    setTimeout(() => {
      this.setState({ hasShot: false });
    }, 500);
  };

  render() {
    return (
      <TouchableOpacity
        style={{
          flex: 1
        }}
        onPress={this.showPosition}
        disabled={this.state.gameDisabled || this.state.hasShot}>
        {this.state.health > 3 ? (
          <View style={styles.topOverlay}>
            <Progress.Bar
              progress={this.state.health / 10}
              color="#21ce99"
              borderWidth={0}
              width={120}
              height={30}
            />
          </View>
        ) : (
          <View style={styles.topOverlay}>
            <Progress.Bar
              progress={this.state.health / 10}
              color="red"
              width={120}
              height={30}
            />
          </View>
        )}
        <GraphicsView
          style={{
            flex: 10
          }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          // isArRunningStateEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfigurations.World}
        />

        <View style={styles.centerOverlay}>
          <Image
            style={{ width: this.state.crosshair, height: this.state.crosshair }}
            source={require('../assets/images/futuristic_crosshair.png')}
          />
        </View>
      </TouchableOpacity>
    );
  }

  // When our context is built we can start coding 3D things.
  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    // This will allow ARKit to collect Horizontal surfaces

    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height
    });

    // We will add all of our meshes to this scene.
    this.scene = new THREE.Scene();
    // This will create a camera texture and use it as the background for our scene
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    // Now we make a camera that matches the device orientation.
    // Ex: When we look down this camera will rotate to look down too!

    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    //=======================================================================

    // Setup a light so we can see the sphere color
    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));
  };

  // When the phone rotates, or the view changes size, this method will be called.
  onResize = ({ x, y, scale, width, height }) => {
    // Let's stop the function if we haven't setup our scene yet
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  // Called every frame.
  onRender = async () => {
    // Finally render the scene with the AR Camera
    this.camera.getWorldPosition(this.position);
    this.camera.getWorldDirection(this.aim);
    let index;
    this.arrows.forEach((arrow, i) => {
      // arrow.position.add(arrow.velocity)
      arrow.position.x += arrow.velocity.x * 0.25;
      arrow.position.y += arrow.velocity.y * 0.25;
      arrow.position.z += arrow.velocity.z * 0.25;

      if (
        Math.abs(arrow.position.x) >= MAXRANGE ||
        Math.abs(arrow.position.y) >= MAXRANGE ||
        Math.abs(arrow.position.z) >= MAXRANGE
      ) {
        index = i;
      }
    });

    if (index !== undefined) {
      this.scene.remove(this.arrows[index]);
      this.arrows.splice(index, 1);
    }

    this.renderer.render(this.scene, this.camera);
  };

  showPosition = async () => {
    await playSound('hit')
    this.setState({ hasShot: true });
    var dir = new THREE.Vector3(this.aim.x, this.aim.y, this.aim.z);
    dir.normalize();
    var origin = new THREE.Vector3(
      this.position.x,
      this.position.y,
      this.position.z
    );
    var length = 0.5;
    var hex = 0x00ff00;
    var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 1, 0.05);
    arrowHelper.velocity = new THREE.Vector3(
      this.aim.x,
      this.aim.y,
      this.aim.z
    );

    this.arrows.push(arrowHelper);
    this.scene.add(arrowHelper);

    socket.emit(SHOOT, {
      position: this.position,
       aim: this.aim
     });

    this.cooldown();
  };
}
