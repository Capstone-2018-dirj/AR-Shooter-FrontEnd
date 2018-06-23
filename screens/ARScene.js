import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AR } from 'expo';
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import { Button } from 'native-base';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';

// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from 'expo-graphics';
// import { _throwIfAudioIsDisabled } from 'expo/src/av/Audio';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.position = new THREE.Vector3();
    this.aim = new THREE.Vector3();
  }
  componentDidMount() {
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true);
    ThreeAR.suppressWarnings();
    this.props.navigation.state.params.socket.on('shot', payload => {
      console.log("shooter's position", payload.x, payload.y);
      console.log('our position', this.position.x, this.position.y);
      this.props.navigation.state.params.socket.emit('gothit?', this.position);
    });
  }

  render() {
    // You need to add the `isArEnabled` & `arTrackingConfiguration` props.
    // `isArRunningStateEnabled` Will show us the play/pause button in the corner.
    // `isArCameraStateEnabled` Will render the camera tracking information on the screen.
    // `arTrackingConfiguration` denotes which camera the AR Session will use.
    // World for rear, Face for front (iPhone X only)
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={this.showPosition}>
        <GraphicsView
          style={{ flex: 5 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          // isArRunningStateEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfigurations.World}
        />
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

    //CUBE
    // Simple color material
    // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
    const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);

    const material = new THREE.MeshPhongMaterial({
      color: 0xff00ff
    });

    // Combine our geometry and material
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.z = -1;
    this.cube.position.x = this.camera.position.x;
    this.cube.position.y = this.camera.position.y;
    // Add the cube to the scene
    //=======================================================================

    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));

    this.scene.add(this.cube);
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
    this.cube.position.x = this.position.x + this.aim.x;
    this.cube.position.y = this.position.y + this.aim.y;
    this.cube.position.z = this.position.z + this.aim.z;
    this.renderer.render(this.scene, this.camera);
  };

  showPosition = () => {
    // Assuming player2 is at position (1, -1), (x, z)
    // Player one facing negative z axis.
    // flip z axis sign for player facing positive z axis.
    // player2x - player1x
    // let x = 1 - position.x;
    // // player1z - player2z
    // let z = position.z + 1;
    // // angle needed to hit.
    // let thetaNeeded = Math.atan(x / z);
    // // actual viewing angle.
    // let theta = Math.atan(aim.x / aim.z); // positive if on other side of z axis.
    // if (aim.z < 0) theta *= -1;
    // console.log('theta needed: ', THREE.Math.radToDeg(thetaNeeded));
    // console.log('current theta: ', THREE.Math.radToDeg(theta));
    // // pythagorean thm.
    // let magnitude = Math.sqrt(
    //   Math.pow(1 - position.x, 2) + Math.pow(position.z + 1, 2)
    // );
    // // xsin(theta)
    // let vx = Math.sin(theta) * magnitude;
    // // zcos(theta)
    // let vz = Math.cos(theta) * magnitude; // positive if on other side of z axis.
    // if (aim.z < 0) vz *= -1;
    // // given theta and origin => destination.
    // const destination = {
    //   x: position.x + vx,
    //   z: position.z + vz
    // };
    // console.log(`destination: (${destination.x}, ${destination.z})`);
    // // let bufferTheta = Math.abs(theta - thetaNeeded);
    // let bufferX = Math.abs(1 - destination.x);
    // let bufferZ = Math.abs(destination.z + 1);
    // // console.log('bufferTheta: ', bufferTheta);
    // console.log('bufferX: ', bufferX);
    // console.log('bufferZ: ', bufferZ);
    // if (/*bufferTheta < 0.1 && */ bufferX < 0.05 && bufferZ < 0.05)
    //   console.log('HIT!!!!');
    // else console.log('miss....');
    this.props.navigation.state.params.socket.emit('position', {
      position: this.position,
      aim: this.aim
    });
  };
}
