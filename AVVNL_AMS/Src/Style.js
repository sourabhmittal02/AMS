// const React = require("react-native");
// // import img from './images/bg.png';
// const { StyleSheet, Dimensions } = React;
// const screenHeight = Dimensions.get('window').height;
// const screenWidth = Dimensions.get('window').width;

// const styles = StyleSheet.create({
//     containerView: {
//         flex: 1,
//         backgroundColor: "#E1DDD2",
//         alignItems: "center",
//         //justifyContent: "center",
//     },
//     loginScreenContainer: {
//         flex: 1,
//     },
//     logoText: {
//         fontSize: 30,
//         fontWeight: "800",
//         marginTop: 30,
//         marginBottom: 10,
//         textAlign: "center",
//         color: "#3399CC",
//         margin: 5,
//     },
//     inputView: {
//         marginBottom: 15
//     },
//     TextInput: {
//         fontSize: 18,
//         borderBottomWidth: 1,
//         borderColor: "#3399CC"
//     },
//     loginBox: {
//         padding: 15,
//         borderRadius: 15,
//         marginTop: 100,
//         backgroundColor: "#fff",
//         height: 220,
//         width: screenWidth - 30,
//         shadowColor: "#3399CC",
//         shadowOffset: { width: 0, height: 3, },
//         shadowOpacity: 0.29,
//         shadowRadius: 4.65,
//         elevation: 7,
//     },
//     loginFormView: {
//         flexDirection: 'column',
//         alignItems: 'flex-end'
//     },
//     loginFormView2: {
//         flex: 4,
//         flexDirection: 'row',
//         justifyContent: 'center'
//     },
//     shadowProp: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 3, },
//         shadowOpacity: 0.29,
//         shadowRadius: 4.65,
//         elevation: 7,
//     },
//     loginFormTextInput: {
//         height: 43,
//         fontSize: 14,
//         borderRadius: 5,
//         borderWidth: 1,
//         borderColor: "#eaeaea",
//         backgroundColor: "#fafafa",
//         paddingLeft: 10,
//         marginTop: 5,
//         marginBottom: 5,
//     },
//     loginButton: {
//         backgroundColor: "#3897f1",
//         borderRadius: 5,
//         height: 45,
//         marginTop: 10,
//         width: 350,
//         alignItems: "center"
//     },
//     fbLoginButton: {
//         height: 45,
//         marginTop: -5,
//         backgroundColor: 'transparent',
//     },
//     img: {
//         height: screenHeight,
//         width: screenWidth,
//         //justifyContent: 'center',
//         //alignItems: 'center',
//     },
//     loginBtn: {
//         width: "60%",
//         borderRadius: 10,
//         height: 50,
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: 40,
//         backgroundColor: "#cccccc",

//         color: "#FFF",
//     },
//     backgroundImage: {
//         flex: 1,
//         width: '100%',
//         height: '100%',
//         justifyContent: "center",
//         alignItems: "center",
//         opacity: 0.9,
//         overflow:'hidden',
//         borderRadius:10,
//     },
//     loginText: {
//         fontSize: 20,
//         color: "#FFF",
//         alignSelf: 'center'
//     },
//     Btn: {
//         width: "45%",
//         borderRadius: 20,
//         height: 50,
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: 30,
//         backgroundColor: "#eeeeee",//"#6546D7",
//         color: "#000",
//         margin: 10,
//     },
//     BtnText: {
//         fontSize: 15,
//         color: "#000"
//     }

