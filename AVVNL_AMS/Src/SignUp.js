import React, { Component } from 'react'
import { Dimensions, StyleSheet, ImageBackground, SafeAreaView, Image, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Username: '',
            Password: '',
            Name: '',
            Address: '',
            Mobile: '',
            EMail: '',
            OfficeId:'',
            OfficeList:[],
            ManagerId:0,
            scrName: 'Sign Up',
            isLoading: false,
        }
    }
    componentDidMount=async()=>{
        let eid = await AsyncStorage.getItem('EMP_ID');
        this.setState({ ManagerId:eid});
        this._GetOfficeList();
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
    _CheckUser = async () => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "userName": this.state.Username,
        }
        fetch(global.URL + "Complaint/CheckUserAvailability", {
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
                if (respObject.response === 1) {
                    this.setState({ isLoading: false });
                    Alert.alert(global.TITLE, respObject.status)
                } else {
                    this.setState({ isLoading: false });
                    this.setState({ username: '' });
                    Alert.alert(global.TITLE, respObject.status)
                }
                this.setState({ isLoading: false });

            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "Error In Getting User Availability");
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
        });
    }
    _GetOfficeList=async()=>{
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        fetch(global.URL + "Attendance/GetOfficeList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            // body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                console.log(respObject);
                let List=[];
                respObject.forEach(element => {
                    let dropdownObject = { label: element.office_name, value: element.officeID }
                    List.push(dropdownObject);
                });
                this.setState({OfficeList:List});

            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "Error In Getting Office List");
            }
        });
    }
    _SignUp = async () => {
        // const regex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
        const regex = /^\d{10}$/;
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        if (regex.test(this.state.Mobile) && this.state.Mobile!='') {
            if (regexEmail.test(this.state.EMail)) {
                let body = {
                    "emP_NAME": this.state.Username,
                    "password": this.state.Password,
                    "name": this.state.Name,
                    "address": this.state.Address,
                    "mobilE_NO": this.state.Mobile,
                    "email": this.state.EMail,
                    "photo": "NA",
                    "rolE_ID": 1,
                    "mangerid": this.state.ManagerId,
                    "officE_ID": this.state.OfficeId,
                    "latitude": "0",
                    "lognitude": "0",
                    "logiN_WITHIN_RANGE": "100"
                }
                console.log(body);
                fetch(global.URL + "Login/SignUP", {
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
                        if (respObject.response > 0) {
                            this.setState({ isLoading: false });
                            Alert.alert(global.TITLE, respObject.status)
                            this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
                        } else {
                            this.setState({ isLoading: false });
                            Alert.alert(global.TITLE, "Error In Register New User")
                        }
                        this.setState({ isLoading: false });

                    }
                    catch (error) {
                        this.setState({ isLoading: false });
                        console.log(error);
                        Alert.alert(global.TITLE, "Error In Register New User");
                    }
                }).catch(error => {
                    console.log(error);
                    this.setState({ isLoading: false });
                    Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
                });
            }else{
                Alert.alert('Invalid Email', 'Please enter a valid email address.');
            }
            
        } else {
            Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
        }        
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation} showBack={true} title={this.state.scrName} rightIcon={logout} openModeModel={this.state.scrName} />
                <StatusBar barStyle="default" hidden={false} backgroundColor="#EF9439" translucent={false} animated={true} />
                <ScrollView>
                    <Text style={styles.SignUpLogoText}>AVVNL AMS</Text>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        {/* <Image
                            source={require('./images/logo.png')}
                            style={{ width: 100, height: 100 }}
                        /> */}
                    </View>
                    <View style={styles.SignloginBox}>
                        <Text style={{ fontFamily: "Arial", fontSize: 25, fontWeight: 'bold', color: '#000' }}>Sign Up</Text>
                        <View style={[styles.inputView, {height: 30, marginTop: 20, marginBottom: 20 }]}>
                            <Dropdown
                                style={[styles.dropdown, this.state.isFocus && {borderColor: 'blue' }]}
                                itemTextStyle={styles.dropdownText}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={this.state.OfficeList}
                                maxHeight={300}
                                search={true}
                                labelField="label"
                                valueField="value"
                                placeholder={!this.state.isFocus ? 'Select Office' : '...'}
                                searchPlaceholder="Search..."
                                value={this.state.OfficeId}
                                onFocus={() => this.setState({ isFocus: true })}
                                onBlur={() => this.setState({ isFocus: false })}
                                onChange={item => {
                                    this.setState({ OfficeId: item.value });
                                    this.setState({ isFocus: false })
                                }}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Username"
                                placeholderTextColor="#000"
                                onChangeText={(user) => { this.setState({ Username: user }); }}
                            />
                            {/* <TouchableOpacity style={[styles.loginBtn, styles.shadowProp]} onPress={() => this._CheckUser()}>
                                <Text style={styles.loginText}>Check Availability</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Password"
                                placeholderTextColor="#000"
                                secureTextEntry={true}
                                onChangeText={(pass) => { this.setState({ Password: pass }); }}
                            />
                        </View>                        
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Name"
                                placeholderTextColor="#000"
                                onChangeText={(text) => { this.setState({ Name: text }); }}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Address"
                                placeholderTextColor="#000"
                                onChangeText={(text) => { this.setState({ Address: text }); }}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Mobile No."
                                placeholderTextColor="#000"
                                keyboardType='decimal-pad'
                                onChangeText={(text) => { this.setState({ Mobile: text }); }}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Email Id"
                                placeholderTextColor="#000"
                                keyboardType='email-address'
                                onChangeText={(text) => { this.setState({ EMail: text }); }}
                            />
                        </View>
                    </View>
                    <View style={[{ width: screenWidth - 20 }, styles.loginFormView]}>
                        <TouchableOpacity style={[styles.BtnLogin, styles.shadowProp,]} onPress={() => this._SignUp()}>
                            {/* <ImageBackground source={require('./images/bg.png')} style={[styles.backgroundImage]}> */}
                                <Text style={[{ margin: 10 }, styles.BtnText]}>Sign Up</Text>
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
                </ScrollView>
            </SafeAreaView>
        )
    }
}
