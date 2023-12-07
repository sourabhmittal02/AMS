import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default class MarkAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EMP_ID: '',
            Name: '',
            EmpName: '',
            Remark: 'OK',
            Email: '',
            RoleId: '',
            Current_Latitude: '',
            Current_Longitude: '',
            Latitude: '',
            Longitude: '',
            Sel_Latitude: '',
            Sel_Longitude: '',
            sel_Range: '',
            IMEI: '',
            InTime: '',
            OutTime: '',
            selectedOption: 'Attendance',
            Distance: '',
            LoginRange: '',
            isLoading: false,
            openModel: false,
            isFirst: false,
            isSecond: false,
            isThird: false,
            isLeave: false,
            isTour: false,
            isLeaveShow: false,
            isAttendanceShow: false,
            LeaveType: '',
            OfficeList: [],
            OfficeName: '',
            LeaveList: [{ label: 'Privilege Leave', value: 'PL' },
            { label: 'Earned Leave', value: 'EL' },
            { label: 'Annual Leave', value: 'AL' },
            { label: 'Casual Leave', value: 'CL' },
            { label: 'Sick Leave', value: 'SL' },
            { label: 'Maternity Leave', value: 'ML' },
            ]
        }
    }
    async componentDidMount() {
        let Current_latitude = await AsyncStorage.getItem('Current_Latitude');
        let Current_longitude = await AsyncStorage.getItem('Current_Longitude');
        let latitude = await AsyncStorage.getItem('Latitude');
        let longitude = await AsyncStorage.getItem('Longitude');
        let imei = await AsyncStorage.getItem('IMEI');
        // let empname = await AsyncStorage.getItem('Name');
        // let roleid = await AsyncStorage.getItem('ROLE_ID');
        // let EID = await AsyncStorage.getItem('EMP_ID');
        let InTime = await AsyncStorage.getItem('InTime');
        let trimmedTime = InTime.substring(0, 8);
        let OutTime = await AsyncStorage.getItem('OutTime');
        let trimmedOutTime = OutTime.substring(0, 8);
        console.log(trimmedTime);
        let loginrange = await AsyncStorage.getItem('LoginRange');
        this.setState({ EMP_ID: await AsyncStorage.getItem('EMP_ID') });
        this.setState({ EmpName: await AsyncStorage.getItem('Name') });
        this.setState({ RoleId: await AsyncStorage.getItem('ROLE_ID') });
        this.setState({ Current_Latitude: Current_latitude });
        this.setState({ Current_Longitude: Current_longitude });
        this.setState({ Latitude: latitude });
        this.setState({ Longitude: longitude });
        this.setState({ IMEI: imei });
        this.setState({ InTime: trimmedTime });
        this.setState({ OutTime: trimmedOutTime });
        this.setState({ LoginRange: loginrange });
        let nm = await AsyncStorage.getItem('Name');
        this.setState({ Name: nm });
        this._CheckAttendance();
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    // componentWillUnmount() {
    //     BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    // }

    handleOptionSelect = (option) => {
        this.setState({ selectedOption: option })
        if (option == "Leave") {     //LeaveType DropeDown show/Hide
            this.setState({ isLeaveShow: true })
            this.setState({ isAttendanceShow: false })
        }
        else if (option == 'AttendanceOut' || option == 'PunchOutofLoc') {
            this._GetOfficeList();
            this.setState({ isAttendanceShow: true })
            this.setState({ isLeaveShow: false })
        }
        else {
            this.setState({ isAttendanceShow: false })
            this.setState({ isLeaveShow: false })
        }
    }
    _GetOfficeList = async () => {
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
                let List = [];
                respObject.forEach(element => {
                    let dropdownObject = { label: element.office_name, value: element.officeID, offLat: element.latitude, offLog: element.longitude, offRange: element.range }
                    List.push(dropdownObject);
                });
                this.setState({ OfficeList: List });
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "Error In Getting Office List");
            }
        });
    }
    calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.degToRad(lat2 - lat1);
        const dLon = this.degToRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c * 1000; // Distance in meters
        return distance;
    };
    degToRad = deg => (deg * Math.PI) / 180;
    _CheckAttendance = async () => {
        const distance = this.calculateDistance(this.state.Current_Latitude, this.state.Current_Longitude, this.state.Latitude, this.state.Longitude);
        this.setState({ Distance: distance });
        console.log(">>>> Distance ", distance);
        let leave = await AsyncStorage.getItem('Leave');
        let tour = await AsyncStorage.getItem('Tour');
        if (leave == "1") {
            this.setState({ isLeave: true });
        } else if (tour == "1") {
            this.setState({ isTour: true });
        } else {

            if (this.state.InTime == "00:00:00" && this.state.OutTime == "00:00:00") {
                //First Login
                this.setState({ isFirst: true });
                console.log("1");
            } else if (this.state.InTime != "00:00:00" && this.state.OutTime == "00:00:00") {
                this.setState({ isSecond: true });
                console.log("2");
            } else if (this.state.InTime != "00:00:00" && this.state.OutTime != "00:00:00") {
                this.setState({ isThird: true });
                console.log("3::", this.state.InTime);
            }
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
    _SaveAttendance = async () => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        if (this.state.Current_Latitude === '' || this.state.Current_Longitude === '') {
            Alert.alert("HRMS", "Please Enable Location Access in Restart the Application");
        } else if (this.state.selectedOption == '' || this.state.Remark == '') {
            Alert.alert("HRMS", "Please Select Attendance Type and/or Fill Remark");
        } else {
            if (this.state.selectedOption == "Attendance") {
                console.log("in con 1");
                let body = {
                    "emp_Id": this.state.EMP_ID,
                    "latitude": this.state.Current_Latitude.toString(),
                    "lognitude": this.state.Current_Longitude.toString(),
                    "leave_Type": "NA",
                    "remark": this.state.Remark,
                    "iP_Address": "NA",
                    "device_ID": this.state.IMEI,
                    "att_Type": "1"
                }
                console.log(token);
                console.log(body);
                fetch(global.URL + "Attendance/PunchAttendance/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                        "platform": Platform.OS
                    },
                    body: JSON.stringify(body),
                    redirect: 'follow'
                }).then(response => response.text()).then(async responseText => {
                    let respObject = JSON.parse(responseText);
                    if (respObject.response == 1) {
                        Alert.alert(global.TITLE, respObject.status);
                    }
                }).catch(error => {
                    console.log(error);
                    this.setState({ isLoading: false });
                    Alert.alert(global.TITLE, "1. There is some problem. Please try again" + error);
                });
            } else if (this.state.selectedOption == "AttendanceOut") { //Attendance Out of Location
                console.log("in con 2");
                // Get Attendance Range from office location with current location
                const distance = this.calculateDistance(this.state.Current_Latitude, this.state.Current_Longitude, this.state.Sel_Latitude, this.state.Sel_Longitude);
                if (distance <= this.state.sel_Range) {
                    let body = {
                        "emp_Id": this.state.EMP_ID,
                        "latitude": this.state.Current_Latitude.toString(),
                        "lognitude": this.state.Current_Longitude.toString(),
                        "leave_Type": "NA",
                        "remark": this.state.Remark + 'Puch In From Office Name: ' + this.state.OfficeName,
                        "iP_Address": "NA",
                        "device_ID": this.state.IMEI,
                        "att_Type": "3"
                    }
                    fetch(global.URL + "Attendance/PunchAttendance/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token,
                            "platform": Platform.OS
                        },
                        body: JSON.stringify(body),
                        redirect: 'follow'
                    }).then(response => response.text()).then(async responseText => {
                        let respObject = JSON.parse(responseText);
                        if (respObject.response == 1) {
                            Alert.alert(global.TITLE, respObject.status);
                            this._GetTime();
                        }
                    }).catch(error => {
                        console.log(error);
                        this.setState({ isLoading: false });
                        Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
                    });
                } else {
                    Alert.alert("HRMS", "You are not with in Range of Office");
                }
            }
            else if (this.state.selectedOption == "PunchOut") { //Punch Out Attendance 
                console.log("in con 3");
                let body = {
                    "emp_Id": this.state.EMP_ID,
                    "latitude": this.state.Current_Latitude.toString(),
                    "lognitude": this.state.Current_Longitude.toString(),
                    "leave_Type": "NA",
                    "remark": this.state.Remark,
                    "iP_Address": "NA",
                    "device_ID": this.state.IMEI,
                    "att_Type": "2"
                }
                console.log(token);
                console.log(body);
                fetch(global.URL + "Attendance/PunchAttendance/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                        "platform": Platform.OS
                    },
                    body: JSON.stringify(body),
                    redirect: 'follow'
                }).then(response => response.text()).then(async responseText => {
                    let respObject = JSON.parse(responseText);
                    if (respObject.response == 1)
                        Alert.alert(global.TITLE, respObject.status);
                }).catch(error => {
                    console.log(error);
                    this.setState({ isLoading: false });
                    Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
                });
            }
            else if (this.state.selectedOption == "PunchOutofLoc") //Punch out Attendance out of location
            {
                console.log("in con 4");
                console.log(token);
                const distance = this.calculateDistance(this.state.Current_Latitude, this.state.Current_Longitude, this.state.Sel_Latitude, this.state.Sel_Longitude);
                if (distance <= this.state.sel_Range) {
                    let body = {
                        "emp_Id": this.state.EMP_ID,
                        "latitude": this.state.Current_Latitude.toString(),
                        "lognitude": this.state.Current_Longitude.toString(),
                        "leave_Type": "NA",
                        "remark": this.state.Remark + 'Puch In From Office Name: ' + this.state.OfficeName,
                        "iP_Address": "NA",
                        "device_ID": this.state.IMEI,
                        "att_Type": "4"
                    }
                    console.log("body==>", body);
                    fetch(global.URL + "Attendance/PunchAttendance/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token,
                            "platform": Platform.OS
                        },
                        body: JSON.stringify(body),
                        redirect: 'follow'
                    }).then(response => response.text()).then(async responseText => {
                        let respObject = JSON.parse(responseText);
                        if (respObject.response == 1)
                            Alert.alert(global.TITLE, respObject.status);
                        else
                            Alert.alert(global.TITLE, respObject.status);
                    }).catch(error => {
                        console.log(error);
                        this.setState({ isLoading: false });
                        Alert.alert(global.TITLE, "3. There is some problem. Please try again" + error);
                    });
                } else {
                    Alert.alert("HRMS", "You are not with in Range of Office");
                }

            }
            else if (this.state.selectedOption == "Tour") {  //On Tour
                console.log("in con 5 on Tour");
                let body = {
                    "emp_Id": this.state.EMP_ID,
                    "latitude": this.state.Current_Latitude.toString(),
                    "lognitude": this.state.Current_Longitude.toString(),
                    "leave_Type": "NA",
                    "remark": this.state.Remark,
                    "iP_Address": "NA",
                    "device_ID": this.state.IMEI,
                    "att_Type": "6"
                }
                fetch(global.URL + "Attendance/PunchAttendance/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                        "platform": Platform.OS
                    },
                    body: JSON.stringify(body),
                    redirect: 'follow'
                }).then(response => response.text()).then(async responseText => {
                    let respObject = JSON.parse(responseText);
                    if (respObject.response == 1)
                        Alert.alert(global.TITLE, respObject.status);
                }).catch(error => {
                    console.log(error);
                    this.setState({ isLoading: false });
                    Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
                });
            }
            else {  //Leave Attendance
                console.log("in con 6");
                let body = {
                    "emp_Id": this.state.EMP_ID,
                    "latitude": this.state.Current_Latitude.toString(),
                    "lognitude": this.state.Current_Longitude.toString(),
                    "leave_Type": this.state.LeaveType,
                    "remark": this.state.Remark,
                    "iP_Address": "NA",
                    "device_ID": this.state.IMEI,
                    "att_Type": "5"
                }
                console.log("Body==>", body);
                fetch(global.URL + "Attendance/PunchLeave/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                        "platform": Platform.OS
                    },
                    body: JSON.stringify(body),
                    redirect: 'follow'
                }).then(response => response.text()).then(async responseText => {
                    let respObject = JSON.parse(responseText);
                    if (respObject.response == 1)
                        Alert.alert(global.TITLE, respObject.status);
                    else
                        Alert.alert(global.TITLE, respObject.status);
                }).catch(error => {
                    console.log(error);
                    this.setState({ isLoading: false });
                    Alert.alert(global.TITLE, "3. There is some problem. Please try again" + error);
                });
            }
            await this.delay(2000);
            this._UpdateTime();
            this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
        }
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    _UpdateTime = async () => {
        let body = {
            "loginId": await AsyncStorage.getItem('uname'),
            "password": await AsyncStorage.getItem('pass'),
        }
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
                console.log("Update Time==>", respObject);
                if (respObject.id > 0) {
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
                }
            } catch (error) {
                console.log(error);
            }

        });
    }
    _GetTime = async () => {
        let body = {
            "loginId": await AsyncStorage.getItem('uname'),
            "password": await AsyncStorage.getItem('pass'),
        }
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
                console.log("Update TIme:::>", respObject);
                if (respObject.id > 0) {
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
                }
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "Invalid Username or Password");
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
        });
    }
    _Next() {
        this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} showBack={true} title={"MarkAttendance"} rightIcon={logout} openModeModel={'MarkAttendance'} />
                <ScrollView>
                    <View style={[styles.ProfileBox, { flex: 1 }]}>
                        <Text style={{ color: '#000', margin: 7 }}>Name: {this.state.EmpName}</Text>
                        <Text style={{ color: '#000', margin: 7 }}>IMEI: {this.state.IMEI}</Text>
                        <Text style={{ color: '#000', margin: 7 }}>Current Latitude: {this.state.Current_Latitude}</Text>
                        <Text style={{ color: '#000', margin: 7 }}>Current Longitude: {this.state.Current_Longitude}</Text>
                        {/*<Text style={{ color: '#000' }}>User Latitude: {this.state.Latitude}</Text>
                        <Text style={{ color: '#000' }}>User Longitude: {this.state.Longitude}</Text> */}
                    </View>
                    <View style={{ flex: 1 }}>
                        {/* //Punch In Attendance */}
                        {this.state.isFirst == true &&
                            <>
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    {(this.state.Distance <= this.state.LoginRange ?
                                        <TouchableOpacity
                                            style={styles.optionContainer}
                                            onPress={() => this.handleOptionSelect("Attendance")}
                                        >
                                            <View style={styles.radioIcon}>
                                                {this.state.selectedOption === "Attendance" && <View style={styles.selectedRadio} />}
                                            </View>
                                            <Text style={{ color: '#000' }}>Punch In</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            style={styles.optionContainer}
                                            onPress={() => this.handleOptionSelect("AttendanceOut")}
                                        >
                                            <View style={styles.radioIcon}>
                                                {this.state.selectedOption === "AttendanceOut" && <View style={styles.selectedRadio} />}
                                            </View>
                                            <Text style={{ color: '#000' }}>PunchIn from Outer Location</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={styles.optionContainer}
                                        onPress={() => this.handleOptionSelect("Leave")}
                                    >
                                        <View style={styles.radioIcon}>
                                            {this.state.selectedOption === "Leave" && <View style={styles.selectedRadio} />}
                                        </View>
                                        <Text style={{ color: '#000' }}>Leave</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={styles.optionContainer}
                                        onPress={() => this.handleOptionSelect("Tour")}
                                    >
                                        <View style={styles.radioIcon}>
                                            {this.state.selectedOption === "Tour" && <View style={styles.selectedRadio} />}
                                        </View>
                                        <Text style={{ color: '#000' }}>Tour</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    <View style={[styles.inputView, { flex: 2, margin: 10, marginTop: -10 }]}>
                                        <TextInput
                                            style={styles.TextInput}
                                            editable={true}
                                            placeholder='Remark'
                                            placeholderTextColor="#ccc"
                                            value={this.state.Remark}
                                            onChangeText={(text) => { this.setState({ Remark: text }); }}
                                        />
                                    </View>
                                </View>
                                {/* Show/Hide Attendance Out of Location */}
                                {this.state.isAttendanceShow == true &&
                                    <View style={{ margin: 10, flexDirection: 'column' }}>
                                        <Dropdown
                                            style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue' }]}
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
                                                this.setState({ OfficeName: item.label });
                                                this.setState({ Sel_Latitude: item.offLat });
                                                this.setState({ Sel_Longitude: item.offLog });
                                                this.setState({ sel_Range: item.offRange });
                                                this.setState({ isFocus: false })
                                            }}
                                        />
                                    </View>
                                }
                                {/* Show/Hide Leave */}
                                {this.state.isLeaveShow == true &&
                                    <View style={{ margin: 10, flexDirection: 'column' }}>
                                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Leave Type</Text>
                                        <Dropdown
                                            style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={this.state.LeaveList}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!this.state.isFocus ? 'Select Leave' : '...'}
                                            searchPlaceholder="Search..."
                                            value={this.state.Category}
                                            onFocus={() => this.setState({ isFocus: true })}
                                            onBlur={() => this.setState({ isFocus: false })}
                                            onChange={item => {
                                                this.setState({ LeaveType: item.value });
                                                this.setState({ isFocus: false })
                                            }}
                                        />
                                    </View>
                                }
                                <View style={[styles.inputView, { alignItems: 'center' }]}>
                                    <TouchableOpacity style={[styles.BtnSave]} onPress={() => this._SaveAttendance()} >
                                        <View>
                                            <Text style={{ fontSize: 18, color: '#fff', alignSelf: 'center' }}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                        {/* Punch Out Attendance */}
                        {this.state.isSecond == true &&
                            <>
                                <View style={{ flex: 2, margin: 10 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#000' }}>Punch In Time: {this.state.InTime}</Text>
                                    <View style={{ margin: 10, flexDirection: 'row' }}>
                                    {(this.state.Distance <= this.state.LoginRange ?
                                            <TouchableOpacity
                                                style={styles.optionContainer}
                                                onPress={() => this.handleOptionSelect("PunchOut")}
                                            >
                                                <View style={styles.radioIcon}>
                                                    {this.state.selectedOption === "PunchOut" && <View style={styles.selectedRadio} />}
                                                </View>
                                                <Text style={{ color: '#000' }}>Punch Out</Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                style={styles.optionContainer}
                                                onPress={() => this.handleOptionSelect("PunchOutofLoc")}
                                            >
                                                <View style={styles.radioIcon}>
                                                    {this.state.selectedOption === "PunchOutofLoc" && <View style={styles.selectedRadio} />}
                                                </View>
                                                <Text style={{ color: '#000' }}>Punch_Out Out of Location</Text>
                                            </TouchableOpacity>
                                        )}

                                    </View>
                                </View>
                                {/* Show/Hide Attendance Out of Location */}
                                {this.state.isAttendanceShow == true &&
                                    <View style={{ margin: 10, flexDirection: 'column' }}>
                                        <Dropdown
                                            style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue' }]}
                                            itemTextStyle={styles.dropdownText}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={this.state.OfficeList}
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!this.state.isFocus ? 'Select Office' : '...'}
                                            searchPlaceholder="Search..."
                                            value={this.state.OfficeId}
                                            onFocus={() => this.setState({ isFocus: true })}
                                            onBlur={() => this.setState({ isFocus: false })}
                                            onChange={item => {
                                                this.setState({ OfficeName: item.label });
                                                this.setState({ Sel_Latitude: item.offLat });
                                                this.setState({ Sel_Longitude: item.offLog });
                                                this.setState({ sel_Range: item.offRange });
                                                this.setState({ isFocus: false })
                                            }}
                                        />
                                    </View>
                                }
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    <View style={[styles.inputView, { flex: 2, margin: 10, marginTop: -10 }]}>
                                        <TextInput
                                            style={styles.TextInput}
                                            editable={true}
                                            placeholder='Remark'
                                            placeholderTextColor="#ccc"
                                            value={this.state.Remark}
                                            onChangeText={(text) => { this.setState({ Remark: text }); }}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.inputView, { alignItems: 'center' }]}>
                                    <TouchableOpacity style={[styles.BtnSave]} onPress={() => this._SaveAttendance()} >
                                        <View>
                                            <Text style={{ fontSize: 18, color: '#fff', alignSelf: 'center' }}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                        {this.state.isThird == true &&
                            <>
                                <View style={{ flex: 2, margin: 10 }}>
                                    <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Attendance is Marked For Today</Text>
                                    <Text style={{ color: '#000' }}>Punch In Time: {this.state.InTime} </Text>
                                    {/* {moment(this.state.InTime).format("HH:mm:ss")} */}
                                    <Text style={{ color: '#000' }}>Punch Out: {this.state.OutTime}</Text>
                                </View>
                            </>
                        }
                        {this.state.isLeave == true &&
                            <>
                                <View style={{ flex: 2, margin: 10 }}>
                                    <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Are on Leave For Today</Text>
                                </View>
                            </>}
                        {this.state.isTour == true &&
                            <>
                                <View style={{ flex: 2, margin: 10 }}>
                                    <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Are on Tour Today</Text>
                                </View>
                            </>}
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={[styles.BtnSave,]} onPress={() => this._Next()} >
                            <View>
                                <Text style={{ fontSize: 18, color: '#fff', alignSelf: 'center' }}>Continue</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>

        )
    }
}
