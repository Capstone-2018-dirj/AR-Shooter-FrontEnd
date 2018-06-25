import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AR } from 'expo';
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
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
      <TouchableOpacity
        style={{
          flex: 1
        }}
        onPress={this.showPosition}>
        <GraphicsView
          style={{
            flex: 5
          }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          // isArRunningStateEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfigurations.World}
        />{' '}
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
    this.createCrosshair();

    //sphere
    // Simple color material
    // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
    const geometry = new THREE.SphereGeometry( 0.0154);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000});

    // Combine our geometry and material
    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.z = -1;
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
    this.renderer.render(this.scene, this.camera);
  };

  createCrosshair() {
    // crosshair size
    let x = 0.05,
      y = 0.05;

    let geometry = new THREE.Geometry();
    let material = new THREE.LineBasicMaterial({
      color: 0xaaffaa
    });

    // crosshair
    geometry.vertices.push(new THREE.Vector3(0, y, 0));
    geometry.vertices.push(new THREE.Vector3(0, -y, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(x, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

    this.crosshair = new THREE.Line(geometry, material);
    this.camera.add(this.crosshair);
    this.scene.add(this.camera);
  }

  showPosition = () => {
    const geometry = new THREE.CylinderGeometry(.05, .05, 1)
    const material = new THREE.MeshPhongMaterial({ color: 0x00FF00 })
    const laser = new THREE.Mesh(geometry, material);
    laser.position.x = this.position.x + this.aim.x
    laser.rotation.x = this.aim.x + Math.PI/2 
    laser.position.y = this.position.y + this.aim.y
    laser.rotation.y = this.aim.y
    laser.position.z = this.position.z + this.aim.z
    this.scene.add(laser)
    
    this.props.navigation.state.params.socket.emit('position', {
      position: this.position,
      aim: this.aim
    });
  };
}
