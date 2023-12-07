import React, { Component } from 'react'
import { PermissionsAndroid,Dimensions, StyleSheet, ImageBackground, SafeAreaView, Image, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Status_STYLES = ['default', 'dark-content', 'light-content'];
const Status_TRANSITIONS = ['fade', 'slide', 'none'];

export default class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusBarStyle: Status_STYLES[0],
            statusBarTransition: Status_TRANSITIONS[0],
            hidden: true,
            IMEI: '',
            Latitude: '',
            Longitude: ''
        }
    }
    async componentDidMount() {
        this._GetImeiNumber();
        this.requestLocationPermission();
        let nm = await AsyncStorage.getItem('EMP_ID');
        console.log(nm);
        if (nm != null) {
            this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
        }
    }
    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            this.getCurrentLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getCurrentLocation();
                } else {
                    // Permission denied
                }
            } catch (error) {
                console.warn(error);
            }
        }
    }
    getCurrentLocation = async () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log('Current Location:', latitude, longitude);
                AsyncStorage.setItem('Current_Latitude', latitude.toString());
                AsyncStorage.setItem('Current_Longitude', longitude.toString());
            },
            error => {
                console.warn(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    _GetImeiNumber = async () => {
        try {
            const imei = await DeviceInfo.getUniqueId();
            console.log('IMEI number:', imei);
            await AsyncStorage.setItem('IMEI', imei);
            // Use the IMEI number as needed
        } catch (error) {
            console.error('Error getting IMEI:', error);
        }
    };
    _SignIn = () => {
        this.props.navigation.navigate('Login', { name: 'Login' })
    }
    // _SignUp = () => {
    //     this.props.navigation.navigate('SignUp', { name: 'SignUp' })
    //     // this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
    // }
    render() {
        return (
            <SafeAreaView style={styles.containerView}>
                <StatusBar barStyle="default" hidden={false} backgroundColor="#EF9439" translucent={false} animated={true} />
                {/* <ImageBackground source={require('./images/bg.png')} resizeMode="stretch" style={styles.img}> */}
                    <Text style={styles.logoText}>Welcome To</Text>
                    <Text style={styles.logoText}>HRMS</Text>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        {/* <Image
                            source={require('./images/logo.png')}
                            style={{ width: 100, height: 100 }}
                        /> */}
                    </View>
                    <View style={[styles.loginFormView]}>
                        <TouchableOpacity style={[styles.loginBtn, styles.shadowProp]} onPress={() => this._SignIn()}>
                            <Text style={styles.loginText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.loginFormView2}>
                        <TouchableOpacity style={[styles.loginBtn, styles.shadowProp]} onPress={() => this._SignUp()}>
                            <Text style={styles.loginText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View> */}
                {/* </ImageBackground> */}
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        //backgroundColor: "linear-gradient(180deg, #6546D7 0 %, #ab8395 100 %)",
        alignItems: "center",
        //justifyContent: "center",
    },
    img: {
        height: screenHeight,
        width: screenWidth,
    },
    logoText: {
        fontSize: 30,
        fontWeight: "800",
        marginTop: 30,
        marginBottom: 10,
        textAlign: "center",
        color: "#000",
        margin: 5,
    },
    loginFormView: {
        marginTop: 50,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    loginFormView2: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    shadowProp: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    loginBtn: {
        width: "70%",
        borderRadius: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#F6C899",//"#6546D7",
        color: "#000",

    },
    loginText: {
        fontSize: 20,
        color: "#000"
    },
});