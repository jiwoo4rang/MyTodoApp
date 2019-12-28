import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
export default function Listitem({name}) {
  return (
    <View style={styles.listitembox}>
      <View style={styles.makelow}>
      <TouchableOpacity>
      <AntDesign name="checkcircle" size={20} style= {styles.checkmargin}/>
      </TouchableOpacity>
      
      <Text  style={styles.item}>{name}</Text>
      </View>
      <TouchableOpacity>
        
      <AntDesign name="close" size={20}/>
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    
  listitembox : {
      borderBottomWidth:1,
      padding:5,
      marginTop:10,
      width: width - 60,
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"space-between",
  },

  item:{
    fontSize:20,
    fontWeight: 'bold',
  },
  makelow:{
    flexDirection:"row",
  },
  checkmargin:{
    marginRight:10,
  }

});


