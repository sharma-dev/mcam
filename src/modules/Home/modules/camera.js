import AsyncStorage from '@react-native-community/async-storage';
import React, { PureComponent } from 'react';
import { Dimensions, Platform, View, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { cameraStyle as styles } from "../style";
import Footer from "./Footer";
import Grid from './Grid';
import Header from "./Header";

const cameraPermissionConfig = {
    title: 'Permission to use camera',
    message: 'We need your permission to use your camera',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel'
};

const audioRecordingPermissionConfig = {
    title: 'Permission to use audio recording',
    message: 'We need your permission to use your audio',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
};

class Camera extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            frontCam: false,
            flash: false,
            ratio: "4:3"
        }
    }

    componentDidMount = async () => {
        try{
            let ratio = await AsyncStorage.getItem("CAMERA_RATIO");
            if(ratio) this.setState({ratio: ratio})
        }catch(err){
            console.log(err);
        }
    };
    

    getCameraType = () => {
        if(this.state.frontCam){
            return RNCamera.Constants.Type.front;
        }
        return RNCamera.Constants.Type.back;
    }

    getFlash = () => {
        if(this.state.flash){
            return RNCamera.Constants.FlashMode[this.state.flash];
        }

        return RNCamera.Constants.FlashMode.off;
    }

    getGrid = () => {
        if(this.state.grid){
            return this.setState({GridMode: this.state.switchValue});
        }
    }

    takePicture = async () => {
        try{
            if(this._camera){
                const options = {
                    quality: this.props.settings.imageQuality && parseFloat(this.props.settings.imageQuality) || 0.5,
                    base64: false
                }
                const data = await this._camera.takePictureAsync(options);
                if(this.props.onClick){
                    this.props.onClick(data.uri);
                }else{
                    console.log("Picture is taken and stored at temp folder at ", data.uri);
                }
            }
        }catch(error){
            console.log("Error Occured while capturing the image", error);
        }
    }

    onGallery = () => {
        this.props.navigation.navigate("Gallery");
    }

    changeCamera = () => {
        this.setState({
            frontCam: !this.state.frontCam
        })
    }

    handleFlash = () => {
        let flash = this.state.flash
        if ( !flash ) flash = "on"
        else if ( flash == "on") flash = "auto"
        else if (flash == "auto") flash = false
        this.setState( {
            flash: flash
        })
    }
    
    handleGrid = () => {
        let grid = this.state.switchValue
        if ( !grid ) grid = false
        else grid = true
        this.setState( {
            grid: grid
        })
    }
    prepareRatio = async () => {
        try{
            if (Platform.OS === 'android' && this._camera) {
                let ratio = this.state.ratio
    
                
                let ratios = await this._camera.getSupportedRatiosAsync();
                if(ratio == "1:1") ratio = "4:3"
                else if(ratio == "4:3"){
                    if(ratios.includes("19:9"))
                        ratio = "19:9";
                    else if(ratios.includes("16:9"))
                        ratio = "16:9";
                    else
                        ration= "1:1"
                } else if(ratio == '19:9' || ratio == '16:9'){
                    ratio = "1:1";
                }
                await AsyncStorage.setItem("CAMERA_RATIO", ratio)
                this.setState({ ratio: ratio });
            }
        }catch(err){
            console.log("Error in prepareRatio", err)
        }
    }
    getCameraViewHeight = () => {
        let {width, height} = Dimensions.get('window');
        return this.getHeightForRatio(height, width, this.state.ratio);
    }

    getHeightForRatio = (height, width, ratio) => {
        let hght = height;
        ratio = ratio.split(":")
        let h = ratio[0]
        let w = ratio[1]
        hght = (h*width/w);
        if(height - hght < 200) return height;
        if(hght < 100) return 100;
        return hght;
    }

    getPreviewDimensions = () => {
        let {width, height} = Dimensions.get('window');
        width = width - (width / 100) * 50;
        let h = this.getHeightForRatio(height, width, this.state.ratio);
        return {width, height: h};
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.imageTaken && this.props.lastImageTaken && prevProps.lastImageTaken !== this.props.lastImageTaken){
            this.setPreview(this.props.lastImageTaken);
        }
    }
    

    setPreview = img => {
        let previewTimeOut = this.props.settings.previewTime;
        if(!this.state.previewUri && this.props.activeTrip && this.props.activeTrip.name && previewTimeOut !== 0){
            img = `file:${img}`;
            this.setState({
                previewUri: img
            });

            setTimeout(() => {
                this.setState({
                    previewUri: null
                })
            }, parseInt(previewTimeOut) * 1000)
        }
    }


    render() {
        let height = this.getCameraViewHeight();
        let previewDimensions = this.getPreviewDimensions();
        let previewImage = this.state.previewUri;
        let { grid, captureSound } = this.props.settings;
        return (
            <View style={styles.container}>
                <Header 
                    {...this.props}
                    onFlash = {this.handleFlash} 
                    isFlash={!this.state.frontCam}
                    flash = {this.state.flash}
                    onRatioChange = {this.prepareRatio} 
                    ratio = {(this.state.ratio == "16:9" || this.state.ratio == "19:9") ? "FULL_SCREEN" : this.state.ratio}
                />
                {previewImage &&
                    <View style={styles.previewContainer}>
                        <Image source={{width: previewDimensions.width, height: previewDimensions.height, uri: previewImage}} style={styles.preview}/>
                    </View>
                }
                {(grid) &&
                    <Grid height = {height} />
                }
                <RNCamera
                    ratio={this.state.ratio}
                    ref={(ref) => {
                        this._camera = ref;
                    }}
                    style={[{
                        height: height
                    }, styles.camera]}
                    type={this.getCameraType()}
                    flashMode={this.getFlash()}
                    playSoundOnCapture={captureSound}
                    androidCameraPermissionOptions={cameraPermissionConfig}
                    androidRecordAudioPermissionOptions={audioRecordingPermissionConfig}
                />
                <Footer 
                    takePicture={this.takePicture} 
                    onChangeCamera={this.changeCamera} 
                    onGallery={this.onGallery}
                    lastImageTaken={this.props.lastImageTaken}
                />
            </View>
        );
    }
}

export default Camera;