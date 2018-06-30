import React from 'react';
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
    THREE.suppressExpoWarnings(true);
    ThreeAR.suppressWarnings(true);
    socket.on(SHOT, () => {
      Vibration.vibrate(1000);
      this.setState(prevState => ({ health: prevState.health - 1 }));
    });

    socket.on(YOU_HIT, () => {
      console.log(this.sphere);
      this.sphere.material.color = '0x00ff00';
    });

    this.interval = setInterval(() => {
      socket.emit(UPDATE_PLAYER_MOVEMENT, {
        position: this.position,
        aim: this.aim
      });
    }, 50);
  }
  //Limits the firing Rate of a player to every 500MS by toggling the Touchable Opacity
  cooldown = () => {
    setTimeout(() => {
      this.setState({ hasShot: false });
    }, 500);
  };

  render() {
    // You need to add the `isArEnabled` & `arTrackingConfiguration` props.
    // `isArRunningStateEnabled` Will show us the play/pause button in the corner.
    // `isArCameraStateEnabled` Will render the camera tracking information on the screen.
    // `arTrackingConfiguration` denotes which camera the AR Session will use.
    // World for rear, Face for front (iPhone X only)
    setTimeout(() => {
      this.setState({ gameDisabled: false });
    }, 5000);
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
        <Progress.Bar
          progress={this.state.health / 10}
          color="green"
          borderWidth={0}
          width={null}
          height={50}
        />
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
    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.z = 0;
    this.sphere.position.x = this.camera.position.x;
    this.sphere.position.y = this.camera.position.y;
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
      arrow.position.x += arrow.velocity.x * 0.095;
      arrow.position.y += arrow.velocity.y * 0.095;
      arrow.position.z += arrow.velocity.z * 0.095;

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
    // this.setState({ hasShot: true });
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
    console.log(this.sphere.geometry.radius)
    this.sphere.geometry.radius = 0.1;

    // this.cooldown();
  };
}
