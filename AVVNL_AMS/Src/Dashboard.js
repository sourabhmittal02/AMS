import React, { Component } from 'react'
import { PanResponder, Animated, Image, Dimensions, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import MenuIcon from './images/menu.png';
import { Directions, FlingGestureHandler } from 'react-native-gesture-handler';
import NavigationService from './Service/NavigationService';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppState } from 'react-native';

let SCREEN_WIDTH = Dimensions.get('window').width;
export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: '',
            EmpId: '',
            isLoading: false,
            openModel: false,
            msg: '',
            showMenu: false,
            isLoggedIn: false,
        }
        this.inactivityTimer = null;
        this.inactivityDuration =3600000; // 5 minutes (in milliseconds)
        this.translateX = new Animated.Value(this.state.showMenu ? 0 : -SCREEN_WIDTH + 100);
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                const { dx } = gestureState;
                return dx > 10;
            },
            onPanResponderMove: (evt, gestureState) => {
                const { dx } = gestureState;
                const newX = dx + (this.state.showMenu ? 0 : -SCREEN_WIDTH);
                if (newX > 0) {
                    this.translateX.setValue(newX);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { dx } = gestureState;
                const shouldShowMenu = dx > 50;
                if (shouldShowMenu) {
                    this.showMenu();
                } else {
                    this.hideMenu();
                }
            },
        });

    }
    
    showMenu = () => {
        console.log(this.state.showMenu, "==>", this.translateX, "==>", SCREEN_WIDTH);
        SCREEN_WIDTH = 0;
        this.setState({ showMenu: true });
        Animated.timing(this.translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };
    hideMenu = () => {
        SCREEN_WIDTH = Dimensions.get('window').width;;
        this.setState({ showMenu: false });
        Animated.timing(this.translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };
    ChangePassword = (pp) => {
        SCREEN_WIDTH = Dimensions.get('window').width;;
        this.setState({ showMenu: false });
        Animated.timing(this.translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
        }).start();

        pp.navigation.navigate('ChangePassword', { name: 'ChangePassword' })
    };
    async componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);    
        this.checkLoginStatus();
        this.startInactivityTimer();
        let InTime = await AsyncStorage.getItem('InTime');
        let OutTime = await AsyncStorage.getItem('OutTime');
        let nm = await AsyncStorage.getItem('Name');
        let empid = await AsyncStorage.getItem('EMP_NAME');
        console.log("Name====>", nm);
        this.setState({ Name: nm });
        this.setState({ EmpId: empid });
        let leave = await AsyncStorage.getItem('Leave');
        let tour = await AsyncStorage.getItem('Tour');
        if (leave == "1") {
            this.setState({ msg: "You Are on Leave" });
        } else if (tour == "1") {
            this.setState({ msg: "You Are on Tour" });
        } 
        else {
            if (InTime == "00:00:00" && OutTime == "00:00:00") {
                //First Login
                this.setState({ isFirst: true });
                console.log("1");
            } else if (InTime != "00:00:00" && OutTime == "00:00:00") {
                if (InTime!=null){
                    let MSG = "Your In Time is " + InTime;
                    this.setState({ msg: MSG });
                }
                console.log("2");
            } else if (InTime != "00:00:00" && OutTime != "00:00:00") {
                let MSG = "";
                if(InTime!=null)
                    MSG += "In Time is: "+ InTime;
                else if(OutTime!=null)
                    MSG += " Out Time is: " + OutTime;
                this.setState({ msg: MSG });
            }
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
        // AppState.removeEventListener('change', this.handleAppStateChange);
    }
    handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
            // Perform cleanup, logout, and state saving here
            this.handleAutoLogout();
        }
    };
    checkLoginStatus = async () => {
        try {
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            this.setState({ isLoggedIn: isLoggedIn === 'true' });
        } catch (error) {
            console.error('Error while checking login status:', error);
        }
    };

    startInactivityTimer = () => {
        this.inactivityTimer = setTimeout(this.handleAutoLogout, this.inactivityDuration);
    };
    handleAutoLogout = () => {
        // Perform logout logic here, and set isLoggedIn to false
        this.setState({ isLoggedIn: false }, () => {
            AsyncStorage.setItem('isLoggedIn', 'false');
        });
        this.hideMenu();
        AsyncStorage.clear();
        NavigationService.navigateAndReset('Login');
    };
    resetInactivityTimer = () => {
        clearTimeout(this.inactivityTimer);
        this.startInactivityTimer();
    };
    handleBackButton = () => {
        if (!this.props.navigation.isFocused()) {
            // The screen is not focused, so don't do anything
            return false;
        }
        Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => {
                    //AsyncStorage.clear(); global.scrName = '';
                    AsyncStorage.clear();
                    NavigationService.navigateAndReset('Login');
                    BackHandler.exitApp()
                }
            },], {
            cancelable: false
        }
        )
        return true;
    }
    _ChangePassword() {
        this.props.navigation.navigate('ChangePassword', { name: 'ChangePassword' })
    }
    _PendingApproval() {
        this.props.navigation.navigate('PendingApproval', { name: 'PendingApproval' })
    }
    _AddNewEmp() {
        this.props.navigation.navigate('SignUp', { name: 'SignUp' })
    }
    _RegularAttendance() {
        this.props.navigation.navigate('RegularAttendance', { name: 'RegularAttendance' })
    }
    _LeaveDetail() {
        this.props.navigation.navigate('LeaveDetail', { name: 'LeaveDetail' })
    }
    _AttendanceCalender() {
        this.props.navigation.navigate('AttendanceCalendar', { name: 'AttendanceCalendar' })
    }
    _Calender() {
        this.props.navigation.navigate('Calender', { name: 'Calender' })
    }
    _PunchLeave() {
        this.props.navigation.navigate('PunchLeave', { name: 'PunchLeave' })
    }
    _MarkAttendance=async ()=> {
        try {
            const isCompatible = await LocalAuthentication.hasHardwareAsync();
            if (!isCompatible) {
                throw new Error("Your Device is Not Compatible");
            }
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            // if (!isEnrolled) {
            //     throw new Error("Your Device is Not Enrolled with any Authentication");
            // }
            let resp = await LocalAuthentication.authenticateAsync();
            // console.log(resp.success);
            // Alert.alert('Autheticated', 'Welcome')
            if (resp.success){
                this.hideMenu();
                this.props.navigation.navigate('MarkAttendance', { name: 'MarkAttendance' })
            }
        } catch (error) {
            Alert.alert(global.TITLE,error.toString());
        }
    }
    _Logout ()  {
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
                    this.hideMenu();
                    await AsyncStorage.clear();
                    await AsyncStorage.setItem("IMEI", IMEI);
                    NavigationService.navigateAndReset('Login');
                }
            },], {
            cancelable: false
        }
        )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {/* <Header navigation={this.props.navigation} showBack={false} title={"Dashboard"} rightIcon={logout} openModeModel={'Dasboard'} /> */}
                <View on style={{ height: 40, backgroundColor: "#EF9439", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.showMenu() }}>
                            <Image style={{ width: 25, height: 25, marginRight: 0, resizeMode: 'contain', tintColor: "#ffffff", marginLeft: 10 }} source={MenuIcon}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ flex: 1.8, fontSize: 16, color: "#ffffff", alignSelf: "center", textAlign: "center" }}>Dashboard</Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => { this._Logout() }}>
                            <Image style={{ width: 25, height: 25, marginRight: 0, tintColor: "#ffffff", marginRight: 10, resizeMode: 'contain' }} source={logout}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <FlingGestureHandler direction={Directions.RIGHT} onHandlerStateChange={this.panResponder.panHandlers}>
                            {/* <FlingGestureHandler direction={Directions.RIGHT} onHandlerStateChange={PanResponder.panHandlers}> */}
                            <View style={{ flex: 1 }}>
                                <View style={[styles.ProfileBox]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 14, color: '#000', margin: 10 }}>EMP ID : {this.state.EmpId}</Text>
                                        <Text style={{ fontSize: 14, color: '#000', margin: 10 }}>Name : {this.state.Name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 14, color: '#000', margin: 10 }}>Date : {moment(new Date()).format('DD-MMM-YYYY')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 14, color: '#000', margin: 10 }}>{this.state.msg}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 0, marginLeft: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={styles.icon} onPress={() => this._MarkAttendance()} >
                                            <View style={[styles.Tiles]}>
                                                <Image
                                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                                    source={require('./images/markAttendance.png')}
                                                />
                                                <Text style={{ fontSize: 12, color: '#000', alignSelf: 'center' }}>Mark Attendance</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={styles.icon} onPress={() => this._PendingApproval()} >
                                            <View style={[styles.Tiles]}>
                                                <Image
                                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                                    source={require('./images/pending.png')}
                                                />
                                                <Text style={{ fontSize: 12, color: '#000', alignSelf: 'center' }}>Pending/Approval</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 0, marginLeft: 10, }}>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={styles.icon} onPress={() => this._AddNewEmp()} >
                                            <View style={[styles.Tiles]}>
                                                <Image
                                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                                    source={require('./images/newemp.png')}
                                                />
                                                <Text style={{ fontSize: 12, color: '#000', alignSelf: 'center' }}>New Employee</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={styles.icon} onPress={() => this._RegularAttendance()} >
                                            <View style={[styles.Tiles]}>
                                                <Image
                                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                                    source={require('./images/regular.png')}
                                                />
                                                <Text style={{ fontSize: 12, color: '#000', alignSelf: 'center' }}>Regular Attendance</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={styles.icon} onPress={() => this._LeaveDetail()} >
                                            <View style={[styles.Tiles]}>
                                                <Image
                                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                                    source={require('./images/leave.png')}
                                                />
                                                <Text style={{ fontSize: 12, color: '#000', alignSelf: 'center' }}>Employee On Leave</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={styles.icon} onPress={() => this._Calender()} >
                                            <View style={[styles.Tiles]}>
                                                <Image
                                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                                    source={require('./images/leave.png')}
                                                />
                                                <Text style={{ fontSize: 12, color: '#000', alignSelf: 'center' }}>Calender</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={styles.icon} onPress={() => this._PunchLeave()} >
                                            <View style={[styles.Tiles]}>
                                                <Image
                                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                                    source={require('./images/leave2.png')}
                                                />
                                                <Text style={{ fontSize: 12, color: '#000', alignSelf: 'center' }}>Punch Leave</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={styles.icon} onPress={() => this._ChangePassword()} >
                                            <View style={[styles.Tiles]}>
                                                <Image
                                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                                    source={require('./images/password.png')}
                                                />
                                                <Text style={{ fontSize: 12, color: '#000', alignSelf: 'center' }}>Change Password</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>                                    
                                </View>
                                    {/* <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.icon} onPress={() => this._AttendanceCalender()} >
                            <View>
                            <Image
                            style={{ width: 50, height: 50, alignSelf: 'center' }}
                            source={require('./images/regular.png')}
                            />
                            <Text style={{ fontSize: 14, color: '#000', alignSelf: 'center' }}>Attendance</Text>
                            </View>
                            </TouchableOpacity>
                        </View> */}
                                
                            </View>
                        </FlingGestureHandler>
                    </View>
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: -SCREEN_WIDTH,
                            width: SCREEN_WIDTH - 100,
                            height: '100%',
                            backgroundColor: '#fff',
                            transform: [{ translateX: this.translateX }],
                        }}
                    >
                        <View style={{ marginTop: 0, marginLeft: 2, width: 200 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: '#ccc' }}>
                                <View style={{ flex: 2, alignItems: 'flex-start',marginTop:10 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Menu</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end', flex: 1, marginTop: 10 }}>
                                    <Text onPress={this.hideMenu} style={{ color: 'red', marginRight: 10, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>X</Text>
                                </View>
                            </View>
                            <View style={{
                                marginTop: 180,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                            }}>
                                <TouchableOpacity style={styles.BtnLink} onPress={() => this._MarkAttendance()} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={{ width: 25, height: 25, alignSelf: 'center' }}
                                            source={require('./images/markAttendance.png')}
                                        />
                                        <Text style={{ fontSize: 14, color: '#000', marginLeft: 10 }}>Mark Attendance</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.BtnLink]} onPress={() => this._PendingApproval()} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={{ width: 25, height: 25, alignSelf: 'center' }}
                                            source={require('./images/pending.png')}
                                        />
                                        <Text style={{ fontSize: 16, color: '#000', marginLeft: 10 }}>Pending/Approval</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.BtnLink} onPress={() => this._AddNewEmp()} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={{ width: 25, height: 25, alignSelf: 'center' }}
                                            source={require('./images/newemp.png')}
                                        />
                                        <Text style={{ fontSize: 14, color: '#000', marginLeft: 10 }}>Add New</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.BtnLink} onPress={() => this._RegularAttendance()} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={{ width: 25, height: 25, alignSelf: 'center' }}
                                            source={require('./images/regular.png')}
                                        />
                                        <Text style={{ fontSize: 14, color: '#000', marginLeft:10 }}>Regular Attendance</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.BtnLink} onPress={() => this._LeaveDetail()} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={{ width: 25, height: 25, alignSelf: 'center' }}
                                            source={require('./images/leave.png')}
                                        />
                                        <Text style={{ fontSize: 14, color: '#000', marginLeft:10 }}>Employee On Leave</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.BtnLink]} onPress={() => this._ChangePassword()} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={{ width: 25, height: 25, alignSelf: 'center' }}
                                            source={require('./images/password.png')}
                                        />
                                        <Text style={{ fontSize: 16, color: '#000', marginLeft: 10 }}>Change Password</Text>
                                    </View>
                                </TouchableOpacity>                                
                                <TouchableOpacity style={styles.BtnLink} onPress={() => this._Logout()} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={{ width: 25, height: 25, alignSelf: 'center' }}
                                            source={require('./images/logout2.png')}
                                        />
                                        <Text style={{ fontSize: 14, color: '#000', marginLeft:10 }}>Logout</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>

                    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 10 }} {...this.panResponder.panHandlers} />

                </ScrollView>
            </SafeAreaView>
        )
    }
}
