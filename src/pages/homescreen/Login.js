import React, { Component, useEffect, useState } from 'react';
import { 
    ScrollView, 
    View, 
    Image, 
    Text, 
    TextInput, 
    Alert,
    TouchableOpacity, 
    Button 
    } from 'react-native';
import styles from '../maps/styles';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
let USUARIO = require('../../services/globalUserController.json');
//import Modal from 'react-native-modal';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

async function handleLogin(e) {
    console.log('chamei o login');
    api.post('userLogin', {
        email,
        password
    }).then((res) => {
        //res.data[0].id_user
        USUARIO.id_user = res.data[0].id_user;
        navigation.navigate('index');
    }).catch(() => {
        alert('Erro no Login');
    });
    };

    return (
        <View style={styles.loginContainer}>
            <Text>Bem-vindo - nextStep</Text>
            <TextInput 
                style={styles.loginInputStyle}
                value={email}
                placeholder={'  E-mail'}
                onChangeText={(email) => setEmail(email)} 
            > 
            </TextInput>
            <TextInput 
                style={styles.loginInputStyle}
                value={password}
                secureTextEntry={true}
                placeholder={'  Senha'}
                onChangeText={(password) => setPassword(password)} 
            > 
            </TextInput>
            <View style={styles.loginInputBox}>
            <Button 
                style={styles.buttonStyle}
                title="Login" 
                mode="contained" 
                onPress={handleLogin}
            >
            </Button>    
            <Button 
                style={styles.buttonStyle}
                title="Cadastrar-se" 
                mode="contained" 
                onPress={() => navigation.navigate('cadastro')} //handleLogin
            >
            </Button>
            </View>          
        </View>
    );
}
