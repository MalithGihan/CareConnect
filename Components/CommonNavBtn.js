import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default CommonNavBtn = (props) => {
  return (
    <TouchableOpacity style={{...styles.btn,...props.style}} onPress={props.onPress}>
            <Text style={{fontSize: 15,color:'white',fontWeight:'bold'}}>
              {props.title}
            </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
   btn : {
    paddingHorizontal: 20,
    paddingVertical: 8,
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