import React, { Component } from 'react'
import { ImageBackground, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class RegisterComplaint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: '',
            Fname: '',
            KNO: '',
            Email: '',
            AreaCode: '',
            Mobile: '',
            Mobile2: '',
            LandLine: '',
            Address1: '',
            Address2: '',
            Address3: '',
            LandMark: '',
            Remark: '',
            OfficeCode: '',
            ConStatus: '',
            Feeder: '',
            Acno: '',
            UID: '',
            Category: '',
            CategoryList: [],
            KnoList: [],
            isFocus: false,
            openKnoList: false,
            isLoading: false,
        }
    }
    async componentDidMount() {
        this._GetToken();
        let mob = await AsyncStorage.getItem('Mobile');
        let email = await AsyncStorage.getItem('Email');
        let uid = await AsyncStorage.getItem('USER_ID');
        this.setState({ Mobile: mob });
        this.setState({ Email: email });
        this.setState({ UID: uid });
        this.setState({ isLoading: true });
        this._KnoList(uid)
        this._CatList();
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
    _KnoList = async (uid) => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "userid": uid,
            "kno": 0
        }
        fetch(global.URL + "Complaint/ListKNO/", {
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
                let List = [];
                console.log(respObject);
                respObject.forEach(object => {
                    let dropdownObject = { label: object.kno.toString(), value: object.kno.toString() };
                    List.push(dropdownObject)
                });
                this.setState({ KnoList: List });
            } catch (error) {
                this.setState({ isLoading: false });
                console.log("1. ", error);
                alert(error);
            }
        });
    }
    _CatList = async () => {
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        fetch(global.URL + "Complaint/GetComplaintTypeList?officeid=0", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            this.setState({ isLoading: false });
            try {
                let respObject = JSON.parse(responseText);
                let List = [];
                //console.log(respObject);
                respObject.forEach(object => {
                    let dropdownObject = { label: object.complaintType.toString(), value: object.complaintTypeId.toString() };
                    List.push(dropdownObject)
                });
                this.setState({ CategoryList: List });
            } catch (error) {
                this.setState({ isLoading: false });
                console.log("2. ", error);
                alert("There is some problem. Please try again");
            }
        });
    }
    _GetKnoDetail = async (kno) => {
        if (this.state.KNO != "") {
            this._GetToken();
            let token = "Bearer " + await AsyncStorage.getItem('Token');
            let body = {
                "userid": 0,
                "kno": this.state.KNO, //110111000001, //kno
            }
            this.setState({ isLoading: true });
            fetch(global.URL + "Complaint/GetKNODetail/", {
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
                    console.log("Result=>", responseText);
                    if (respObject != '') {
                        console.log("in===");
                        this.setState({ KNO: respObject[0].kno.toString() })
                        this.setState({ Address1: respObject[0].addresS1 })
                        this.setState({ Address2: respObject[0].addresS2 })
                        this.setState({ Address3: respObject[0].addresS3 })
                        this.setState({ AreaCode: respObject[0].areA_CODE })
                        this.setState({ ConStatus: respObject[0].consumeR_STATUS })
                        this.setState({ Email: respObject[0].email })
                        this.setState({ Fname: respObject[0].fatheR_NAME })
                        this.setState({ Mobile: respObject[0].mobilE_NO })
                        this.setState({ Name: respObject[0].name })
                        this.setState({ OfficeCode: respObject[0].officE_CODE })
                        this.setState({ Acno: respObject[0].accounT_NO })
                        this.setState({ Feeder: respObject[0].feedeR_NAME })
                        this.setState({ Mobile2: respObject[0].alternatE_MOBILE_NO })
                        this.setState({ LandLine: respObject[0].landlinE_NO })
                        this.setState({ LandMark: respObject[0].landmark })
                    }else{
                        Alert.alert(global.TITLE, "No Detail Found");
                    }
                } catch (error) {
                    this.setState({ isLoading: false });
                    console.log("1. ", error);
                    Alert.alert(global.TITLE, error);
                }
            });
        } else {
            Alert.alert(global.TITLE, "KNO Can't Be Left Empty");
        }

    }
    _RegComplaint = async () => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        if (this.state.Remark == "" || this.state.Category == "") {
            Alert.alert(global.TITLE, "Field(s) Can't Be Left Empty");
        } else {
            this.setState({ isLoading: true })
            let raw = JSON.stringify({
                "officE_CODE": this.state.OfficeCode,
                "complaintTypeId": this.state.Category,
                "name": this.state.Name,
                "fatheR_NAME": this.state.Fname,
                "kno": this.state.KNO,
                "landlinE_NO": this.state.LandLine,
                "sourceId": 10,
                "mobilE_NO": this.state.Mobile,
                "alternatE_MOBILE_NO": "0",
                "email": this.state.Email,
                "accounT_NO": this.state.Acno,
                "addresS1": this.state.Address1,
                "addresS2": this.state.Address2,
                "addresS3": this.state.Address3,
                "landmark": this.state.LandMark,
                "consumeR_STATUS": this.state.ConStatus,
                "feedeR_NAME": this.state.Feeder,
                "areA_CODE": this.state.AreaCode,
                "remarks": this.state.Remark,
                "userId": this.state.UID
            })
            console.log(token);
            console.log(raw);
            fetch(global.URL + "Complaint/SaveComplaint/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "platform": Platform.OS
                },
                body: raw,
                redirect: 'follow'
            }).then(response => response.text()).then(async responseText => {
                try {
                    var respObject = JSON.parse(responseText);
                    console.log(responseText);
                    // if (respObject.Table1[0]) {
                    //     this.setState({ isLoading: false });
                    //     this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
                    // } else {
                    //     this.setState({ isLoading: false });
                    Alert.alert(global.TITLE, respObject.status)
                    // }
                    this.setState({ isLoading: false });

                }
                catch (error) {
                    this.setState({ isLoading: false });
                    console.log(error);
                    Alert.alert(global.TITLE, "Error In Register Complaint");
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
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation} showBack={true} showImage={false} title={this.state.scrName} rightIcon={logout} openModeModel={'ChangePass'} />
                <ScrollView>
                    <View style={[styles.inputView, { flexDirection: 'row', margin: 20 }]}>
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>K.No.</Text>
                            <Dropdown
                                style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={this.state.KnoList}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!this.state.isFocus ? 'Select KNO' : '...'}
                                searchPlaceholder="Search..."
                                value={this.state.KNO}
                                onFocus={() => this.setState({ isFocus: true })}
                                onBlur={() => this.setState({ isFocus: false })}
                                onChange={item => {
                                    this.setState({ KNO: item.value });
                                    this.setState({ isFocus: false })
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={[styles.BtnSearch, styles.shadowProp]} onPress={() => this._GetKnoDetail(this.state.KNO)}>
                                <ImageBackground source={require('./images/bg.png')} style={[styles.backgroundImage]}>
                                    <Text style={[{ margin: 10 }, styles.BtnText]}>Search</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={[styles.inputView, { marginTop: 2, margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Name</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Name}
                            onChangeText={(nm) => { this.setState({ Name: nm }); }}
                        />
                    </View>
                    <View style={[styles.inputView, { marginTop: 2, margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Father Name</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Fname}
                            onChangeText={(nm) => { this.setState({ Fname: nm }); }}
                        />
                    </View>

                    <View style={[styles.inputView, { marginTop: 2, margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Email ID</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            value={this.state.Email}
                            placeholderTextColor="#ccc"
                            onChangeText={(ph) => { this.setState({ Email: ph }); }}
                        />
                    </View>
                    <View style={[styles.inputView, { marginTop: 2, margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Mobile</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            value={this.state.Mobile}
                            placeholderTextColor="#ccc"
                            onChangeText={(ph) => { this.setState({ Mobile: ph }); }}
                        />
                    </View>
                    <View style={[styles.inputView, { marginTop: 2, margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Address</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Address1}
                            onChangeText={(adrs) => { this.setState({ Address1: adrs }); }}
                        />
                    </View>
                    <View style={[styles.inputView, { marginTop: 2, margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Remark</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            onChangeText={(mark) => { this.setState({ Remark: mark }); }}
                        />
                    </View>
                    <View style={[styles.inputView, { margin: 20 }]}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Complaint Type</Text>
                        <Dropdown
                            style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={this.state.CategoryList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select Complaint' : '...'}
                            searchPlaceholder="Search..."
                            value={this.state.Category}
                            onFocus={() => this.setState({ isFocus: true })}
                            onBlur={() => this.setState({ isFocus: false })}
                            onChange={item => {
                                this.setState({ Category: item.value });
                                this.setState({ isFocus: false })
                            }}
                        />
                    </View>
                    <View style={[{ width: screenWidth - 15 }, styles.loginFormView]}>
                        <TouchableOpacity style={[styles.Btn, styles.shadowProp]} onPress={() => this._RegComplaint()}>
                            <ImageBackground source={require('./images/bg.png')} style={[styles.backgroundImage]}>
                                <Text style={[{ margin: 10 }, styles.BtnText]}>Submit</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.isLoading}>
                        <View style={{ flex: 1, backgroundColor: "#ffffffee", alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#F60000" />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#434343", margin: 15 }}>Please Wait....</Text>
                        </View>
                    </Modal>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
