import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, Ionicons, FontAwesome5 } from '@expo/vector-icons'

export default function App(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [size, setSize] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
      setSize(size)
    })()
  }, [])
  takePhoto=()=>{
    this.camera.takePictureAsync()
    .then(res=>{
      props.getImage(res)
    })
    .catch(e=>console.log(e))
  }
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  console.log(size)
  return (
    <View style={{ flex: 1 }}>
      <Camera 
        pictureSize="1:1"
        ref={ref => {
          this.camera = ref;
        }}
        style={{ flex: 1 }} 
        type={type}>
        <View
          style={styles.innerContainer}
        >
          <View style={styles.upperPane}>
            <TouchableOpacity
                style={styles.backIcon}
                onPress={props.close}>
                <Ionicons name="md-close-circle" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.flipIcon}
                onPress={() => {
                setType(
                    type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
                }}>
                <FontAwesome name="rotate-right" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>takePhoto()} style={styles.shutterBtn}>
            <FontAwesome5 name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent:'space-between'
    },

    upperPane: {
        backgroundColor:"#4630EB",
        paddingTop:50,
        paddingBottom:10,
        flexDirection:"row",
        width:"100%",
        justifyContent:"space-between",
        alignItems:"center"
    },

    flipIcon: {
        paddingHorizontal:30
    },

    backIcon: {
        paddingHorizontal:30
    },

    shutterBtn: {
        width:60,
        height:60,
        borderRadius:30,
        backgroundColor:"#fff",
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",
        marginBottom:50
    }
})