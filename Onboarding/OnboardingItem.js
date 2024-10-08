import { StyleSheet, Text, View,Image,useWindowDimensions} from 'react-native'
import React from 'react'


export default OnboardingItem = ({item}) => {
    const {width} = useWindowDimensions()
  return (
    <View style={[styles.container, {width}]}>
      <Image source={item.image} style = {[styles.image,{resizeMode:'contain'}]}/>
      <View style={{flex:0.3}}>
           <Text style={styles.title}>{item.title}</Text>
           <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor:'white',
        paddingHorizontal:15
    },
    image : {
        flex : 0.7,
        justifyContent: 'center',
        width:'80%',
    },
    title: {
        fontWeight :'900',
        fontSize: 27,
        marginBottom: 20,
        color : '#003366',
        textAlign: 'center'
    },
    description : {
        fontWeight : '100',
        color : '#000',
        fontSize:12,
        textAlign : 'center',
        paddingHorizontal : 64,
    }
})