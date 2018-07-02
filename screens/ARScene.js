import React from 'react';
import { Toast } from 'native-base';
import { TouchableOpacity, Vibration } from 'react-native';
import { AR } from 'expo';
import * as Progress from 'react-native-progress';
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from 'expo-graphics';
// import { _throwIfAudioIsDisabled } from 'expo/src/av/Audio';
import socket from '../socket';

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
      health: 10
    };
    this.cooldown = this.cooldown.bind(this);
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
        navigate('GameOver');
      }
    });

    socket.on(YOU_HIT, () => {
      this.sphere.material.color.setHex(0x0000ff);
       setTimeout(() => this.sphere.material.color.setHex(0xff0000), 500);
    });

    socket.on(WINNER, () => {
      navigate('Winner');
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
        (
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
        {this.state.health > 3 ? (
          <Progress.Bar
            progress={this.state.health / 10}
            color="green"
            borderWidth={0}
            width={null}
            height={50}
          />
        ) : (
          <Progress.Bar
            progress={this.state.health / 10}
            color="red"
            borderWidth={0}
            width={null}
            height={50}
          />
        )}
        )
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

    //sphere
    const geometry = new THREE.SphereGeometry(0.0154);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // Combine our geometry and material
    // this.sphere = new THREE.Mesh(geometry, material);
    // this.sphere.position.z = 0;
    // this.sphere.position.x = this.camera.position.x;
    // this.sphere.position.y = this.camera.position.y;
    // Add the sphere to the scene
    //=======================================================================

    // Setup a light so we can see the sphere color
    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));

    this.scene.add(this.sphere);
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
    this.sphere.position.x = this.position.x + this.aim.x;
    this.sphere.position.y = this.position.y + this.aim.y;
    this.sphere.position.z = this.position.z + this.aim.z;
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

  showPosition = () => {
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
