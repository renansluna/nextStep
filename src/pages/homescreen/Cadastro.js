import React, { Component, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity,
    Alert, 
    Button 
    } from 'react-native';
import styles from '../maps/styles';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

export default function Cadastro() { 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    
async function handleCreateUser(e) {
        api.post('users', {
            name,
            email,
            password
        }).then(() => {
            alert('Cadastro realizado com sucesso!');
        }).catch(() => {
            alert('Erro no cadastro');
        });
    }

    return (
        <View style={styles.loginContainer}>
            <Text>Cadastro</Text>
            <TextInput 
                style={styles.loginInputStyle}
                value={name}
                placeholder={'  Nome'}
                onChangeText={(name) => setName(name)} //{descriptionTemp: problemaLocal}
            > 
            </TextInput>            
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
                title="Criar" 
                mode="contained" 
                onPress={handleCreateUser}
            >
            </Button>    
            <Button 
                style={styles.buttonStyle}
                title="Voltar" 
                mode="contained" 
                onPress={() => navigation.navigate('login')}
            >
            </Button>
            </View>          
        </View>
    );
}
