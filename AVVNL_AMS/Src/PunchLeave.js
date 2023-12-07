import React, { Component } from 'react'
import { SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default class PunchLeave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrName: 'Punch Leave',
            isOpenCalender1: false,
            isOpenCalender2: false,
            Fromdate: new Date(),//moment(new Date()).format('YYYYMMDD'),
            Todate: new Date(),//moment(new Date()).format('YYYYMMDD'),
            EMP_NAME: '',
            isLoading: false,
            Remark: '',
            LeaveType: '',
            LeaveList: [{ label: 'Privilege Leave', value: 'PL' },
            { label: 'Earned Leave', value: 'EL' },
            { label: 'Annual Leave', value: 'AL' },
            { label: 'Casual Leave', value: 'CL' },
            { label: 'Sick Leave', value: 'SL' },
            { label: 'Maternity Leave', value: 'ML' },
            ]
        }
    }
    componentDidMount = async () => {
        let empID = await AsyncStorage.getItem('EMP_NAME');
        this.setState({ EMP_NAME: empID });
        // this._GetLeaveDetail();
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
    _setOpen(dtpick, flag) {
        if (dtpick == 1) {
            this.setState({ isOpenCalender1: flag });
        } else if (dtpick == 2) {
            this.setState({ isOpenCalender2: flag });
        }
    }
    _setDate(dtpick, dt) {
        if (dtpick == 1) {
            this.setState({ Fromdate: dt });
        } else if (dtpick == 2) {
            this.setState({ Todate: dt });
        }
    }
    _PunchLeave = async () => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let Current_latitude = await AsyncStorage.getItem('Current_Latitude');
        let Current_longitude = await AsyncStorage.getItem('Current_Longitude');
        let body = {
            "emp_Id": await AsyncStorage.getItem('EMP_ID'),
            "from_Date": this.state.Fromdate,
            "to_Date": this.state.Todate,
            "leavE_TYPE": this.state.LeaveType,
            "latitude": Current_latitude,
            "lognitude": Current_longitude,
            "leavE_REMARK": this.state.Remark,
            "iP_ADDRESS": "string",
            "devicE_ID": "string"
        }
        fetch(global.URL + "Attendance/Saveleaves/", {
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
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} showBack={true} title={this.state.scrName} rightIcon={logout} openModeModel={this.state.scrName} />
                <ScrollView>
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                        <View style={{ flex: 4, marginLeft: 10, marginTop: 20 }}>
                            <Text style={{ fontSize: 18, color: '#000' }}>From Date: {moment(this.state.Fromdate).format('DD-MM-YYYY')}</Text>
                        </View>
                        <View style={{ flex: 3, marginTop: 20 }}>
                            <TouchableOpacity style={styles.BtnDate} onPress={() => this._setOpen(1, true)} >
                                <Text style={{ fontSize: 14, color: 'green', fontWeight: 'bold' }}>Select</Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                mode='date'
                                open={this.state.isOpenCalender1}
                                date={this.state.Fromdate}
                                onConfirm={(date) => {
                                    this._setOpen(1, false)
                                    this._setDate(1, date)
                                }}
                                onCancel={() => {
                                    this._setOpen(1, false)
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                        <View style={{ flex: 4, marginLeft: 10, marginTop: 20 }}>
                            <Text style={{ fontSize: 18, color: '#000' }}>To Date: {moment(this.state.Todate).format('DD-MM-YYYY')}</Text>
                        </View>
                        <View style={{ flex: 3, marginTop: 20 }}>
                            <TouchableOpacity style={styles.BtnDate} onPress={() => this._setOpen(2, true)} >
                                <Text style={{ fontSize: 14, color: 'green', fontWeight: 'bold' }}>Select</Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                mode='date'
                                open={this.state.isOpenCalender2}
                                date={this.state.Todate}
                                onConfirm={(date) => {
                                    this._setOpen(2, false)
                                    this._setDate(2, date)
                                }}
                                onCancel={() => {
                                    this._setOpen(2, false)
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold', marginRight: 50, marginTop: 8 }}>Remark</Text>
                        <TextInput
                            style={[styles.TextInput, { flex: 2 }]}
                            editable={true}
                            placeholder='Remark'
                            placeholderTextColor="#ccc"
                            value={this.state.Remark}
                            onChangeText={(text) => { this.setState({ Remark: text }); }}
                        />
                    </View>
                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold', marginRight: 50, marginTop: 8 }}>Leave Type</Text>
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
                    <View style={{ flexDirection: 'row', marginLeft: 20, alignSelf: 'center' }}>
                        <TouchableOpacity style={styles.BtnPunch} onPress={() => this._PunchLeave()} >
                            <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>Punch Leave</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
