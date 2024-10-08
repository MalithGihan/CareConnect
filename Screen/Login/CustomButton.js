import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default CustomButton = (props) => {
  const isLoading = props.isLoading || false;
  return (
    <TouchableOpacity style={{...styles.btn,...props.style}} onPress={props.onPress}>
        {
          isLoading && isLoading == true? (
            <ActivityIndicator size="small" color='black' />
          ) : (
            <Text style={{fontSize: 20,color:'white',fontWeight:'bold'}}>
              {props.title}
            </Text>
          )
        }
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
   btn : {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
   }
})