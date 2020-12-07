import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AppStack = createStackNavigator();

import index from './pages/maps/index';
import login from './pages/homescreen/Login';
import cadastro from './pages/homescreen/Cadastro';

export default function Routes() {
    return(
        <NavigationContainer>
        
            <AppStack.Navigator screenOptions={{ headerShown: false }}>
                <AppStack.Screen name="login" component={login} />
                <AppStack.Screen name="index" component={index} />
                <AppStack.Screen name="cadastro" component={cadastro} />
            </AppStack.Navigator>

        </NavigationContainer>

    );
};