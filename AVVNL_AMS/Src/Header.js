import React from 'react';
import { Alert,BackHandler,View, TouchableOpacity, Text, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from './Service/NavigationService';
import BackIcon from './images/back.png';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    logout = async () => {
        // AsyncStorage.clear();
        Alert.alert(
            'Logout App',
            'Logout the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: async () => {
                    let IMEI = await AsyncStorage.getItem('IMEI');
                    await AsyncStorage.clear(); 
                    await AsyncStorage.setItem("IMEI", IMEI);
                    setTimeout(() => {
                        AsyncStorage.setItem('Current_Latitude', '');
                        AsyncStorage.setItem('Current_Longitude', '');
                        // NavigationService.navigateAndReset('Splash');
                        NavigationService.navigateAndReset('Login');
                    }, 1000); // Wait for 1 second
                    
                }
            },], {
            cancelable: false
        }
        )
        // global.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'Login' }],
        // });
    }
    goBack() {
        this.props.navigation.goBack();
    }
    render() {
        return (
            // <TouchableOpacity>
            <>
                <StatusBar barStyle="default" hidden={false} backgroundColor="#EF9439" translucent={false} animated={true} />
                <View on style={{ height: 40, backgroundColor: "#EF9439", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        {this.props.showBack && <TouchableOpacity onPress={() => { this.goBack() }}>
                            <Image style={{ width: 25, height: 25, marginRight: 0, resizeMode: 'contain', tintColor: "#ffffff", marginLeft: 10 }} source={BackIcon}></Image>
                        </TouchableOpacity>}
                    </View>
                    <Text style={{ flex: 1.8, fontSize: 16, color: "#ffffff", alignSelf: "center", textAlign: "center" }}>{this.props.title}</Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={this.logout}>
                            <Image style={{ width: 25, height: 25, marginRight: 0, tintColor: "#ffffff", marginRight: 10, resizeMode: 'contain' }} source={this.props.rightIcon}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                </>
            // </TouchableOpacity>
        )
    }
}
