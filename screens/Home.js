import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image, Modal, Linking, Alert } from 'react-native'
import { MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons'
import Cam from './Cam'
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

export default class Home extends Component {
    constructor(){
        super()
        this.state = {
            image:null,
            openCam:false
        }
    }

    openCam = ()=> {
        this.setState({
            openCam:true
        })
    }

    closeCam = ()=> {
        this.setState({
            openCam:false
        })
    }

    getImage = (image) => {
        this.setState({
            image:image.uri,
            openCam:false
        })
    }

    savePhoto = () => {
        MediaLibrary.createAssetAsync(this.state.image)
        .then(res=>{
            ImageManipulator.manipulateAsync(res.uri, [{
                resize:{
                    width:500,
                    height:500
                }
            }])
            .then(res=>{
                console.log(res);
                let encodedURL = encodeURIComponent(res.uri);
                let instagramURL = "instagram://library?AssetPath="+encodedURL
                Linking.openURL(instagramURL)
            })
            .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e))
    }

    pickImage = () => {
        ImagePicker.requestCameraRollPermissionsAsync()
        .then(res=>{
            if(res.status!=="granted"){
                Alert.alert(
                    "Permission Reqiured", 
                    "Kindly allow permission in settings to continue",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "Open Settings", 
                            onPress: () => Linking.openSettings()
                            .then(()=>{
                                this.setState({
                                    image:null
                                })
                            })
                            .catch(e=>console.log(e))
                        }
                    ],
                    {cancelable: false}
                )
                return
            }
            ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })        
            .then(result=>{
                if (!result.cancelled) {
                    this.setState({
                        image:result.uri
                    })
                }
            })
            .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e))
    }

    

    shareToIg = ()=> {
        MediaLibrary.getPermissionsAsync()
        .then(res=>{
            if(res.status==="granted"){
                this.savePhoto()
            }
            MediaLibrary.requestPermissionsAsync()
            .then(res=>{
                if(res.status==="granted"){
                    this.savePhoto()
                } else {
                    Alert.alert(
                        "Permission Reqiured", 
                        "Kindly allow permission in settings to continue",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: "Open Settings", 
                                onPress: () => Linking.openSettings()
                            }
                        ],
                        {cancelable: false}
                    )
                }
            })
        })
        .catch(e=>console.log(e))
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Image sharing app!</Text>
                <View style={styles.imageContainer}>
                    {
                        this.state.image!==null ?
                        <Image style={styles.image} source={{uri:this.state.image}} /> :
                        <TouchableOpacity onPress={this.pickImage}>
                            <MaterialCommunityIcons name="image-plus" size={60} color="#4630EB" />
                        </TouchableOpacity>
                    }
                </View>
                {
                    this.state.image===null ?
                    <TouchableOpacity onPress={this.openCam} style={styles.btn}>
                        <Text style={styles.btnText}><Entypo name="camera" size={24} color="#fff" /> Open camera</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity onPress={this.shareToIg} style={styles.btn}>
                        <Text style={styles.btnText}><AntDesign name="instagram" size={24} color="#fff" /> Share to instagram</Text>
                    </TouchableOpacity>
                }
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.openCam}
                    onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                    }}
                >
                    <Cam getImage={this.getImage} close={this.closeCam} />
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingVertical:"20%",
        marginHorizontal:20
    },

    btn: {
        backgroundColor:"#4630EB",
        width:"100%",
        paddingVertical:15,
        position:"absolute",
        bottom:80,
        borderRadius:8,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
    },

    btnText: {
        textAlign:"center",
        color:"#fff",
        fontWeight:"bold",
        fontSize:24
    },

    title: {
        fontSize:30,
        fontWeight:"bold"
    },

    imageContainer: {
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        height:500,
        backgroundColor:"#eee",
        marginTop:30,
        resizeMode:"contain"
    },

    image:{
        width:"100%",
        height:500
    }
})
