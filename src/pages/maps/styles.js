import { StyleSheet, Dimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',

    },
    
    headerText: {
        fontSize: 25,
        color: 'black'
    },

    mapView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
        

    },

    placeContainer: {
        width: '100%',
        maxHeight: 200,
        
    },

    place: {
        width: width - 40,
        maxHeight: 200,
        backgroundColor: 'white',
        marginHorizontal: 20,   
    },

    inputStyle: {
        height: 60, 
        borderColor: 'gray', 
        borderWidth: 1 
    },

    buttonStyle: {
        marginVertical: 20
    }

});