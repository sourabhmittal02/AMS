import React, { Component } from 'react'
import { Image, FlatList, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default class LeaveDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrName: 'Leave Detail',
            EMP_NAME: '',
            isLoading:false,
            Attendance:[]
        }
    }
    componentDidMount = async () => {
        let empID = await AsyncStorage.getItem('EMP_NAME');
        this.setState({ EMP_NAME: empID });
        this._GetLeaveDetail();
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
    _GetLeaveDetail = async () => {
        this.setState({ isLoading: true });
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "emp_name": this.state.EMP_NAME,
        }
        fetch(global.URL + "Attendance/GetLeaveDetail/", {
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
                console.log("Data==>", respObject);
                this.setState({ Attendance: respObject })
                this.setState({ isLoading: false });

            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "Error In Getting List");
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
        });
    }
    FlatListHeader = () => {
        return (
            <View
                style={{
                    marginTop: 0,
                    height: 40,
                    width: "100%",
                    backgroundColor: "#EE9238",//"#b5f5bf",
                    flexDirection: 'row'
                }}>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 0.5, color: "#fff" }}>#</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Emp ID</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Name</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Leave Date</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Leave Type</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Remark</Text>
            </View>
        );
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} showBack={true} title={this.state.scrName} rightIcon={logout} openModeModel={this.state.scrName} />
                <FlatList
                    data={this.state.Attendance}
                    ListHeaderComponent={this.FlatListHeader}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                        //#99D9EA
                        <View style={{ paddingTop: 10, paddingBottom: 10, width: '100%', backgroundColor: index % 2 == 0 ? "#ffffff" : "#F3CBA3", flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 0.5, color: "#000000" }}>{index + 1}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.emp_Name}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.name}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.leave_Date}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.leave_Type}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.leave_Remark}</Text>
                        </View>
                    }
                />
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
