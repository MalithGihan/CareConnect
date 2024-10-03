import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Dashboard from './DashboardPatient';
import Patient_Profile from './PatientProfile';
import Report from './ReportView';
import Shedules from './SheduleView';
import Medical_History from './MedicalHistoryView';
import AddNotePage from './Addnote';
import Notifications from './Notifications'

const DashboardScreen = 'Dashboard'
const SheduleViewScreen = 'Shedules'
const ProfileScreen = 'Patient_Profile'
const ReportViewScreen = 'Report'
const MedicalHistoryScreen = 'Medical_History'
const AddNoteScreen = 'AddNote'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Dashbord' component={Dashboard} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function MedicalHistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Medical History' component={Medical_History} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function ReportStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Reports' component={Report} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function SheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Clinic Shedules' component={Shedules} options={{ headerShown: false }} />
      <Stack.Screen name={AddNoteScreen} component={AddNotePage} options={{ headerShown: true, title: 'Add Note' }} />
      <Stack.Screen name='notifications' component={Notifications} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default function HomePatient() {
  return (
    <Tab.Navigator
      initialRouteName={DashboardScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === DashboardScreen) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === SheduleViewScreen) {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === ReportViewScreen) {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === MedicalHistoryScreen) {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === ProfileScreen) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'rgba(128, 128, 128, 0.5)',
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.tabBarIcon,
        headerShown: false,
      })}
    >
      <Tab.Screen name={DashboardScreen} component={DashboardStack} />
      <Tab.Screen name={MedicalHistoryScreen} component={MedicalHistoryStack} />
      <Tab.Screen name={ReportViewScreen} component={ReportStack} />
      <Tab.Screen name={SheduleViewScreen} component={SheduleStack} />
      <Tab.Screen name={ProfileScreen} component={Patient_Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingBottom: 10,
    paddingHorizontal: 10,
    height: 60,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabBarIcon: {
    marginBottom: -5,
  },
});