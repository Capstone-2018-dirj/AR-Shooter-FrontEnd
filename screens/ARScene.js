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
import { loadSounds, playSound, prepareSound } from '../utils/sound';
import { heartGrabbed, howMuchHealth } from '../utils/heartPosition';
import createLaser from '../utils/createLaser';
import laserSound from '../assets/audio/laser.mp3';

import styles from '../styles/globals';
const MAXRANGE = 5;

// socket events
const SHOT = 'SHOT';
const SHOOT = 'SHOOT';
const UPDATE_PLAYER_MOVEMENT = 'UPDATE_PLAYER_MOVEMENT';
const YOU_HIT = 'YOU_HIT';
const WINNER = 'WINNER';
const HEART_PICKED_UP = 'HEART_PICKED_UP';
const ERASE_HEART = 'ERASE_HEART';
const LASER_SHOT = 'LASER_SHOT';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.position = new THREE.Vector3();
    this.aim = new THREE.Vector3();
    this.clock = new THREE.Clock();
    this.lasers = [];
    this.state = {
      hasShot: false,
      gameDisabled: true,
      health: 10,
      crosshair: 150,
      heart: true
    };
    this.cooldown = this.cooldown.bind(this);
    prepareSound();
    loadSounds({
      shoot: laserSound
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

    socket.on(LASER_SHOT, ({ position, aim }) => {
      let laser = createLaser(position, aim);
      this.lasers.push(laser);
      this.scene.add(laser);
    });

    socket.on(YOU_HIT, () => {
      //do something with image, maybe zoom in for a second?
      this.setState({ crosshair: 200 });
      setTimeout(() => this.setState({ crosshair: 150 }), 200);
    });

    socket.once(ERASE_HEART, () => {
      this.scene.remove(this.heart);
      this.setState({ heart: false });
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
      this.heartHandler();
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
        disabled={this.state.gameDisabled || this.state.hasShot}
      >
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
            style={{
              width: this.state.crosshair,
              height: this.state.crosshair
            }}
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

    let x = 0,
      y = 0;

    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 25, y + 25);
    heartShape.bezierCurveTo(x + 25, y + 25, x + 20, y, x, y);
    heartShape.bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35);
    heartShape.bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95);
    heartShape.bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35);
    heartShape.bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y);
    heartShape.bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);

    const options = {
      depth: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, options);
    const heartMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    this.heart = new THREE.Mesh(heartGeometry, heartMaterial);
    this.heart.scale.set(0.005, 0.005, 0.005);
    this.heart.position.set(2, 0, -2);
    this.heart.rotation.set(0, 0, Math.PI);
    this.scene.add(this.heart);

    this.scene.add(new THREE.AmbientLight(0xffffff));
  };

  onResize = ({ x, y, scale, width, height }) => {
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = async () => {
    this.camera.getWorldPosition(this.position);
    this.camera.getWorldDirection(this.aim);
    let index;
    this.lasers.forEach((laser, i) => {
      // laser.position.add(laser.velocity)
      laser.position.x += laser.velocity.x * 0.25;
      laser.position.y += laser.velocity.y * 0.25;
      laser.position.z += laser.velocity.z * 0.25;

      if (
        Math.abs(laser.position.x) >= MAXRANGE ||
        Math.abs(laser.position.y) >= MAXRANGE ||
        Math.abs(laser.position.z) >= MAXRANGE
      ) {
        index = i;
      }
    });

    if (index !== undefined) {
      this.scene.remove(this.lasers[index]);
      this.lasers.splice(index, 1);
    }

    this.heart.rotation.y += Math.PI / 32;
    this.renderer.render(this.scene, this.camera);
  };
  heartHandler = () => {
    if (this.heart) {
      if (
        this.state.heart &&
        heartGrabbed(this.position, this.heart.position)
      ) {
        this.setState(prevState => ({
          health: howMuchHealth(prevState.health)
        }));
        socket.emit(HEART_PICKED_UP);
      }
    }
  };

  showPosition = async () => {
    await playSound('shoot');
    this.setState({ hasShot: true });

    const laser = createLaser(this.position, this.aim);
    this.lasers.push(laser);
    this.scene.add(laser);

    socket.emit(SHOOT, {
      position: this.position,
      aim: this.aim
    });

    this.cooldown();
  };
}
