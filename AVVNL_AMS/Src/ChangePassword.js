import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EMP_NAME: '',
            New_Password: '',
            Old_Password: '',
            Con_Password: '',
        }
    }
    async componentDidMount() {
        let EID = await AsyncStorage.getItem('EMP_NAME');
        this.setState({ EMP_NAME:EID});
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
    _SavePassword=async()=>{
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        console.log(token);
        if (this.state.Old_Password == '' || this.state.New_Password == '' || this.state.Con_Password == '' ){
            Alert.alert(global.TITLE,"All Field(s) Are Mandatory");
        } else if (this.state.New_Password != this.state.Con_Password){
            Alert.alert(global.TITLE, "New Password is not same as Confirm Password");
        }else{
            let body = {
                "loginId": this.state.EMP_NAME,
                "password": this.state.New_Password,
            }
            console.log(body);
            console.log(global.URL + "Login/ChangePassword/");
            fetch(global.URL + "Login/ChangePassword/", {
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
                    console.log(responseText);
                    if (respObject.response > 0) {
                        Alert.alert(global.TITLE, respObject.status)
                    } else {
                        this.setState({ isLoading: false });
                        Alert.alert(global.TITLE, respObject.status)
                    }
                    this.setState({ isLoading: false });

                }
                catch (error) {
                    this.setState({ isLoading: false });
                    console.log(error);
                    Alert.alert(global.TITLE, "Error In Changing Password");
                }
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
                Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
            });
        }
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} showBack={true} title={"Change Password"} rightIcon={logout} openModeModel={'Change Password'} />
                <ScrollView>
                    <View style={{ margin: 10, flexDirection: 'column' }}>
                        <View style={[styles.inputView, { flex: 2, margin: 10 }]}>
                            <TextInput
                                style={styles.TextInput}
                                editable={true}
                                placeholder='Old Password'
                                placeholderTextColor="#ccc"
                                value={this.state.Old_Password}
                                secureTextEntry={true}
                                onChangeText={(text) => { this.setState({ Old_Password: text }); }}
                            />
                        </View>
                        <View style={[styles.inputView, { flex: 2, margin: 10 }]}>
                            <TextInput
                                style={styles.TextInput}
                                editable={true}
                                placeholder='New Password'
                                placeholderTextColor="#ccc"
                                value={this.state.New_Password}
                                secureTextEntry={true}
                                onChangeText={(text) => { this.setState({ New_Password: text }); }}
                            />
                        </View>
                        <View style={[styles.inputView, { flex: 2, margin: 10 }]}>
                            <TextInput
                                style={styles.TextInput}
                                editable={true}
                                placeholder='Confirm Password'
                                placeholderTextColor="#ccc"
                                value={this.state.Con_Password}
                                secureTextEntry={true}
                                onChangeText={(text) => { this.setState({ Con_Password: text }); }}
                            />
                        </View>
                        <View style={[{ width: '90%' }, styles.loginFormView]}>
                            <TouchableOpacity style={[styles.BtnLogin, styles.shadowProp,]}  onPress={() => this._SavePassword()} >
                                    <Text style={{ fontSize: 18, color: '#fff', alignSelf: 'center' }}>Update Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
