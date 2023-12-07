import React from 'react';
import { View, StyleSheet,Text } from 'react-native';

class Sidebar extends React.Component {
    render() {
        return (
            <View style={styles.sidebarContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Menu</Text>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Change Password</Text>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Attendance</Text>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Leave</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sidebarContainer: {
        flex: 1,
        backgroundColor: 'white',
        // Add any other styles you want for the sidebar container
    },
});

export default Sidebar;