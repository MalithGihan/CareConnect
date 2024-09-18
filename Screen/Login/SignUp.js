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
    fullName : "",
    email :  "",
    password: "",
    role: "user"
  },
  inputValidities : {
    fullName : false,
    email: false,
    password: false
  },
  formIsValid : false
};

// Make sure to declare the function as a constant function expression.
const SignUp = () => {
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
            id="fullName" 
            value={formState.inputValues.fullName} 
            placeholder="Name"
            placeholderTextColor='gray'
            errorText={formState.inputValidities.fullName} 
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

export default SignUp;

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
