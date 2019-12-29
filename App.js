import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Header from './app/components/Header';
import Subtitle from './app/components/Subtitle';
import Input from './app/components/Input';
import Listitem from './app/components/Listitem';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      todos:[
        {
          title:"나는 공부를 하지 않아"
        },
        {
          title:"일찍 일어날래"
        },
        ]
    }
  }
  _makeTodoItem =({item, index})=>{
    return(
      <Listitem name ={item.title} />
      )
  }
  render(){
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
     
      <FlatList
        data = {this.state.todos}
        renderItem = {this._makeTodoItem}
        keyExtractor={(item, index) => { return `${index}`}}/>
      </View>
    </View>
  );
}
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
