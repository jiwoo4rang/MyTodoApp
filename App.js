import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './app/components/Header';
import Subtitle from './app/components/Subtitle';
import Input from './app/components/Input';
import Listitem from './app/components/Listitem';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.headercenter}>
      <Header/>
      </View>
      <View style={styles.subtitleposition}>
      <Subtitle title="해야 할 일"/>
      <Input/>
      </View>
      <View style={styles.subtitleposition}>
      <Subtitle title="해야할 일 목록"/>
      <Listitem name = "코딩하기"/>
      <Listitem name = "운동하기"/>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#fff',
  },
  headercenter:{
    alignItems:"center",
  },
  subtitleposition :{
    marginLeft:30,
    marginBottom:20,
}
 

});
