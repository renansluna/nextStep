import React, { Component } from 'react';
import { ScrollView, View, Image, Text, TextInput, Alert, TouchableOpacity, Button } from 'react-native';
import styles from './styles';
import MapView, { Callout } from 'react-native-maps';
import Dialog from "react-native-dialog";
import Modal from 'react-native-modal';
import * as Permissions from 'expo-permissions';
import Geocoder from 'react-native-geocoding';

let title,
    id=0,
    description,
    AddInformationVariable,
    latitudeLongitude,
    streetName,
    cityName,
    isLongPress=false;


export default class Mapa extends React.Component {
    constructor(props) {
        super(props);
      // this.closeDialog = this.closeDialog.bind(this);
      // this.showDialog = this.showDialog.bind(this);  
//Propriedades:        
    this.state = {
        descriptionTemp: 'string',
        modal: false,
        //isDialogVisible: false,
        
            latitude: null,
            longitude: null, 
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
            
        latitudeLongitudeTemp: {
            latitude: null,
            longitude: null,
        },
        places:{
            key: this.props.id,
        },
        markers: [
            {
                id: this.props.id,
                latlng: {
                    latitude: -22.877679,
                    longitude: -43.467749,
                },
                title: this.props.title,
                description: this.props.description,    
            }
        ]
        
    };
//Assim criamos componentes: 
//Componentes:
/*
    AddInformationVariable = (addInformation = () => {
            if (id === 0) {
                return null;
            }
            else {
                isLongPress = true;
            }
            if (isLongPress == true){
               // isLongPress = false;
                
                console.log(this.state.isDialogVisible);
                return(
                    <View>
                        <Dialog.Container visible={this.showDialog.bind(this)}>
                            <Dialog.Title>
                                Marque o ponto
                            </Dialog.Title>
                            <Dialog.Description>
                                Por favor, insira o problema encontrado nesta local:
                            </Dialog.Description>
                            <Dialog.Button label="Cancel" onPress={ this.closeDialog.bind(this) } />
                            <Dialog.Button label="Delete" onPress={ this.closeDialog.bind(this) } />
                        </Dialog.Container>
                    </View> 
                );
            }
        });
*/


}; //final do construtor


/*
//Funções do Dialog
closeDialog () {
   //console.log("entrei no closeDialog");
   // this.isDialogVisible = false;
   // console.log(isDialogVisible);
   // return this.isDialogVisible;
    this.setState({ dialogVisible: false });
};
showDialog  ()  {
    this.setState({ dialogVisible: true });
    
setModal (param) {
    this.setState({ dialogVisible: param });
*/
/*
addInformation () {
    const {markers} = this.state.markers;
    let quantidadeMarcadores,
    quantidadeMarcadores = markers.length-1;
    //this.state.markers[quantidadeMarcadores].title; receberá futuramente o nome da rua, um novo param
    markers[quantidadeMarcadores].description = this.state.descriptionTemp;
};
*/


async getLocalizationData () {
    // Initialize the module (needs to be done only once)
    Geocoder.init("AIzaSyDMhkRJt5tdp2zX9NszzQ6-YT2Ss-DCO08"); // use a valid API key
    //https://maps.googleapis.com/maps/api/geocode/json?latlng=-22.877679,-43.467749&key=AIzaSyDMhkRJt5tdp2zX9NszzQ6-YT2Ss-DCO08
    console.log('primeiro passo renan' + this.state.latitudeLongitudeTemp.latitude + this.state.latitudeLongitudeTemp.longitude)
    
    Geocoder.from(this.state.latitudeLongitudeTemp.latitude, this.state.latitudeLongitudeTemp.longitude)
        .then(json => {
            //variavel abaixo devera ser global  -43.467749 
            //this.state.latitudeLongitudeTemp.latitude
            //this.state.latitudeLongitudeTemp.longitude
            var addressComponent = json.results[1].address_components[1];
            streetName = addressComponent.short_name;
            console.log('Aqui Renan' + addressComponent.short_name);
        })
        .catch(error => console.warn(error));

/*
    Geocoder.from({
        lat : this.latitudeLongitudeTemp.lat,
        lng : this.latitudeLongitudeTemp.lng
    });
*/
}

async componentDidMount(){
    
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status != 'granted'){
        const response = await Permissions.askAsync(Permissions.LOCATION);
    }
    navigator.geolocation.getCurrentPosition(
        ( { coords: {latitude, longitude} } )  => this.setState({latitude: latitude, longitude: longitude}),
        (error) => console.log('Error:', error)
    )
}

render () {
    const {latitude, longitude, latitudeDelta, longitudeDelta} = this.state; //localização do usuário
    
if (latitude) {
    return(
        
        <View style={styles.container}>     
            <MapView
                showsUserLocation={true}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta,
                    longitudeDelta
                }}
                style={styles.mapView}
                onLongPress={
                    //Criar caixa para inserir titulo e descrição
                    
                    (e, i=1) => this.setState(
                        { 
                            modal: true,
                            latitudeLongitudeTemp: e.nativeEvent.coordinate,
                            
                        }, ()=>{this.getLocalizationData()}
                    )
                }
            >               
        {
            this.state.markers.map((marker, i) => (
                <MapView.Marker key={i} coordinate={marker.latlng}>
                    <Callout>
                        <Text>{marker.title}</Text>
                        <Text>{marker.description}</Text>
                    </Callout>
                </MapView.Marker>
                )
            )
        }
            {/*console.log (this.state.markers)*/}
            </MapView>
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
                        onPress={
                            //Criar caixa para inserir titulo e descrição
                            (e, i=1) => this.setState(
                                { 
                                    modal: false,
                                    markers: [...this.state.markers, 
                                        { 
                                            latlng: this.state.latitudeLongitudeTemp, 
                                            id: ++id, 
                                            title: streetName,
                                            description: this.state.descriptionTemp,
                                        }
                                    ] 
                                    
                                }
                            )
                        }
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
        {/*
            <ScrollView 
                style={styles.placeContainer}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled 
            >
        {
            this.state.markers.map((place, i) => (
                <View key={i} style={styles.place}>
                    <Text>{place.title}</Text>
                    <Text>{place.description}</Text>
                </View>
                )
            )
        }            
            </ScrollView>
        */}
        </View>
    );
    }
    return(
    <View><Text>Carregando...</Text></View>
    )
    }
}