// });
// export default styles;
const React = require("react-native");
const { StyleSheet, Dimensions } = React;

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        justifyContent: 'space-around',
    },
    bgImage: {
        flex: 1,
        marginHorizontal: -20,
    },
    section: {
        height: 250,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionLarge: {
        height: 250,
        justifyContent: 'space-around',
    },
    sectionHeader: {
        marginBottom: 8,
    },
    priceContainer: {
        alignItems: 'center',
    },
    description: {
        padding: 15,
        lineHeight: 25,
    },
    titleDescription: {
        color: '#19e7f7',
        textAlign: 'center',
        // fontFamily: fonts.primaryRegular,
        fontSize: 15,
    },
    title: {
        marginTop: 30,
    },
    price: {
        marginBottom: 5,
    },
    priceLink: {
        width: "60%",
        borderRadius: 15,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#fff",
        color: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    logoText1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#810051'
    },
    logoText2: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#70AfD8'
    },
    loginBox: {
        height: 230,
        margin: 20,
        marginTop: 40,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#F6C899",
        // width: screenWidth - 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    ProfileBox: {
        height: 150,
        margin: 10,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        // backgroundColor: "#EF9439",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 3,
    },
    Tiles:{
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 3,
        padding: 20, 
    },
    Label: {
        padding: 5,
        fontSize: 18,
        color: '#fff'
    },
    TextInput: {
        padding: 5,
        fontSize: 18,
        borderBottomWidth: 1,
        borderColor: "#3399CC",
        color: '#000'
    },
    loginFormView: {
        flexDirection: 'column',
        margin: 10,
        marginTop: 0
    },
    scrollView: {
        marginHorizontal: 2,
    },
    inputView: {
        marginBottom: 25,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.9,
        borderRadius: 15
    },
    HeadText: {
        color: '#000',
        fontSize: 20, fontWeight: 'bold', margin: 15
    },
    Btn: {
        width: "50%",
        borderRadius: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        backgroundColor: "#fff",
    },
    BtnLink: {
        width: "100%",
        height: 50,
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderBottomColor:'#000',
        borderBottomWidth:1
    },
    BtnSearch: {
        width: "100%",
        borderRadius: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        backgroundColor: "#fff",
    },
    BtnDashboard: {
        width: "40%",
        borderRadius: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        margin: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    BtnNew:{
        width: "50%",
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        margin: 10,
        backgroundColor: "#3EB34A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    BtnSave:{
        width: "80%",
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        margin: 10,
        backgroundColor: "#3EB34A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    BtnLogin:{
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        margin: 10,
        backgroundColor: "#3EB34A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    BtnPunch: {
        width: "80%",
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        margin: 10,
        backgroundColor: "#3EB34A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    BtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    icon: {
        marginTop: 0,
        margin: 10,
    },
    placeholderStyle: {
        fontSize: 16,
        color: "#000",
        borderWidth: 1,
        borderRightWidth:0,
        backgroundColor: '#fff',
        height: 40,
        padding: 10,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "#000",
        borderWidth: 1,
        backgroundColor: '#fff',
        height: 40,
        padding: 10,
    },
    iconStyle: {
        width: 20,
        height: 40,
        backgroundColor: '#fff',
        padding: 15,
        marginRight: 10,
        borderWidth:1,
        borderLeftWidth:0,
        borderColor:'#000'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        backgroundColor: 'white',
        color: "#000",
        borderColor: 'blue',
    },
    dropdown: {
        flex: 2,
        color:'#000',
    },
    dropdownText:{
        color: '#000'
    },
    popup1: {
        flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute',
        top: '30%',
        left: '35%',
        marginRight: 40,
        transform: [{ translateX: -120 }, { translateY: -50 }],
        backgroundColor: '#EF9439',
        borderRadius: 10,
        padding: 30,
        elevation: 15, // Adjust the elevation to control the shadow effect
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
    },
    popup: {
        flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -120 }, { translateY: -50 }],
        backgroundColor: '#EF9439',
        borderRadius: 10,
        padding: 20,
        elevation: 15, // Adjust the elevation to control the shadow effect
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        margin: 10,
    },
    radioIcon: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRadio: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    },
    // Table Format
    tableContainer: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 4,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    field: {
        flex: 1,
    },
    value: {
        flex: 1,
        textAlign: 'right',
    },
    SignUpLogoText: {
        fontSize: 22,
        fontWeight: "800",
        marginTop: 30,
        marginBottom: 20,
        textAlign: "center",
        color: "#000",
        margin: 5,
    },
    SignloginBox: {
        height: 500,
        margin: 20,
        marginTop: 10,
        padding: 15,
        borderRadius: 15,
        backgroundColor: "#F6C899",
        // width: screenWidth - 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    }
});
export default styles;