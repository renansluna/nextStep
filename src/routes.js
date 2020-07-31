import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AppStack = createStackNavigator();

import maps from './pages/maps';

export default function Routes() {
    return(
        <NavigationContainer>
        
            <AppStack.Navigator>
                <AppStack.Screen name="maps" component={maps} />
                
            </AppStack.Navigator>

        </NavigationContainer>

    );
};