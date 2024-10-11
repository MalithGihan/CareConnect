import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardDoctor from './DashboardDoctor';
import DProfile from './DProfile';
import QRscanner from '../Common/QRscanner';
import SearchPatient from './SearchPatient';
import PatientAppointmentDetails from "./PatientAppointmentDetails"
import AddNoteScreen from './AddNoteScreen';
import Prescription from './Prescription';
import DeleteNoteScreen from './DeleteNoteScreen';
import ViewMedicalHistoryScreen from './ViewMedicalHistoryScreen';
import PatientNotesScreen from './PatientNotesScreen';
import SeacrchPatients from './SeacrchPatients';
import AddMedicalRecords from './AddMedicalRecords';
import PatientRecords from './PatientRecord';
import PatientActions from './PatientActions';
import DeleteRecord from './DeleteRecords';
import ViewAllRecords from './ViewAllmedical';
import UpdateRecord from './UpdatesMedical';

const DashboardScreen = 'DashboardDoctor'
const MedicalRecordScreen = 'SearchPatient'
const ProfileScreen = 'DProfile'
const PateintReportScannerScreen = 'QRscanner'


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Dashbord' component={DashboardDoctor} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function QRScanStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='QR Scanner' component={QRscanner} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}


function AddReportStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Search Patient' component={SearchPatient} options={{ headerShown: false }} />
      <Stack.Screen name="PatientAppointmentDetails" component={PatientAppointmentDetails} options={{ headerShown: false }} />
      <Stack.Screen name="AddNoteScreen" component={AddNoteScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Prescription" component={Prescription} options={{ headerShown: false }} />
      <Stack.Screen name="DeleteNoteScreen" component={DeleteNoteScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ViewMedicalHistoryScreen" component={ViewMedicalHistoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PatientNotesScreen" component={PatientNotesScreen} options={{ headerShown: false }} />
      <Stack.Screen name='SearchPatients' component={SeacrchPatients} options={{ headerShown: false }} />
      <Stack.Screen name='Addmedical' component={AddMedicalRecords} options={{ headerShown: false }} />
      <Stack.Screen name="PatientRecords" component={PatientRecords} options={{ headerShown: false }} />
      <Stack.Screen name="PatientActions" component={PatientActions} options={{ headerShown: false }} />
      <Stack.Screen name="DeleteRecord" component={DeleteRecord} options={{ headerShown: false }} />
      <Stack.Screen name="ViewAllRecords" component={ViewAllRecords} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateRecord" component={UpdateRecord} options={{ headerShown: false }} />
      
    </Stack.Navigator>
  )
}

export default function HomeDoctor() {
  return (
    <Tab.Navigator
      initialRouteName={DashboardScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === DashboardScreen) {
            iconName = focused ? 'calendar' : 'calendar';
          } else if (route.name === ProfileScreen) {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === MedicalRecordScreen) {
            iconName = focused ? 'medical-outline' : 'medical-outline';
          } else if (route.name === PateintReportScannerScreen) {
            iconName = focused ? 'scan' : 'scan-outline';
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
      <Tab.Screen name={MedicalRecordScreen} component={AddReportStack} />
      <Tab.Screen name={ProfileScreen} component={DProfile} />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position:'absolute',
    paddingBottom: 10,
    paddingHorizontal: 10,
    height: 60,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 50,
    backgroundColor: '#D9E4EC',
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
