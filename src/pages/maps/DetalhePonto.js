import React, { Component } from 'react';
import {  View, TextInput, Alert, TouchableOpacity, Button } from 'react-native';
import styles from './styles';
import Modal from 'react-native-modal';



export default class DetalhePonto extends React.Component {
    constructor(props) {
        super(props);
  
    this.state = {
        modal: false
    };


}; 

render (){
    return(
        <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modal}
        >
            <View>
                <TextInput 
                    style={styles.inputStyle}
                    defaultValue={"Insira o problema encontrado no local"}
                    onChangeText={(problemaLocal) => this.setState({descriptionTemp: problemaLocal})}
                > 
                </TextInput>
                <View style={styles.buttonStyle}> 
                <Button 
                    style={styles.buttonStyle}
                    title="Enviar" 
                    mode="contained" 
                    onPress={() => this.setState({modal: false})}
                >
                </Button>
                </View>
                <Button 
                    title="Fechar" 
                    mode="contained" 
                    onPress={() => this.setState({modal: false})}>
                </Button>
            </View>
        </Modal> 
    );
}

}