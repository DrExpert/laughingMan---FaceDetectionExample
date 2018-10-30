import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions,FaceDetector } from 'expo';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Vibration,
  Audio,
  Slider,
} from 'react-native';

import laugh from './assets/laughingman.gif';
 
const PATTERN = [100, 100, 200, 300 ];

const FACE_DETECTOR = {
  mode: FaceDetector.Constants.Mode.fast,
  detectLandmarks: FaceDetector.Constants.Mode.none,
  runClassifications: FaceDetector.Constants.Mode.all,
};

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    flip: Camera.Constants.Type.back,
    flash: Camera.Constants.FlashMode.off,
    faces: [],
  };
  
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' }); 
  }
  
  onFacesDetected = ({ faces }) => {
    this.setState({ faces });
  };

  onFlip = () => {
    this.setState({
      flip: this.state.flip === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });
  };
  
  onFlash = () => {
    this.setState({
      flash: this.state.flash == Camera.Constants.FlashMode.torch
        ? Camera.Constants.FlashMode.off  
        : Camera.Constants.FlashMode.torch,
    });
  };
  
  render() {
    const { hasCameraPermission, flip, flash } = this.state;
    
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Camera useCamera2Api
                style={styles.camera}
                type={flip} 
                ratio="16:9" 
                whiteBalance={Camera.Constants.WhiteBalance.auto} 
                autoFocus={Camera.Constants.AutoFocus.on} 
                focusDepth={0} 
                flashMode={flash} 
                zoom={0} 
                onFacesDetected={this.onFacesDetected} 
                faceDetectorSettings={FACE_DETECTOR}>
          <Button name="Flip" onPress={this.onFlip} />
          <Button name="Flash" onPress={this.onFlash} />
          
          <View style={styles.facesContainer} pointerEvents="none">
            {this.state.faces.map(face => <Face key={face.faceID} {...face} />)}
          </View>
        </Camera>
      );
    }
  }
}

const Button = ({name, onPress}) => (
  <View style={styles.button}>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.buttonText}>
        {' '}{name}{' '}
      </Text>
    </TouchableOpacity>
  </View>
);

const Face = ({ bounds, rollAngle, yawAngle }) => (
  <View>
     <Image
        source={laugh}
        transform={[
          { perspective: 600 }, 
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]} />
  </View> 
); 

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    flexDirection: 'column',
  }, 
  face: {
    padding: -10, 
    position: 'absolute',
    justifyContent: 'center',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  }, 
  buttonText: {
    color: '#FFFFFFFF',
    fontWeight: 'bold',
    // textAlign: 'center',
    // margin: 10,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'transparent',
    width: 600,
    paddingTop: 30,
    paddingBottom: 30,
  }
  
});
