import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, BackHandler, Alert, ActivityIndicator, Dimensions, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            openModel: false,
            scrName: 'Profile',
            Name:'',
            Email:'',
            Address:'',
            Phone:'',
            UID:'',
        }
    }
    async componentDidMount() {
        let uid = await AsyncStorage.getItem('USER_ID');
        this.setState({UID: uid});
       this. _GetUserDetails(uid);
    }
    _GetUserDetails(uid){
        fetch(global.URL + "api/apiLogin/GetDetail", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User_ID": uid,
                "platform": Platform.OS
            },
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try{

                var respObject = JSON.parse(responseText);
                console.log("Data=====>",respObject);
                if (respObject==null){
                    Alert.alert("AVVNL","No Data Found");
                }else{
                    
                    console.log("Details  =", respObject[0].MOBILE_NO);
                    this.setState({ Name: respObject[0].NAME });
                    this.setState({ Email: respObject[0].EMAIL_ID });
                    this.setState({ Address: respObject[0].ADDRESS });
                    this.setState({ Phone: respObject[0].MOBILE_NO.toString() });
                }
            } catch (error) {
                this.setState({ isLoading: false });
                console.log("1. ", error);
                alert(error);
            }
        });
    }
    _Update(){
        fetch(global.URL + "api/apiLogin/UpdateDetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User_ID": this.state.UID,
                "Name":this.state.Name,
                "Address":this.state.Address,
                "Email":this.state.Email,
                "Phone":this.state.Phone,
                "platform": Platform.OS
            },
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            var respObject = JSON.parse(responseText);
            if(respObject==1){
                Alert.alert(global.TITLE,"User Details Updated Successfully");
                this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
            }else{
                Alert.alert(global.TITLE,"Error In Updating User Details");
            }
        });
    }
    render() {
        return (
            <SafeAreaView style={styles.containerView}>
                <Header navigation={this.props.navigation} showBack={true} showImage={false} title={this.state.scrName} rightIcon={logout} openModeModel={'ChangePass'} />
                <ScrollView>
                    <View style={[styles.inputView, { margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Name</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Name}
                            onChangeText={(user) => { this.setState({ Name: user }); }}
                        />
                    </View>
                    <View style={[styles.inputView, { marginTop: 5, margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Address</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Address}
                            onChangeText={(adrs) => { this.setState({ Address: adrs }); }}
                        />
                    </View>
                    <View style={[styles.inputView, { margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Email</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Email}                            
                            onChangeText={(email) => { this.setState({ Email: email }); }}
                        />
                    </View>
                    <View style={[styles.inputView, { marginTop: 5, margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Mobile</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Phone}
                            keyboardType='number-pad'
                            onChangeText={(mbl) => { this.setState({ Phone: mbl }); }}
                        />
                    </View>
                    <View style={[{ width: screenWidth - 15 }, styles.loginFormView]}>
                        <TouchableOpacity style={[styles.Btn, styles.shadowProp]} onPress={() => this._Update()}>
                            <ImageBackground source={require('./images/bg.png')} style={[styles.backgroundImage]}>
                                <Text style={[{ margin: 10 }, styles.BtnText]}>Update</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
