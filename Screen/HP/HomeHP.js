import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardHP from './DashboardHP';
import QRscanner from '../Common/QRscanner';
import HPProfile from './HPProfile';
import SheduleManage from './SheduleManage';
import ReportManage from '../Common/ReportManage';
import ClinicDateSelection from '../HP/ClinicDateSelection'

const DashboardScreen = 'DashboardHP'
const SheduleManageScreen = 'SearchPatient'
const ProfileScreen = 'DProfile'
const PateintReportScannerScreen = 'QRscanner'
const ReportManageScreen = 'ReportManage'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Dashbord' component={DashboardHP} options={{headerShown:false}} />
    </Stack.Navigator>
  )
}

function QRScanStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='QR Scanner' component={QRscanner} options={{headerShown:false}} />
    </Stack.Navigator>
  )
}

function ReportManageStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Clinic Shedule' component={SheduleManage} options={{headerShown:false}} />
        <Stack.Screen name="ClinicDateSelection" component={ClinicDateSelection} />
    </Stack.Navigator>
  )
}

function SheduleManageStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Patient Report Manage' component={ReportManage} options={{headerShown:false}} />
    </Stack.Navigator>
  )
}

function ProfileManageStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Profile Manage' component={HPProfile} options={{headerShown:false}} />
    </Stack.Navigator>
  )
}

export default function HomeHP() {
  return (
    <Tab.Navigator
      initialRouteName={DashboardScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === DashboardScreen) {
            iconName = focused ? 'language' : 'language-outline';
          } else if (route.name === ProfileScreen) {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === SheduleManageScreen) {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === PateintReportScannerScreen) {
            iconName = focused ? 'globe' : 'globe-outline';
          }  else if (route.name === ReportManageScreen) {
            iconName = focused ? 'globe' : 'globe-outline';
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
      <Tab.Screen name={PateintReportScannerScreen} component={QRScanStack} />
      <Tab.Screen name={ReportManageScreen} component={ReportManageStack} />
      <Tab.Screen name={SheduleManageScreen} component={SheduleManageStack} />
      <Tab.Screen name={ProfileScreen} component={ProfileManageStack} />
      
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
