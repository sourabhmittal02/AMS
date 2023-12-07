import React, { Component } from 'react'
import { Image, FlatList, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class PendingApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EMP_NAME: '',
            EID: '',
            Name: '',
            scrName: 'Pending/Approval',
            Attendance: [],
            isLoading: false,
            showPopup: false,
            Remark: '',
            selectedRadio: 'Approve',
        }
    }
    componentDidMount = async () => {
        let empID = await AsyncStorage.getItem('EMP_NAME');
        this.setState({ EMP_NAME: empID });
        this._GetPendingApproval();
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
    _GetPendingApproval = async () => {
        this.setState({ isLoading: true });
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "emp_name": this.state.EMP_NAME,
        }
        fetch(global.URL + "Attendance/Dashboard/", {
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
                // if (respObject.response > 0) {
                //     Alert.alert(global.TITLE, respObject.status)
                // } else {
                //     this.setState({ isLoading: false });
                //     Alert.alert(global.TITLE, respObject.status)
                // }
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
    _DeleteAttendance = async (empid) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this Attendance?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => this.handleDelete(empid),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    }
    handleDelete = async (empid) => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "id": empid,
        }
        fetch(global.URL + "Attendance/DeleteRegularization/", {
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
                console.log("Attendance Delete==>", respObject);
                this._GetPendingApproval();
                this.setState({ isLoading: false });

            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "Error In Deleting Attendance");
            }
        });
    }
    _Approval(id, empName) {
        this.setState({ EID: id });
        this.setState({ EMP_NAME: empName });
        this.setState({ showPopup: !this.state.showPopup });
    }
    handleModalClose = async () => {
        if (this.state.Remark == '') {
            this.setState({ showPopup: false });
        }
        else {
            let token = "Bearer " + await AsyncStorage.getItem('Token');
            let status;
            if (this.state.selectedOption =="Approve"){
                status="1";
            }else{
                status="0";

            }
            let body = {
                "id": this.state.EID,
                "remark": this.state.Remark,
                "status": status
            }
            console.log(body);
            fetch(global.URL + "Attendance/ApproveAttendance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "platform": Platform.OS
                },
                body: JSON.stringify(body),
                redirect: 'follow'
            }).then(response => response.text()).then(async responseText => {
                this.setState({ isLoading: false });
                try {
                    let respObject = JSON.parse(responseText);
                    console.log("Response===>",respObject);
                    this._GetPendingApproval();
                    this.setState({ showPopup: false });
                } catch (error) {
                    this.setState({ isLoading: false });
                    console.log("1. ", error);
                    alert(error);
                }
            });
        }
    };
    handleOptionSelect = (option) => {
        this.setState({ selectedOption: option })
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
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Name</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Attt. Date</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>In</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Out</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Leave Type</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>On Leave</Text>
                <Text style={{ fontSize: 10, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Rem.</Text>
                <Text style={{ fontSize: 10, marginEnd: 10, alignSelf: "center", flex: 1, textAlign: 'center', color: "#fff" }}>Attendance</Text>
                <Text style={{ fontSize: 10, marginEnd: 10, alignSelf: "center", flex: 1, textAlign: 'center', color: "#fff" }}>Action</Text>
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
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.attendancE_DATE}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.iN_TIME}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.ouT_TIME}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.leavE_TYPE}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.iS_ON_LEAVE}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.emP_REMARK}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 9, flex: 1, color: "#000000" }}>{item.type}</Text>
                            <View style={{ margin: 10, flex: 1 }}>
                                {item.type == "OWN Attendance" ?
                                    <TouchableOpacity onPress={() => this._DeleteAttendance(item.id)}>
                                        <Image
                                            style={{ width: 30, height: 30, alignSelf: 'center' }}
                                            source={require('./images/delete.png')}
                                        />
                                        <Text style={{ fontSize: 9, color: 'red', alignSelf: 'center' }}>Delete</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this._Approval(item.id, item.emp_Name)}>
                                        <Image
                                            style={{ width: 30, height: 30, alignSelf: 'center' }}
                                            source={require('./images/approve.png')}
                                        />
                                        <Text style={{ fontSize: 9, color: 'green', alignSelf: 'center' }}>Approve/Reject</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    }
                />
                <Modal visible={this.state.showPopup} transparent={true} animationType='fade' onRequestClose={this.handleModalClose}>
                    <View style={[styles.popup]}>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.Label}>Emp Name:  {this.state.EMP_NAME}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={styles.optionContainer}
                                    onPress={() => this.handleOptionSelect("Approve")}
                                >
                                    <View style={styles.radioIcon}>
                                        {this.state.selectedOption === "Approve" && <View style={styles.selectedRadio} />}
                                    </View>
                                    <Text>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.optionContainer}
                                    onPress={() => this.handleOptionSelect("Reject")}
                                >
                                    <View style={styles.radioIcon}>
                                        {this.state.selectedOption === "Reject" && <View style={styles.selectedRadio} />}
                                    </View>
                                    <Text>Reject</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Enter Remark"
                                placeholderTextColor="#000"
                                onChangeText={(text) => { this.setState({ Remark: text }); }}
                            />
                        </View>
                        <TouchableOpacity onPress={this.handleModalClose}>
                            <Text>Update & Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
