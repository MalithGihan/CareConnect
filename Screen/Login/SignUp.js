import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useReducer, useState ,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { useNavigation } from "@react-navigation/native";
import { reducer } from '../../utils/reducers/formReducers';
import { validateInput } from '../../utils/actions/formActions';
import { useDispatch } from 'react-redux';

const isTestMode = true;

const initialState = {
  inputValues : {
    userName : "",
    email :  "",
    password: "",
    role: "",
    fullName: "",
    phoneNumber:"",
    address:"",
    gender:"",
    nic:"",
    dateOfBrirth:"",
    education:[],
    hospital:[],
    jobStart:"",
  },
  inputValidities : {
    userName : false,
    email: false,
    password: false,
    role: false,
    fullName: false,
    phoneNumber:false,
    address:false,
    gender:false,
    nic:false,
    dateOfBrirth:false,
    education:false,
    hospital:false,
    jobStart:false,
  },

  formIsValid : false,
};



export default SignUp = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const inputChangedHandler = useCallback((inputId, inputValue) => {
    const result = validateInput(inputId, inputValue); // Pass ID and value
    dispatchFormState({ inputId, validationResult: result || null, inputValue });
  }, [dispatchFormState]);

  const authHandler = async () => {
    const action = signUp(
      formState.inputValues.userName,
      formState.inputValues.email,
      formState.inputValues.password,
      formState.inputValues.role,
      formState.inputValues.fullName,
      formState.inputValues.phoneNumber,
      formState.inputValues.address,
      formState.inputValues.nic,
      formState.inputValues.dateOfBrirth,
      formState.inputValues.education,
      formState.inputValues.hospital,
      formState.inputValues.jobStart,
    )   
  };

  useEffect(()=>{
    if(error){
      Alert.alert("An error occured",error)
    }
  },[error])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
        <Text style={{color:'black',fontSize:17,fontWeight:'700',marginBottom:2}}>Sign Up</Text>
        <Text style={{color:'black',fontSize:15,fontWeight:'400'}}>Signup now for free and start learning, and explore language.</Text>
        <View style={{marginVertical:22}}>
        <CustomInput 
            id="userName" 
            value={formState.inputValues.userName}// Pass value from state
            placeholder="Name"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.userName} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="email" 
            value={formState.inputValues.email} 
            placeholder="Email Address"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.email} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="password" 
            value={formState.inputValues.password} 
            placeholder="Password"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.password} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="role" 
            value={formState.inputValues.role} 
            placeholder="Role"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.role} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="" 
            value={formState.inputValues.fullName} 
            placeholder="Full Name"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.fullName} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="phoneNumber" 
            value={formState.inputValues.phoneNumber} 
            placeholder="Phone Number"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.phoneNumber} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="address" 
            value={formState.inputValues.address} 
            placeholder="Address"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.address} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="nic" 
            value={formState.inputValues.nic} 
            placeholder="NIC"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.nic} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="dateOfBrirth" 
            value={formState.inputValues.dateOfBrirth} 
            placeholder="Date Of Brirth"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.dateOfBrirth} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="education" 
            value={formState.inputValues.education} 
            placeholder="education"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.education} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="hospital" 
            value={formState.inputValues.hospital} 
            placeholder="Hospital"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.hospital} 
            onInputChanged={inputChangedHandler}
          />
          <CustomInput 
            id="jobStart" 
            value={formState.inputValues.jobStart} 
            placeholder="Job Started Date"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.jobStart} 
            onInputChanged={inputChangedHandler}
          />


          <CustomButton 
            title='Sign Up'
            onPress={authHandler}
            isLoading={isLoading}
            style={{ marginVertical: 8 }}
          />

          <View style={styles.bottomConatiner}>
            <Text style={{fontSize:12, color:'black'}}>
              Have an account already ?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={{fontSize:14,fontWeight:'800',color:'black'}}>
                {" "}Sign In
              </Text>
            </TouchableOpacity>
          </View>
          
        </View>
        
      </ScrollView>
      <View style={styles.centeredButton}>
             <CommonNavBtn 
             title='Home'
             onPress={() => navigation.navigate("Default Home")}
             style={{ marginVertical: 8 }}
          />
       </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  bottomConatiner: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4
  },
  centeredButton: {
    flex: 1,
    bottom : 10,
    left : 10,
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
});
