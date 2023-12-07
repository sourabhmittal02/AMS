import React, { Component } from 'react'
import { Image, FlatList, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default class RegularAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrName: 'Regularise Attendance',
            isOpenCalender: false,
            isOpenCalender2: false,
            isOpenCalender3: false,
            date: new Date(),
            InTime: new Date(),
            OutTime: new Date(),
            selectedOption: '',
            LeaveType: '',
            LeaveList: [{ label: 'Privilege Leave', value: 'PL' },
            { label: 'Earned Leave', value: 'EL' },
            { label: 'Annual Leave', value: 'AL' },
            { label: 'Casual Leave', value: 'CL' },
            { label: 'Sick Leave', value: 'SL' },
            { label: 'Maternity Leave', value: 'ML' },
            ],
            IMEI: '',
            EMP_ID: '',
            Current_Latitude: '',
            Current_Longitude: '',
            Remark: '',

        }
    }
    async componentDidMount() {
        let imei = await AsyncStorage.getItem('IMEI');
        let EID = await AsyncStorage.getItem('EMP_ID');
        let Current_latitude = await AsyncStorage.getItem('Current_Latitude');
        let Current_longitude = await AsyncStorage.getItem('Current_Longitude');
        this.setState({ IMEI: imei });
        this.setState({ EMP_ID: EID });
        this.setState({ Current_Latitude: Current_latitude });
        this.setState({ Current_Longitude: Current_longitude });
    }
    _setOpen(flag) {
        this.setState({ isOpenCalender: flag });
    }
    _setOpenTime(obj, flag) {
        if (obj == 1)
            this.setState({ isOpenCalender2: flag });
        else
            this.setState({ isOpenCalender3: flag });
    }
    _setDate(dt) {
        this.setState({ date: dt });
    }
    _setTime(obj, tt) {
        console.log(moment(tt).format('HH:mm'));
        if (obj == 1)
            this.setState({ InTime: tt });
        else
            this.setState({ OutTime: tt });
    }
    handleOptionSelect = (option) => {
        this.setState({ selectedOption: option })
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
        console.log(token);
        let body;
        if (this.state.selectedOption == "Attendance") {
            body = {
                "emp_Id": this.state.EMP_ID,
                "attendance_Date": moment(this.state.date).format("YYYY-MM-DD"),
                "inTime": moment(this.state.InTime).format("HH:mm:ss"),
                "outTime": moment(this.state.OutTime).format("HH:mm:ss"),
                "latitude": this.state.Current_Latitude.toString(),
                "lognitude": this.state.Current_Longitude.toString(),
                "leave_Type": "",
                "remark": this.state.Remark,
                "iP_Address": "NA",
                "device_ID": this.state.IMEI,
            }
            fetch(global.URL + "Attendance/PunchRegularizationAttendance_APP/", {
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
                    this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
                } else
                    Alert.alert(global.TITLE, respObject.status);
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
                Alert.alert(global.TITLE, "3. There is some problem. Please try again" + error);
            });
        } else {
            body = {
                "emp_Id": this.state.EMP_ID,
                "inTime": this.state.date,
                "outTime": this.state.date,
                "latitude": this.state.Current_Latitude.toString(),
                "lognitude": this.state.Current_Longitude.toString(),
                "leave_Type": this.state.LeaveType,
                "remark": this.state.Remark,
                "iP_Address": "NA",
                "device_ID": this.state.IMEI,
            }
            fetch(global.URL + "Attendance/PunchRegularizationAttendance/", {
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
                    this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
                } else
                    Alert.alert(global.TITLE, respObject.status);
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
                Alert.alert(global.TITLE, "3. There is some problem. Please try again" + error);
            });
        }
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} showBack={true} title={this.state.scrName} rightIcon={logout} openModeModel={this.state.scrName} />
                <ScrollView style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 18, color: '#000', margin: 10 }}>Date</Text>
                        <Text style={{ fontSize: 18, color: '#000', margin: 10 }}>{moment(this.state.date).format('DD-MM-YYYY')}</Text>
                        <TouchableOpacity style={styles.BtnDate} onPress={() => this._setOpen(true)} >
                            <Text style={{ fontSize: 14, color: 'red', fontWeight: 'bold', margin: 10 }}>Select</Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            mode='date'
                            open={this.state.isOpenCalender}
                            date={this.state.date}
                            onConfirm={(date) => {
                                this._setOpen(false)
                                this._setDate(date)
                            }}
                            onCancel={() => {
                                this._setOpen(false)
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={styles.optionContainer}
                            onPress={() => this.handleOptionSelect("Attendance")}
                        >
                            <View style={styles.radioIcon}>
                                {this.state.selectedOption === "Attendance" && <View style={styles.selectedRadio} />}
                            </View>
                            <Text style={{ fontSize: 18, margin: 10, color: '#000' }}>Attendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionContainer}
                            onPress={() => this.handleOptionSelect("Leave")}
                        >
                            <View style={styles.radioIcon}>
                                {this.state.selectedOption === "Leave" && <View style={styles.selectedRadio} />}
                            </View>
                            <Text style={{ fontSize: 18, margin: 10, color: '#000' }}>Leave</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 3 }}>
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
                    {this.state.selectedOption === "Attendance" &&
                        <>
                            <View style={{ margin: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, color: '#000', margin: 10 }}>In Time</Text>
                                <Text style={{ fontSize: 18, color: '#000', margin: 10 }}>{moment(this.state.InTime).format('HH:mm:ss')}</Text>
                                <TouchableOpacity style={styles.BtnDate} onPress={() => this._setOpenTime(1, true)} >
                                    <Text style={{ fontSize: 14, color: 'red', fontWeight: 'bold', margin: 10 }}>Select</Text>
                                </TouchableOpacity>
                                <DatePicker
                                    modal
                                    mode='time'
                                    open={this.state.isOpenCalender2}
                                    date={this.state.InTime}
                                    onConfirm={(time) => {
                                        this._setOpenTime(1, false)
                                        this._setTime(1, time)
                                    }}
                                    onCancel={() => {
                                        this._setOpenTime(1, false)
                                    }}
                                />
                            </View>
                            <View style={{ margin: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, color: '#000', margin: 10 }}>Out Time</Text>
                                <Text style={{ fontSize: 18, color: '#000', margin: 10 }}>{moment(this.state.OutTime).format('HH:mm:ss')}</Text>
                                <TouchableOpacity style={styles.BtnDate} onPress={() => this._setOpenTime(2, true)} >
                                    <Text style={{ fontSize: 14, color: 'red', fontWeight: 'bold', margin: 10 }}>Select</Text>
                                </TouchableOpacity>
                                <DatePicker
                                    modal
                                    mode='time'
                                    open={this.state.isOpenCalender3}
                                    date={this.state.OutTime}
                                    onConfirm={(time) => {
                                        this._setOpenTime(2, false)
                                        this._setTime(2, time)
                                    }}
                                    onCancel={() => {
                                        this._setOpenTime(2, false)
                                    }}
                                />
                            </View>
                        </>
                    }
                    {this.state.selectedOption === "Leave" &&
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
                                value={this.state.LeaveType}
                                onFocus={() => this.setState({ isFocus: true })}
                                onBlur={() => this.setState({ isFocus: false })}
                                onChange={item => {
                                    this.setState({ LeaveType: item.value });
                                    this.setState({ isFocus: false })
                                }}
                            />
                        </View>
                    }
                    <View style={[{ width: '90%' }, styles.loginFormView]}>
                        <TouchableOpacity style={[styles.BtnLogin, styles.shadowProp,]}  onPress={() => this._SaveAttendance()} >
                            <View>
                                <Text style={{ fontSize: 18, color: '#fff', alignSelf: 'center' }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
