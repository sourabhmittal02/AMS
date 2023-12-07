import React, { Component } from 'react'
import { BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
// import uuid from 'react-native-uuid';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            IMEI: '',
            EMP_NAME: '',
            isEnable:false,
            isLoading: false,
            persistentUniqueId:'',
        }
    }
    componentDidMount = async () => {
        this._GetImeiNumber();
        // this.getPersistentUniqueId();
        this.requestLocationPermission();
        let empID = await AsyncStorage.getItem('EMP_ID');
        console.log("EMPID==>", empID);
        if (empID != null)
            this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
    }
    componentWillUnmount() {
        Geolocation.clearWatch(this.watchId);
    }
    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            this.getCurrentLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location.',
                        buttonPositive: 'OK',
                    },
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getCurrentLocation();
                } else {
                    console.log('Location permission denied');
                    BackHandler.exitApp();
                }
            } catch (error) {
                // console.warn(error);
                console.error('Failed to request location permission:', error);
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
                this.setState({isEnable:true});
            },
            error => {
                console.warn(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 0 }
        );
        this.watchId = Geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;
                AsyncStorage.setItem('Current_Latitude', latitude.toString());
                AsyncStorage.setItem('Current_Longitude', longitude.toString());
            },
            error => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 0 },
        );
    }
    _GetImeiNumber = async () => {
        try {
            const imei = await DeviceInfo.getUniqueId();
            console.log('IMEI number:', imei);
            this.setState({ IMEI: imei });
            await AsyncStorage.setItem('IMEI', imei);
            // Use the IMEI number as needed
        } catch (error) {
            console.error('Error getting IMEI:', error);
        }
    };
    // getPersistentUniqueId = async () => {
    //     let persistentUniqueId = await AsyncStorage.getItem('IMEI');
    //     console.log("Before IMEI=>", persistentUniqueId);

    //     if (!persistentUniqueId) {
    //         persistentUniqueId = uuid.v4();
    //         await AsyncStorage.setItem('IMEI', persistentUniqueId);
    //     }
    //     this.setState({ IMEI:persistentUniqueId });
    //     console.log("IMEI=>", this.state.IMEI);
    // };
    _SignIn=async()=> {
        if(this.state.isEnable==false){
            this.requestLocationPermission();
        }
        let latitude = await AsyncStorage.getItem('Current_Latitude');
        if(latitude=="" || latitude==null){
            Alert.alert(global.TITLE, "Please Enable You Location in order to use this Application!");
        }
        else if (this.state.username == "" || this.state.password == "") {
            Alert.alert(global.TITLE, "Field(s) Can't Be Left Empty");
        } else {
            let body = {
                "loginId": this.state.username,
                "password": this.state.password,
            }
            this.setState({ isLoading: true })
            fetch(global.URL + "Login/DoLogin/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "platform": Platform.OS
                },
                body: JSON.stringify(body),
                redirect: 'follow'
            }).then(response => response.text()).then(async responseText => {
                try {
                    var respObject = JSON.parse(responseText);
                    console.log(respObject);
                    if (respObject.id > 0) {
                        this.setState({ EMP_NAME: respObject.emp_Name.toString() });
                        await AsyncStorage.setItem('uname', this.state.username);
                        await AsyncStorage.setItem('pass', this.state.password);
                        await AsyncStorage.setItem('Name', respObject.name);
                        await AsyncStorage.setItem('ROLE_ID', respObject.rolE_ID.toString());
                        await AsyncStorage.setItem('EMP_NAME', respObject.emp_Name.toString());
                        await AsyncStorage.setItem('EMP_ID', respObject.empID.toString());
                        await AsyncStorage.setItem('officE_ID', respObject.officE_ID.toString());
                        await AsyncStorage.setItem('Token', respObject.accessToken);
                        await AsyncStorage.setItem('Latitude', respObject.latitude);
                        await AsyncStorage.setItem('Longitude', respObject.lognitude);
                        await AsyncStorage.setItem('InTime', respObject.inTime);
                        await AsyncStorage.setItem('OutTime', respObject.outTime);
                        
                        if (respObject.is_On_Leave == true)
                            await AsyncStorage.setItem('Leave', "1");
                        else
                            await AsyncStorage.setItem('Leave', "0");

                        if (respObject.is_On_Tour == true)
                            await AsyncStorage.setItem('Tour', "1");
                        else
                            await AsyncStorage.setItem('Tour', "0");

                        await AsyncStorage.setItem('LoginRange', respObject.login_Within_Range);
                        // this.props.navigation.navigate('MarkAttendance', { name: 'MarkAttendance' })
                        if (respObject.device_ID == null) {
                            this.UpdateDevideId();
                        } else if (this.state.IMEI == respObject.device_ID.toString()) {
                            this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
                        }else{
                            Alert.alert("AVVNL_AMS","username is registered with another device");
                            this.props.navigation.navigate('Login', { name: 'Login' })                            
                        }
                        this.setState({ isLoading: false });
                    } else {
                        this.setState({ isLoading: false });
                        Alert.alert(global.TITLE, "Invalid Username or Password")
                    }
                    this.setState({ isLoading: false });

                }
                catch (error) {
                    this.setState({ isLoading: false });
                    console.log(error);
                    Alert.alert(global.TITLE, "Invalid Username or Password");
                }
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
                Alert.alert(global.TITLE, " " + error);
            });
        }
    }
    _GetToken = async () => {
        let body = {
            "loginId": await AsyncStorage.getItem('uname'),
            "password": await AsyncStorage.getItem('pass'),
        }
        fetch(global.URL + "Login/GetToken/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                await AsyncStorage.setItem('Token', respObject.accessToken);
            }
            catch (error) {
                console.log(error);
                Alert.alert(global.TITLE, "Error In Getting Token");
            }
        });
    }
    UpdateDevideId=async() =>{
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "emP_NAME": this.state.EMP_NAME,
            "devicE_ID": this.state.IMEI,
        }
        console.log("BODY===>",body);
        fetch(global.URL + "Attendance/UpdateDeviceID/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                console.log(respObject);
                if(respObject.response==0){
                    this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
                } else if (respObject.response == 2) {
                    AsyncStorage.clear();
                    Alert.alert(global.TITLE, respObject.status);
                }
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
        });
    }
    render() {
        return (
            <SafeAreaView style={styles.containerView}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#EF9439" translucent={false} animated={true} />
                {/* <View style={{ margin: 40, justifyContent: 'center', alignItems: 'center' }}>
                </View> */}
                <View style={{ margin: 80, alignItems: 'center', justifyContent: 'center' }}>
                    {/* <Image
                        source={require('./images/logo.png')}
                        style={{ width: 100, height: 100 }}
                    /> */}
                    <Text style={styles.logoText1}>Attendance</Text>
                    <Text style={styles.logoText2}>Management System</Text>
                </View>
                <View style={styles.loginBox}>
                    <Text style={{ margin: 10, fontFamily: "Arial", fontSize: 25, fontWeight: 'bold', color: '#000' }}>Login</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Username"
                            placeholderTextColor="#000"
                            onChangeText={(user) => { this.setState({ username: user }); }}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Password"
                            placeholderTextColor="#000"
                            secureTextEntry={true}
                            onChangeText={(pass) => { this.setState({ password: pass }); }}
                        />
                    </View>
                </View>
                <View style={[{ flex: 1 }, styles.loginFormView]}>
                    <TouchableOpacity style={[styles.BtnLogin, styles.shadowProp,]} onPress={() => this._SignIn()}>
                        {/* <ImageBackground source={require('./images/bg.png')} style={[styles.backgroundImage]}> */}
                        <Text style={[{ margin: 10 }, styles.BtnText]}>Login</Text>
                        {/* </ImageBackground> */}
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isLoading}>
                    <View style={{ flex: 1, backgroundColor: "#ffffffee", alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#F60000" />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#434343", margin: 15 }}>Loading....</Text>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
    },
    img: {
        height: screenHeight,
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000'
    },
    image: {
        marginBottom: 40,
        backgroundColor: "#009A22",//"#11245a",
        height: 100, resizeMode: 'contain'
    },

    inputView: {
        // backgroundColor: "#fff",
        borderRadius: 5,
        width: "70%",
        height: 45,
        marginBottom: 30,
        alignItems: "center",
    },

    TextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 15,
        width: "100%",
        // color: "#000",
        borderWidth: 1,
        // borderColor: "#eaeaea",
        backgroundColor: "#fafafa",
        borderColor: "#000",
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 5,
    },

    forgot_button: {
        height: 30,
        marginBottom: 30,
    },

    loginBtn: {
        width: "50%",
        borderRadius: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#6546D7",
        color: "#fff",
    },
    loginText: {
        fontSize: 20,
        color: "#fff"
    },
    shadowProp: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
});