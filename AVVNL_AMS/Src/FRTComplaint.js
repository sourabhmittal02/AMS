import React, { Component } from 'react'
import { Image, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

export default class FRTComplaint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false,
            OID: '',
            scrName: '',
            ListComplaint: [],
            showPopup: false,
            showDetailPopup: false,
            ItemDetail: [],
            CNos: '',
            UserId: '',
            Remark: '',
        }
    }
    async componentDidMount() {
        this._GetToken();
        this.setState({ scrName: "FRT Complaints" })
        let oid = await AsyncStorage.getItem('officE_ID');
        this.setState({ OID: oid.toString() });
        let uid = await AsyncStorage.getItem('USER_ID');
        this.setState({ UserId: uid.toString() });
        this._ListFRTComplaint();
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
    _ListFRTComplaint = async () => {
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "officeId": this.state.OID.toString()
        }
        // console.log("Office Id==>", body);
        fetch(global.URL + "Complaint/GetFRTWiseComplaint", {
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
                // console.log(respObject);
                this.setState({ ListComplaint: respObject });
            } catch (error) {
                this.setState({ isLoading: false });
                console.log("1. ", error);
                alert(error);
            }
        });
    }
    _AddRemark(ComplaintNo) {
        this.setState({ CNos: ComplaintNo });
        this.setState({ showPopup: !this.state.showPopup });
    }
    _ShowDetail(obj) {
        this.setState({ showDetailPopup: true });
        this.setState({ ItemDetail: obj });
        console.log('===>', obj);
    }
    handleDetailModelClose = () => {
        this.setState({ showDetailPopup: false });
    }
    handleModalClose = async () => {
        if (this.state.Remark == '') {
            this.setState({ showPopup: false });
        }
        else {
            let token = "Bearer " + await AsyncStorage.getItem('Token');
            let body = {
                "complaintNo": this.state.CNos.toString(),
                "userID": this.state.UserId.toString(),
                "remark": this.state.Remark
            }
            fetch(global.URL + "Complaint/SaveRemark", {
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
                    console.log(respObject);
                    if (respObject.response == 1) {
                        this.setState({ showPopup: false });
                        Alert.alert("AVVNL", respObject.status);
                    }
                } catch (error) {
                    this.setState({ isLoading: false });
                    console.log("1. ", error);
                    alert(error);
                }
            });
        }
    };
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
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 0.5, color: "#fff" }}>#</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 2, color: "#fff" }}>Complaint No</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Type</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Name</Text>
                {/* <Text style={{ fontSize: 14, marginEnd: 10, alignSelf: "center", flex: 2, textAlign: 'center', color: "#fff" }}>Kno</Text> */}
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Status</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Action</Text>
            </View>
        );
    }
    render() {
        const MyHeader = () => {
            return (
                <View
                    style={{
                        marginTop: 0,
                        height: 40,
                        width: "100%",
                        backgroundColor: "#EE9238",//"#b5f5bf",
                        flexDirection: 'row',
                        elevation: 5, // Adjust the elevation to control the shadow effect
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 3.84,
                    }}>
                    <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 0.5, color: "#fff" }}>#</Text>
                    <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 2, color: "#fff" }}>Complaint No</Text>
                    <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Type</Text>
                    <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Name</Text>
                    {/* <Text style={{ fontSize: 14, marginEnd: 10, alignSelf: "center", flex: 2, textAlign: 'center', color: "#fff" }}>Kno</Text> */}
                    <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Status</Text>
                    <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: "#fff" }}>Action</Text>
                </View>
            );
        };
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation} showBack={true} showImage={false} title={this.state.scrName} rightIcon={logout} openModeModel={'ChangePass'} />
                <MyHeader />
                <FlatList
                    data={this.state.ListComplaint}
                    // ListHeaderComponent={this.FlatListHeader}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                        <View style={{ paddingTop: 5, paddingBottom: 10, width: '100%', backgroundColor: index % 2 == 0 ? "#ffffff" : "#F3CBA3", flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 0.5, color: "#000000" }}>{index + 1}</Text>
                            {/* <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 1, color: "#000000" }}>{item.complaintNo}</Text> */}
                            <View style={{ alignSelf: "center", flex: 1, }}>
                                <TouchableOpacity onPress={() => {
                                    this._ShowDetail(item);
                                }}>
                                    <Text style={{ marginLeft: 10, fontSize: 10, color: "#0000ff", fontWeight:'bold' }}>{item.complaintNo}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: "center", flex: 1, }}>
                                <TouchableOpacity onPress={() => {
                                    this._ShowDetail(item);
                                }}>
                                    <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 1, color: "#000000" }}>{item.complaintType}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: "center", flex: 1, }}>
                            <TouchableOpacity onPress={() => {
                                this._ShowDetail(item);
                            }}>
                                <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 1, color: "#000000" }}>{item.name}</Text>
                            </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: "center", flex: 1, }}>
                            <TouchableOpacity onPress={() => {
                                this._ShowDetail(item);
                            }}>
                                <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 1, color: "#000000" }}>{item.complaint_Status}</Text>
                            </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => {
                                this._AddRemark(item.complaintNo);
                            }}
                            >
                                <Image
                                    style={{ marginRight: 20, width: 30, height: 30, alignSelf: 'center' }}
                                    source={require('./images/remark.png')}
                                />
                                <Text style={{ marginRight: 20, alignSelf: "center", color: "red", fontSize: (10), }}>Remark</Text></TouchableOpacity>
                        </View>
                    }
                />
                {/* Model For Complaint Detail */}
                <Modal visible={this.state.showDetailPopup} transparent={true} animationType='slide' onRequestClose={this.handleDetailModelClose}>
                    <View style={[styles.popup1]}>
                        <View style={{ flex: 3 }}>
                            <Text style={styles.Label}>Complaint No.: {this.state.ItemDetail.complaintNo}</Text>
                            <Text style={styles.Label}>Complaint Type: {this.state.ItemDetail.complaintType}</Text>
                            <Text style={styles.Label}>Complaint Status: {this.state.ItemDetail.complaint_Status}</Text>
                            <Text style={styles.Label}>Name: {this.state.ItemDetail.name}</Text>
                            <Text style={styles.Label}>Father Name: {this.state.ItemDetail.fatheR_NAME}</Text>
                            <Text style={styles.Label}>KNO: {this.state.ItemDetail.kno}</Text>
                            <Text style={styles.Label}>Mobile: {this.state.ItemDetail.mobilE_NO}</Text>
                            <Text style={styles.Label}>Alternate No.: {this.state.ItemDetail.alternatE_MOBILE_NO}</Text>
                            <Text style={styles.Label}>Address: {this.state.ItemDetail.address}</Text>
                        </View>
                        <TouchableOpacity onPress={this.handleDetailModelClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {/* Model For Add Complaint Remark */}
                <Modal visible={this.state.showPopup} transparent={true} animationType='fade' onRequestClose={this.handleModalClose}>
                    <View style={[styles.popup]}>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.Label}>Complaint No. {this.state.CNos}</Text>
                            <Text style={styles.Label}>User Id {this.state.UserId}</Text>
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
            </SafeAreaView>
        )
    }
}
