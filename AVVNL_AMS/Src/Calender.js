import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, Modal, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
// import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component';

export default class Calender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMonth: new Date(),
            MonthId: '',
            isLoading: false,
            scrName: 'Atendance Calender',
            MonthList: [{ label: 'January', value: '1' }, { label: 'February', value: '2' },
            { label: 'March', value: '3' }, { label: 'April', value: '4' },
            { label: 'May', value: '5' }, { label: 'June', value: '6' },
            { label: 'July', value: '7' }, { label: 'August', value: '8' },
            { label: 'September', value: '9' }, { label: 'October', value: '10' },
            { label: 'November', value: '11' }, { label: 'December', value: '12' },
            ],
            //     datelist: {'2023-06-01': 'Present',
            // '2023-06-02': 'Present',
            // '2023-06-03': 'Present',
            // '2023-06-04': 'Miss Punch Out',
            // '2023-06-05': 'Absent',
            // '2023-06-06': 'Absent',
            // '2023-06-07': 'Present',
            // '2023-06-08': 'Absent',
            // '2023-06-09': 'Absent',
            // '2023-06-10': 'Week Off',
            // }
            datelist: '',
        }
    }
    async componentDidMount() {
        let Current_latitude = await AsyncStorage.getItem('Current_Latitude');
        let Current_longitude = await AsyncStorage.getItem('Current_Longitude');
        let latitude = await AsyncStorage.getItem('Latitude');
        let longitude = await AsyncStorage.getItem('Longitude');
        let imei = await AsyncStorage.getItem('IMEI');
        let empname = await AsyncStorage.getItem('Name');
        let roleid = await AsyncStorage.getItem('ROLE_ID');
        let InTime = await AsyncStorage.getItem('InTime');
        let OutTime = await AsyncStorage.getItem('OutTime');
        let EID = await AsyncStorage.getItem('EMP_ID');
        let loginrange = await AsyncStorage.getItem('LoginRange');
        //console.log("ROLE:",roleid);
        this.setState({ EMP_ID: EID });
        this.setState({ EmpName: empname });
        this.setState({ RoleId: roleid });
        this.setState({ Current_Latitude: Current_latitude });
        this.setState({ Current_Longitude: Current_longitude });
        this.setState({ Latitude: latitude });
        this.setState({ Longitude: longitude });
        this.setState({ IMEI: imei });
        this.setState({ InTime: InTime });
        this.setState({ OutTime: OutTime });
        this.setState({ LoginRange: loginrange });
        let nm = await AsyncStorage.getItem('Name');
        this.setState({ Name: nm });
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        this.setState({ MonthId: currentMonth.toString() })
        this._ShowAttendance();
    }
    getWeekdayFromDate(dateString) {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date(dateString);
        const weekdayIndex = date.getDay();
        return weekdays[weekdayIndex];
    }
    renderCalendarDay(date, index) {
        const attendanceStatus = this.state.datelist[date];//date.value;//
        let weekday = this.getWeekdayFromDate(date);
        let dayStyle = styles1.day;
        let dayWeek = '';
        let day = '';
        let dayText = '';

        if (attendanceStatus === 'Present') {
            dayStyle = styles1.presentDay;
            dayWeek = weekday;
            // dayText += '\n' + date.split('-')[2];
            day = date.split('-')[2];
            dayText = ' Present';
        } else if (attendanceStatus === 'Absent' || attendanceStatus === 'ABSENT') {
            dayStyle = styles1.absentDay;
            dayWeek = weekday;
            day = date.split('-')[2];
            dayText = ' Absent';
        } else if (attendanceStatus === 'Week Off' || attendanceStatus === 'WEEK OFF') {
            dayStyle = styles1.WeekoffDay;
            dayWeek = weekday;
            day = date.split('-')[2];
            dayText = ' Week Off';
        } else if (attendanceStatus === 'Leave' || attendanceStatus === 'LEAVE') {
            dayStyle = styles1.absentDay;
            dayWeek = weekday;
            day = date.split('-')[2];
            dayText = ' Leave';
        } else if (attendanceStatus.trim() === 'Miss Punch Out' || attendanceStatus === 'MISS PUNCH OUT') {
            dayStyle = styles1.MissDay;
            dayWeek = weekday;
            day = date.split('-')[2];
            dayText = ' Miss Punch Out';
        } else if (attendanceStatus.trim() === 'Holiday' || attendanceStatus === 'HOLIDAY') {
            dayStyle = styles1.HoliDay;
            dayWeek = weekday;
            day = date.split('-')[2];
            dayText = ' Holiday';
        } else if (attendanceStatus.trim() === 'Tour' || attendanceStatus === 'TOUR') {
            dayStyle = styles1.HoliDay;
            dayWeek = weekday;
            day = date.split('-')[2];
            dayText = ' Tour';
        }
        return (
            <View key={index} style={{ borderWidth: 1, borderColor: 'lightgrey' }}>
                <Text style={styles1.dayweek}>{dayWeek}</Text>
                <Text style={styles1.day}>{day}</Text>
                <Text style={[dayStyle, styles1.dayText]}>{dayText}</Text>
            </View>
        );
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
    async _ShowAttendance() {
        this.setState({ isLoading: true });
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let nm = await AsyncStorage.getItem('EMP_NAME');
        const date = new Date();
        const yy = date.getFullYear();
        let body = JSON.stringify({
            "emP_NAME": nm,
            "month": parseInt(this.state.MonthId),
            "year": yy,
        });
        fetch(global.URL + "Attendance/GetEmployeesCalander1/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: body,
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            let respObject = JSON.parse(responseText);
            const resp = respObject;
            console.log("Resp==>", respObject);
            const list = {};
            respObject.forEach(item => {
                list[item.attendancE_DATE] = item.attendence;
            });
            this.setState({ datelist: list });
            this.setState({ isLoading: false })

            // for (const entry of resp) {
            //     Object.keys(entry).map((date) => {
            //         if (date !== "EMP_NAME") {
            //             const attendanceStatus = entry[date];
            //             list[date] = attendanceStatus;
            //         }
            //     });
            //     // console.log("==>", list);
            // }
            // this.setState({ datelist: list })
            // console.log(list);
        })
    }
    // _ShowAttendance = async () => {
    //     this.setState({isLoading:true});
    //     this._GetToken();
    //     let token = "Bearer " + await AsyncStorage.getItem('Token');
    //     let nm = await AsyncStorage.getItem('EMP_NAME');
    //     // alert(this.state.MonthId)
    //     const date = new Date();
    //     const yy = date.getFullYear();
    //     let body = JSON.stringify({
    //         "emp_name": nm,
    //         "month": parseInt(this.state.MonthId),
    //         "year": yy
    //     });
    //     console.log("token ",token);
    //     console.log("body ",body);
    //     fetch(global.URL + "Attendance/GetEmployeeCalander/", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": token,
    //             "platform": Platform.OS
    //         },
    //         body: body,
    //         redirect: 'follow'
    //     }).then(response => response.text()).then(async responseText => {
    //         let respObject = JSON.parse(responseText);
    //         const resp = respObject.response;
    //         const list = {};

    //         for (const entry of JSON.parse(resp)) {
    //             Object.keys(entry).map((date) => {
    //                 if (date !== "EMP_NAME") {
    //                     const attendanceStatus = entry[date];
    //                     list[date] = attendanceStatus;
    //                 }
    //             });
    //             console.log("==>", list);
    //             // const date = Object.keys(entry)[1];
    //             // const status = entry[date].toUpperCase();
    //             // list[date] = status;
    //             this.setState({ isLoading: false })
    //         }
    //         this.setState({ datelist: list })
    //         console.log(list);
    //     }).catch(error => {
    //         console.log(error);
    //         this.setState({ isLoading: false });
    //         Alert.alert(global.TITLE, "Network Issue");
    //     });
    // }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} showBack={true} title={this.state.scrName} rightIcon={logout} openModeModel={this.state.scrName} />
                <ScrollView>
                    <View style={{ flexDirection: 'row', margin: 5 }}>
                        <Dropdown
                            style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue' }]}
                            itemTextStyle={styles.dropdownText}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={this.state.MonthList}
                            search={true}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select Month' : '...'}
                            searchPlaceholder="Search..."
                            value={this.state.MonthId}
                            onFocus={() => this.setState({ isFocus: true })}
                            onBlur={() => this.setState({ isFocus: false })}
                            onChange={item => {
                                this.setState({ MonthId: item.value });
                                this.setState({ isFocus: false })
                            }}
                        />
                        <TouchableOpacity style={[styles.BtnNew]} onPress={() => this._ShowAttendance()} >
                            <View>
                                <Text style={{ fontSize: 20, color: '#fff', alignSelf: 'center' }}>Show</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles1.container}>
                        {/* Render the calendar days */}
                        {/* {(this.state.datelist).map((date=>
                        (
                        this.renderCalendarDay(date)
                        )
                        ))} */}
                        {Object.keys(this.state.datelist).map((date, index) => (
                            this.renderCalendarDay(date, index)
                        ))}
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
        );
    }
}

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    // day: {
    //     width: 40,
    //     height: 40,
    //     backgroundColor: '#f1f1f1',
    //     borderRadius: 25,
    //     margin: 5,
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
    presentDay: {
        width: 110,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: 'lightgrey',
        margin: 2,
        // padding: 5,
        backgroundColor: '#C3F5C6'//'#8bc34a'
    },
    absentDay: {
        width: 110,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: 'lightgrey',
        margin: 2,
        // padding: 5,
        backgroundColor: '#F7D5CA'//'#f44336'
    },
    WeekoffDay: {
        width: 110,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: 'lightgrey',
        margin: 2,
        // padding: 5,
        backgroundColor: 'lightyellow'//'#f44336'
    },
    MissDay: {
        width: 110,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: 'lightgrey',
        margin: 2,
        // padding: 5,
        backgroundColor: 'lightgrey'//'#f44336'
    },
    HoliDay: {
        width: 110,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: 'lightgrey',
        margin: 2,
        // padding: 5,
        backgroundColor: 'lightblue'//'#f44336'
    },
    dayText: {
        textAlign: 'left',
        color: '#000'
    },
    day: {
        textAlign: 'right',
        color: '#000'
    },
    dayweek: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
    }
});
//     getDatesInMonth (selectedMonth)  {
//         const year = selectedMonth.getFullYear();
//         const month = selectedMonth.getMonth();
//         const numDays = new Date(year, month + 1, 0).getDate();

//         const dates = [];
//         for (let day = 1; day <= numDays; day++) {
//             const date = new Date(year, month, day);
//             dates.push(date);
//         }

//         return dates;
//     };
//     renderCalendar = () => {
//         const { selectedMonth } = this.state;
//         const dates = this.getDatesInMonth(selectedMonth);

//         return dates.map((date) => {
//             // Check if the date is present or absent
//             const isPresent;// = // Logic to determine if the date is present
//     const isAbsent ;//= // Logic to determine if the date is absent

//     return (
//                 <View key={date.getTime()} style={{ padding: 10 }}>
//                     <Text>{date.getDate()}</Text>
//                     {isPresent && <Text>Present</Text>}
//                     {isAbsent && <Text>Absent</Text>}
//                 </View>
//             );
//         });
//     };
//   render() {
//     return (
//         <View>
//             {this.renderCalendar()}
//         </View>
//     )
//   }