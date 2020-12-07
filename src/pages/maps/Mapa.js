import React, { Component } from 'react';
import { ScrollView, View, Image, Text, TextInput, Alert, TouchableOpacity, Button } from 'react-native';
import styles from './styles';
import MapView, { Callout } from 'react-native-maps';
import Modal from 'react-native-modal';
import * as Permissions from 'expo-permissions';
import Geocoder from 'react-native-geocoding';
import api from '../../services/api';
import getDistance from 'geolib/es/getDistance';
import DropDownPicker from 'react-native-dropdown-picker';
let USUARIO = require('../../services/globalUserController.json');

import {Audio} from 'expo-av';
let markersQuantidadeAtual,
    streetName,
    sound = new Audio.Sound();
    
export default class Mapa extends React.Component {
    constructor(props) {
        super(props);
        this.audioPlayer = new Audio.Sound();
//Propriedades:        
    this.state = {
        descriptionTemp: 'string',
        playing: true,
        modal: false,
        //isDialogVisible: false,
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
            
        latitudeLongitudeTemp: {
            latitude: null,
            longitude: null,
        },
        places:{
            key: this.props.id,
        },
        markers: [
            {
                id: null,
                latlng: {
                    latitude: 0,
                    longitude: 0,
                },
                title: null,
                description: null,    
            }
        ]
    };
    this.carregarMarkers = this.carregarMarkers.bind(this);
    this.saveMarkers = this.saveMarkers.bind(this);
    this.deletarMarker = this.deletarMarker.bind(this); 
    this.refreshMap = this.refreshMap.bind(this);
    this.hasUserLocationChanged = this.hasUserLocationChanged.bind(this);
    this.prepareAlertSound = this.prepareAlertSound.bind(this);
    this.playAlertSound = this.playAlertSound.bind(this);

}; //final do construtor

async getLocalizationData () {

    Geocoder.init("AIzaSyDMhkRJt5tdp2zX9NszzQ6-YT2Ss-DCO08"); 
    
    Geocoder.from(this.state.latitudeLongitudeTemp.latitude, this.state.latitudeLongitudeTemp.longitude)
        .then(json => {
            var addressComponent = json.results[1].address_components[1];
            streetName = addressComponent.short_name;
        })
        .catch(error => console.warn(error));
}

async componentDidMount(){
    
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status != 'granted'){
        const response = await Permissions.askAsync(Permissions.LOCATION);
    }

    this.watchID = navigator.geolocation.watchPosition( position => {
        console.log("chamando o watchPosition");
        const { latitude, longitude } = position.coords;
        this.setState({
            latitude: latitude,
            longitude: longitude
        });
        this.hasUserLocationChanged();
    },
    error => console.log(error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });

    Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true
    });

    await this.carregarMarkers();
    /*
    navigator.geolocation.getCurrentPosition(
        ( { coords: {latitude, longitude} } )  => this.setState({latitude: latitude, longitude: longitude}),
        (error) => console.log('Error:', error)
    )
    */
}

async hasUserLocationChanged () {
    const { markers, latitude, longitude } = this.state;
    let distances = [],
        distance,
        indiceMarcadorProximo;

    //Pegar distancias
    markers.forEach(function(marker, i) {
        distances[i] = getDistance( {latitude, longitude}, marker.latlng, 1)
    });
    //Achar menor distancia
    distance = Math.min(...distances);

    //Pegar indice onde o valor é o menor
    indiceMarcadorProximo = distances.findIndex((element) => element === distance)
    console.log('distancia mais proxima ' + distance);

    //mostrar marcardor desse indice
    if (distance < 30)
        await this.prepareAlertSound(markers[indiceMarcadorProximo]);
};

async prepareAlertSound (marker){
    const { playing } = this.state;
    
    let trackName = marker.description.toString();

    const statusSound = {
        shouldPlay: false
    };
    console.log('preparealertsound')
    //sound.setVolumeAsync(1.0);
    await sound.unloadAsync();

    switch (trackName) {
        case 'alagamento':
            await sound.loadAsync(require('./../../tracks/alagamento.mp3'), statusSound, false);
        break;
        case 'buraco':
            await sound.loadAsync(require('./../../tracks/buraco.mp3'), statusSound, false);
        break;
        case 'calcadaBuracos':
            await sound.loadAsync(require('./../../tracks/calcadaBuracos.mp3'), statusSound, false);
        break;
        case 'obra':
            await sound.loadAsync(require('./../../tracks/obra.mp3'), statusSound, false);
        break;
        case 'obstaculoCalcada':
            await sound.loadAsync(require('./../../tracks/obstaculoCalcada.mp3'), statusSound, false);
        break;
        default:
        break;
    };

    this.setState({ playing: false });

    this.playAlertSound();
    /*
    setTimeout(() => {
        sound.unloadAsync();   
    }, 7000);
    */
};

