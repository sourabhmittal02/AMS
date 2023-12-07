import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationService from './Src/Service/NavigationService';

import Splash from './Src/Splash';
import Login from './Src/Login';
import SignUp from './Src/SignUp';
import Dashboard from './Src/Dashboard';
import MarkAttendance from './Src/MarkAttednace';
import ChangePassword from './Src/ChangePassword';
import PendingApproval from './Src/PendingApproval';
import RegularAttendance from './Src/RegularAttendance';
import AttendanceCalendar from './Src/AttendanceCalendar';
import LeaveDetail from './Src/LeaveDetail';
import Calender from './Src/Calender';
import PunchLeave from './Src/PunchLeave';

const Stack = createNativeStackNavigator();
function App() {
  global.URL = "http://117.250.3.20/AVVNL_HRMS_API_UAT/";
  // global.URL = "http://117.250.3.20/CoreCallCenterAPI/";
  global.TITLE = "AVVNL AMS";
  return (
    <>
      <NavigationContainer ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef)
      }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Splash" component={Splash} /> */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="MarkAttendance" component={MarkAttendance} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="PendingApproval" component={PendingApproval} />
          <Stack.Screen name="RegularAttendance" component={RegularAttendance} />
          <Stack.Screen name="LeaveDetail" component={LeaveDetail} />
          <Stack.Screen name="Calender" component={Calender} />
          <Stack.Screen name="PunchLeave" component={PunchLeave} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;