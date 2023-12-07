import React, { Component } from 'react'
import { Image, FlatList, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
// import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default class AttendanceCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrName: 'Attendance Calender',
            // events: [
            //     { id: 1, title: 'Event 1', date: '2023-05-30' },
            //     { id: 2, title: 'Event 2', date: '2023-05-31' },
            //     { id: 3, title: 'Event 3', date: '2023-06-01' },
            //     { id: 3, title: 'Event 4', date: '2023-06-01' },
            //     { id: 3, title: 'Event 5', date: '2023-06-03' },
            //     { id: 3, title: 'Event 6', date: '2023-06-04' },
            // ],
            markedDates: {
                '2023-05-01': { marked: true, dotColor: 'green' }, // Example date with presence (present)
                '2023-05-02': { marked: true, dotColor: 'red' }, // Example date without presence (absent)
            },
        }
    }
    render() {
        const { events } = this.state;

        // Group events by date
        const groupedEvents = {};
        events.forEach(event => {
            const date = event.date;
            if (groupedEvents[date]) {
                groupedEvents[date].push(event);
            } else {
                groupedEvents[date] = [event];
            }
        });
        return (
            <View style={{ flexDirection:'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {Object.entries(groupedEvents).map(([date, events,index]) => (
                    <View key={index} style={{margin:10}}>
                        <Text style={{ fontWeight: 'bold' }}>{date}</Text>
                        {events.map(event => (
                            <Text key={event.id}>{event.title}</Text>
                        ))}
                    </View>
                ))}
            </View>
        )
    }
}
