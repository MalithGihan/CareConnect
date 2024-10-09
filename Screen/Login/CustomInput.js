import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

const CustomInput = (props) => {
  const onChangeText = (text) => {
    props.onInputChanged(props.id, text); // Send back the changed text
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { borderColor: 'gray' }]}>
        <TextInput 
          {...props}
          placeholder={props.placeholder}
          style={styles.input}
          value={props.value} 
          onChangeText={onChangeText}
        />
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{Array.isArray(props.errorText) ? props.errorText[0] : props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  inputContainer: {
    width: '100%',
    paddingTop:5,
    flexDirection: 'row',
  },
  input: {
    color: 'gray',
    flex: 1,
    fontSize: 15,
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default CustomInput;