async playAlertSound (){
    const { playing } = this.state;
    console.log('playalertasound');
    try {
        if (playing) {
            await sound.pauseAsync();
            this.setState({ playing: false });
        } 
        else {
            await sound.playAsync();
        }
    } catch (error) {
        console.log(error);
    }
};

async saveMarkers(marker) {
    const objMarker = JSON.parse(marker);
    let latitude = objMarker.latlng.latitude,
        longitude = objMarker.latlng.longitude,
        street = objMarker.title,
        description = objMarker.description,
        fk_id_user = USUARIO.id_user;
    
    api.post('marker', {
        latitude,
        longitude, 
        street,
        description, 
        fk_id_user 
    }).then(() => {
        alert('Salvou o marker');
    }).catch(() => {
        alert('Erro ao salvar marker');
    });
};

prepararMarkers() { //fazer stringify de cada marker separadamente ao passar no for
    const {markers} = this.state;

    if(markersQuantidadeAtual == undefined) //necessario quando excluem todos os markers
    markersQuantidadeAtual = 0
    for (let i=markersQuantidadeAtual; i<markers.length; i++) {
        
        this.saveMarkers(JSON.stringify(markers[i]));
    }
};  

refreshMap (idMarkerExcluido) {
    const markers = this.state.markers.filter(marker => marker.id !== idMarkerExcluido);
    this.setState({ markers: markers });
};

async carregarMarkers () {
    const response = await api.get('marker');
    let objMarker = response.data;
    
    for (let i=0; i<response.data.length; i++) {
        objMarker = response.data[i];
        //console.log(objMarker);
        this.setState({ 
                markers: [...this.state.markers, 
                    { 
                        id: objMarker.id_marker,
                        latlng: {
                            latitude: parseFloat(objMarker.latitude),
                            longitude: parseFloat(objMarker.longitude)
                        }, 
                        title: objMarker.street,
                        description: objMarker.description
                    }
                ] 
            })
            markersQuantidadeAtual = this.state.markers.length;
            //mostra quantidade de marcadores ao iniciar a aplicação 
    }
};

async deletarMarker (idMarker) {
        let id = idMarker;

        api.delete('deleteMarker/' + idMarker)
        .then(this.refreshMap(id))
        .catch((err) => {
        alert('Erro ao deletar marker:' + err);
    });
    
};

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
                showsBuildings={true}
                showsTraffic={true}
                style={styles.mapView}
                onLongPress={
                    (e, i=1) => this.setState(
                        { 
                            modal: true,
                            latitudeLongitudeTemp: e.nativeEvent.coordinate,
                            
                        }, ()=>{this.getLocalizationData()}
                    )
                }>               
            {
                this.state.markers.map((marker, i) => (
                    <MapView.Marker key={i} coordinate={marker.latlng}>
                        <Callout
                            onPress={() => Alert.alert(
                                //title
                                'NextStep',
                                //body
                                'O problema marcado não existe? Gostaria de excluir?',
                                [
                                    {text: 'Sim', onPress: () => this.deletarMarker(marker.id)},
                                    {text: 'Não', onPress: () => console.log('No Pressed')}
                                ],
                                { cancelable: true }
                                )} >
                            <Text>{marker.title}</Text>
                            <Text>{marker.description}</Text>
                        </Callout>
                    </MapView.Marker>
                    )
                )
            }
            </MapView>

            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modal}>
                    <View>
                        <DropDownPicker
                            items={[
                                {label: 'Obstaculo na calcada', value: 'obstaculoCalcada'},
                                {label: 'Alagamento', value: 'alagamento'},
                                {label: 'Calcada com buracos', value: 'calcadaBuracos'},
                                {label: 'Obras na rua', value: 'obra'}
                            ]}
                            placeholder={'  Selecione o problema encontrado'}
                            containerStyle={{height: 40}}
                            style={{backgroundColor: '#fafafa'}}
                            itemStyle={{justifyContent: 'flex-start'}}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={problemaLocal => this.setState({
                                descriptionTemp: problemaLocal.value
                            })} />
                        <View style={styles.buttonContainer}> 
                            <Button 
                                style={styles.buttonStyle}
                                title="Salvar" 
                                mode="contained" 
                                onPress={(e, i=1) => this.setState(
                                        { 
                                            modal: false,
                                            markers: [...this.state.markers, 
                                                { 
                                                    latlng: this.state.latitudeLongitudeTemp, 
                                                    title: streetName,
                                                    description: this.state.descriptionTemp,
                                                }
                                            ] 
                                        }, this.prepararMarkers)} >
                            </Button>
                            <Button 
                                title="Fechar" 
                                mode="contained" 
                                onPress={() => this.setState({modal: false})}>
                            </Button>
                        </View>
                    </View>
            </Modal>               
        </View>
    );
    }
    return(
    <View><Text>Carregando...</Text></View>
    )
    }
}
