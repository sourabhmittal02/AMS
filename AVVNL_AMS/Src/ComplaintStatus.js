import React, { Component } from 'react'
import { Image, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class ComplaintStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrName: '',
      searchno: '',
      isLoading: false,
      selectedOption: 'kno',
      ListComplaint: [],
      isVisible:false,
    }
  }
  async componentDidMount() {
    let uid = await AsyncStorage.getItem('USER_ID');
    this.setState({ UID: uid });
    this._GetToken();
    this.setState({ scrName: "Complaints Status" })
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
  handleOptionSelect = (option) => {
    this.setState({ selectedOption: option })
  }
  _SearchComplaint = async () => {
    this.setState({ isLoading: true });
    let token = "Bearer " + await AsyncStorage.getItem('Token');

    if (this.state.selectedOption === 'kno') {    //Search by KNO
      let body = {
        "kno": this.state.searchno,
        "complaintNo": "0"
      }
      fetch(global.URL + "Complaint/SearchComplaintByKNO", {
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
          this.setState({ ListComplaint: respObject });
          this.setState({ isVisible: true });
        } catch (error) {
          this.setState({ isLoading: false });
          console.log("1. ", error);
          alert(error);
        }
      });

    } else {    //Search By Complaint No
      let body = {
        "kno": "0",
        "complaintNo": this.state.searchno,
      }
      fetch(global.URL + "Complaint/SearchComplaintByComplaintNo", {
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
          this.setState({ ListComplaint: respObject });
          this.setState({ isVisible: true });
        } catch (error) {
          this.setState({ isLoading: false });
          console.log("1. ", error);
          alert(error);
        }
      });
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header navigation={this.props.navigation} showBack={true} showImage={false} title={this.state.scrName} rightIcon={logout} openModeModel={'ComplaintStatus'} />
        <ScrollView>
          <View style={{ margin: 10, flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => this.handleOptionSelect("kno")}
            >
              <View style={styles.radioIcon}>
                {this.state.selectedOption === "kno" && <View style={styles.selectedRadio} />}
              </View>
              <Text>Search By KNO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => this.handleOptionSelect("cno")}
            >
              <View style={styles.radioIcon}>
                {this.state.selectedOption === "cno" && <View style={styles.selectedRadio} />}
              </View>
              <Text>Search By Complaint No</Text>
            </TouchableOpacity>
          </View>
          <View style={{ margin: 10, flexDirection: 'row' }}>
            <View style={[styles.inputView, { flex: 2, margin: 10, marginTop: -10 }]}>
              <TextInput
                style={styles.TextInput}
                editable={true}
                placeholderTextColor="#ccc"
                value={this.state.searchno}
                onChangeText={(text) => { this.setState({ searchno: text }); }}
              />
            </View>
            <View style={[styles.inputView, { marginTop: -10 }]}>
              <TouchableOpacity style={styles.icon} onPress={() => this._SearchComplaint()} >
                <View>
                  <Image
                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                    source={require('./images/search.png')}
                  />
                  {/* <Text style={{ fontSize: 14, color: '#000', alignSelf: 'center' }}>Search</Text> */}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Search List */}
          {this.state.isVisible==true &&
          <View style={{ margin: 10 }} >
            <Text>Details Are:</Text>
            <View style={styles.tableContainer}>
              {this.state.ListComplaint.map((complaint, index) => (
                <>
                  <View style={styles.row}>
                    <Text style={styles.field}>Office Code</Text>
                    <Text style={styles.value}>{complaint.officE_CODE}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.field}>Complaint Status</Text>
                    <Text style={styles.value}>{complaint.complaint_Status}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.field}>Complaint No</Text>
                    <Text style={styles.value}>{complaint.complaintNo}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.field}>Complaint Type</Text>
                    <Text style={styles.value}>{complaint.complaintType}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.field}>Name</Text>
                    <Text style={styles.value}>{complaint.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.field}>Father Name</Text>
                    <Text style={styles.value}>{complaint.fatheR_NAME}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.field}>Address</Text>
                    <Text style={styles.value}>{complaint.address}</Text>
                  </View>
                  <View style={styles.row}> 
                    <Text style={styles.field}>Mobile No.</Text>
                    <Text style={styles.value}>{complaint.mobilE_NO}</Text>
                  </View>
                  <View style={styles.row}> 
                    <Text style={styles.field}>Alternate No.</Text>
                    <Text style={styles.value}>{complaint.alternatE_MOBILE_NO}</Text>
                  </View>
                </>
              ))}
            </View>
          </View>
          }
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isLoading}>
          <View style={{ flex: 1, backgroundColor: "#ffffffee", alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#F60000" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#434343", margin: 15 }}>Please Wait....</Text>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}
