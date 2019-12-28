import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export default function Subtitle() {
  return (
      <TextInput
      style ={styles.input}
      placeholder={"할일을 입력해주세요"}
      maxLength={30}
      returnKeyType="done"/>
  );
};

const styles = StyleSheet.create({
    
    input : {
        fontSize : 17,
        fontWeight: 'bold',
        marginTop: 10,
    },
  });
  


