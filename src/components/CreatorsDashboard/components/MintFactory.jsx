import React, { Component, useState, useEffect, memo } from 'react'
import { useMoralis } from "react-moralis";
import { Card, Spin, Alert, Modal } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import SearchAssetType from './SearchAssetType';
import Form from './Form';

import NFT_ABI from '../../../contracts/abi/NFT_ABI.json'
import MARKET_ABI from  '../../../contracts/abi/MARKET_ABI.json'
import styled from 'styled-components';

import GoogleMapReact from 'google-map-react';
import AutoComplete from '../../GoogleMap/Autocomplete';
import Map_Noir from '../../GoogleMap/Theme/Map_Noir';
import Marker from '../../GoogleMap/Markers';
import {MarkerWaypoint, MarkerInfo} from '../../GoogleMap/CustomMarkers';

const Wrapper = styled.main`
  width: 400px;
  height: 200px;
`;

//const [LatLon, setLatLon] = useState({lat:"", lon:""})
var wayPoints = []
var coordinates

const GMAP_API_KEY = process.env.REACT_APP_GMAP_API_KEY

const NFT_TOKEN_ADDR = process.env.REACT_APP_PANGEA_TOKEN_ADDR
const MARKETPLACE_ADDR = process.env.REACT_APP_PANGEA_MARKETPLACE_ADDR

const styles = {
    title: {
      fontSize: "30px",
      fontWeight: "600",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "5px",
    },
    card: {
      boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
      border: "1px solid #e7eaf3",
      borderRadius: "1rem",
      width: "800px",
      fontSize: "16px",
      fontWeight: "500",
      textAlign:"center",
      marginLeft:"auto",
      marginRight:"auto",
      marginTop:"-30px", 
      opacity:"1.0",
    },
  };

const typeList = {Communication:1, Observation:1, Navigation:2, Courier:2, Emergency:3}
var gCenter = {center:[]}

function MintFactory() {
  
    var debug = document.getElementById("debug")    
    const { Moralis, user } = useMoralis();
    const [fileUrl, setFileUrl] = useState(null)
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const [currentLoc, setCurrentLoc] = useState({lat: 3.14777, lng: 101.69403})
    const [typeNo, setTypeNo] = useState(10)
    const [coordinateList, setCoordinateList] = useState([])
    const [geoFenceList, setGeofenceList] = useState([])
    const [infoMeta, setInfoMeta] = useState({point:"Point #", addr:"", lat:"", lng:""})
    const [inputValue, setInputValue] = useState({name:"Pangea", image:"", type:"1"})
    const [infoActive, setInfoActive] = useState(true)
    const [mapFullscreen, setMapFullscreen] = useState(false)
   
    const lat = document.getElementById("lat")
    
    // var gMap = new GoogleMap()    
    var InputForm = new Form()
    
    useEffect(async () => {
        CurrentLoc()
        // setDebugLog(typeNo + "\n" + JSON.stringify(gCenter))
    }, [])

    useEffect(async () => {
        setTypeNo(typeList[inputValue.name])

        setFileUrl(inputValue.image)
        //Clear waypoint list

        wayPoints = []
        setCoordinateList(wayPoints)
        setGeofenceList([])
    }, [inputValue])

    function CurrentLoc() {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLoc ({
                  center: {lat: position.coords.latitude, lng: position.coords.longitude}
              });
          });
        }
    }

    class GoogleMap extends Component {
    
        state = {
            mapApiLoaded: false,
            mapInstance: null,
            mapApi: GMAP_API_KEY,
            geoCoder: null,
            places: [],
            center: {lat: 3.14777, lng: 101.69403},
            zoom: 17,
            address: '',
            draggable: true,
            lat: null,
            lng: null
        };
    
         
        renderPolylines (map, maps, type) {
            // this.apiHasLoaded(map, maps)
            /** Example of rendering geodesic polyline */
            if(typeNo == 2){
                let geodesicPolyline = new maps.Polyline({
                    path: coordinateList,
                    geodesic: false,
                    strokeColor: '#00a1e1',
                    strokeOpacity: 1.0,
                    strokeWeight: 4
                })
                geodesicPolyline.setMap(map)
            } else if(typeNo == 3){
                /** Example of rendering non geodesic polyline (straight line) */
                let nonGeodesicPolyline = new maps.Polyline({
                    path: coordinateList,
                    geodesic: true,
                    strokeColor: 'red',
                    strokeOpacity: 0.7,
                    strokeWeight: 3
                })
                nonGeodesicPolyline.setMap(map)
            } else {
                /** Example of rendering non geodesic polyline (straight line) */
                let nonGeodesicPolyline = new maps.Polyline({
                    path: geoFenceList,
                    geodesic: false,
                    fillColor: (inputValue.name == "Observation") ? 'yellow' : "lightgreen",
                    strokeColor: (inputValue.name == "Observation") ? 'yellow' : "lightgreen",
                    strokeOpacity: 0.3,
                    strokeWeight: 20
                })
                nonGeodesicPolyline.setMap(map)
            }
            // this.fitBounds(map, maps)
        }

        async geodeticFencePoints (radius, lat, lng) {
    
            var earth = 6378.137  //radius of the earth in kilometer
            var new_latitude = [], new_longitude = []
            var geoFence = []
            var staticFence = []
            //For latitude
            var pi = Math.PI
            var cos = Math.cos
            var sin = Math.sin
            var _meters = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree
        
            //For longitude
            
            for(var i = 0; i < 2880; i++){
            
                geoFence.push({
                    lat: lat + (radius * _meters * cos(i/8)), 
                    lng: lng + (radius * _meters * sin(i/8)) / cos(lat * (pi / 180))
                })
                geoFence.push({lat: lat, lng: lng })
              }
            // setStaticFence(staticFence)
            setGeofenceList(geoFence)
        }
        
        fitBounds (map, maps) {
            var bounds = new maps.LatLngBounds()
            for (let marker of coordinateList) {
              bounds.extend(
                new maps.LatLng(marker.lat, marker.lng)
              )
            }
            map.fitBounds(bounds)
        }

        componentWillMount() {
            this.setCurrentLocation();
        }
    
        onMarkerInteraction = (childKey, childProps, mouse) => {
            this.setState({
                draggable: false,
                lat: mouse.lat,
                lng: mouse.lng
            });
        }

        onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
            this.setState({ draggable: true });
            this._generateAddress();
        }
    
        onMarkerClick = (ev, map, maps) => {
            if(!infoActive){
                var markerInfo = {marker: ev, point: "Point #" + ev, add:"", lat: coordinateList[ev].lat, lng: coordinateList[ev].lng}
                setInfoMeta(markerInfo)
                setInfoActive(true)
            }
        };

        onMarkerMouseLeave (ev) {
        };
        
        onMarkerMouseEnter (ev) {

        };

        _onChange = ({ center, zoom }) => {
            this.setState({
                center: center,
                zoom: zoom,
            });
        }
    
        _onClick = (value) => {
            this.setState({
                lat: value.lat,
                lng: value.lng
            });
            this.addWayPoints({
                lat: value.lat,
                lng: value.lng
            })
        }
    
        addWayPoints = (waypoint) => {
            if(typeNo > 1){
                wayPoints.push(waypoint)
                setCoordinateList(wayPoints)
            } else if (typeNo == 1){
                wayPoints = []
                wayPoints.push(waypoint)
                setCoordinateList(wayPoints)
                this.geodeticFencePoints(2500, waypoint.lat, waypoint.lng)
            }
            setInfoMeta({marker: coordinateList.length, point: "Point #" + coordinateList.length, lat: waypoint.lat, lng: waypoint.lng})
        }

        apiHasLoaded = (map, maps) => {
            this.setState({
                mapApiLoaded: true,
                mapInstance: map,
                mapApi: maps,
            });
            this.renderPolylines (map, maps, typeNo)
            this._generateAddress();
        };
    
        addPlace = (place) => {
            this.setState({
                places: [place],
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
            this._generateAddress()
        };
    
        _generateAddress() {
            const {
                mapApi
            } = this.state;
    
            const geocoder = new mapApi.Geocoder;
    
            geocoder.geocode({ 'location': { lat: this.state.lat, lng: this.state.lng } }, (results, status) => {
                console.log(results);
                console.log(status);
                if (status === 'OK') {
                    if (results[0]) {
                        this.zoom = 12;
                        this.setState({ address: results[0].formatted_address });
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
    
            });
            this.setCurrentLocation()
            //this.addWayPoints({ lat: this.state.lat, lng: this.state.lng })
        }
    
        // Get Current Location Coordinates
        setCurrentLocation() {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.setState({
                        center: {lat: position.coords.latitude, lng: position.coords.longitude},
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                });
            }
        }

        render() {
            const {
                places, mapApiLoaded, mapInstance, mapApi,
            } = this.state;

    
            return (
                <>
                    {mapApiLoaded && (
                        <div>
                            <AutoComplete map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />
                        </div>
                    )}
                    <GoogleMapReact
                        // style={Map_Noir}
                        center={this.state.center}
                        zoom={this.state.zoom}
                        draggable={this.state.draggable}
                        onChange={this._onChange}
                        onChildMouseDown={this.onMarkerInteraction}
                        onChildMouseUp={this.onMarkerInteractionMouseUp}
                        onChildMouseMove={this.onMarkerInteraction}
                        onChildClick={this.onMarkerClick}
                        onChildMouseEnter={this.onMarkerMouseEnter}
                        onChildMouseLeave={this.onMarkerMouseLeave}
                        onClick={this._onClick}
                        bootstrapURLKeys={{
                            key: 'AIzaSyDe-rYFxtl6-10vZ6wr9Fcn2ye_RmUVw_4',
                            libraries: ['places', 'geometry'],
                        }}
                        
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
                        >

                        {coordinateList && coordinateList.map((waypoint, index) => {
                            return(
                            <MarkerWaypoint
                                key={index}
                                text={`Point #${index}`}
                                lat={waypoint.lat}
                                lng={waypoint.lng}
                            />
                            )}
                        )}
                    </GoogleMapReact>
                    {!mapFullscreen &&(
                    <div className="info-wrapper">
                        <div className="map-details" style={{fontSize:"small"}}>Latitude: <span id="lat">{this.state.lat}</span>, Longitude: <span id="lng" >{this.state.lng}</span></div>
                        <div id="zoom" className="map-details" style={{fontSize:"small"}}>Zoom: <span>{this.state.zoom}</span></div>
                        <div id="addr" className="map-details" style={{fontSize:"small"}}>Address: <span>{this.state.address}</span></div>
                    </div>
                    )}
                </>
            );
        }
    }

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            setImageUploading(true)
            const imageFile = new Moralis.File(file.name, file)
            await imageFile.saveIPFS()
            const imageURI = imageFile.ipfs()

            setFileUrl(imageURI)
            
        } catch (error) {
            setImageUploading(false)
            alert('Error uploading imageURI: ' + JSON.stringify(error))
        }  
        setImageUploading(false)
    }
    
     async function createMarket() {
        InputForm.handleSubmit()

        const { name, description, price, brand, weight } = InputForm.state//formInput
        if (!name || !description || !price || !fileUrl) {
            alert('Form Incomplete\nPlease fill in the missing fields\nImage: ' + (fileUrl? fileUrl : "<Missing>") + "\n" + JSON.stringify({company:(brand? brand : "<Missing>") ,name:(name? name : "<Missing>") , description:(description? description : "<Missing>") , price:(price? price : "<Missing>") } , null, 2));
            return
        }

        /* first compile metadata, then upload to IPFS */
        /* first, upload to IPFS */
        const data = JSON.stringify({
            name, company:InputForm.state.brand? InputForm.state.brand : "Public", description, meta:coordinateList, type: InputForm.state.type? InputForm.state.type : "TOKEN", subType: inputValue.name, weight: weight, image: fileUrl, timestamp: Date.now()
        })    

        try {
            setLoading(true)

            const metadataFile = new Moralis.File("metadata.json", {base64 : btoa((data))});
            await metadataFile.saveIPFS();
            const metadataURI = metadataFile.ipfs();
            
        // /* after file is uploaded to IPFS, pass the URL to save it on the blockchain */
        createSale(metadataURI)
        } catch (error) {
            alert('Error uploading metadataURI: ' + JSON.stringify(error))
            setLoading(false)
        }  
    }
  
    async function createSale(url) {

        /*create the item */
        const options = {
            contractAddress: NFT_TOKEN_ADDR,
            functionName: "createToken",
            abi: NFT_ABI,
            awaitReceipt: false,
            params: {
                tokenURI: url
            },
          }

        const transaction = await Moralis.executeFunction(options)
        transaction

        .on("receipt", async(receipt) => {
  
            let txEvents = receipt.events
            let txTransfer = txEvents.Transfer
            let txReturnVal = txTransfer.returnValues
            let tokenId = txReturnVal.tokenId
            createMarketItem(tokenId)
        })
        .on("error", (error) => {
            setLoading(false) 
        });
    }

    async function createMarketItem(tokenId){
        
        /* then list the item for sale on the marketplace */
        const price = Moralis.Units.ETH(InputForm.state.price)
        const listingPrice = (price/10).toString()

        const options = {
            contractAddress: MARKETPLACE_ADDR,
            functionName: "createMarketItem",
            abi: MARKET_ABI,
            msgValue: listingPrice,
            awaitReceipt: false,
            params: {
                nftContract: NFT_TOKEN_ADDR,
                tokenId: tokenId,
                price: price
            },
        }

        const transaction = await Moralis.executeFunction(options)
        transaction

        .on("receipt", async(receipt) => {
            updateMarketplace(tokenId)
            setLoading(false)
        })
        .on("error", (error) => {
            setLoading(false)
            alert("Transaction Failed...\n" + JSON.stringify(error)) 
        })

    }

    async function updateMarketplace(tokenId){

        const queryMarket = Moralis.Object.extend("Assets")
        const market = new Moralis.Query(queryMarket);

        market.matches("tokenId", tokenId)
        var result = await market.find()
        
        const objId = JSON.parse(JSON.stringify(result[0])).objectId
        const itemId = JSON.parse(JSON.stringify(result[0])).itemId

        const updateMarket = Moralis.Object.extend("Assets")
        const update = new Moralis.Query(updateMarket);
        result = await update.get(objId)
            .then(obj => {
            obj.set("brand", InputForm.state.brand? InputForm.state.brand : "Pangea")
            obj.save()
            // setLoading(false)
            }).catch(function(error) {
            // There was an error.
            alert("Fail to update Marketplace \n" + JSON.stringify(error))
            setLoading(false)
        });

    }
    return (
        <>
        <div style={{
            cursor:"pointer", 
            zIndex:"2", 
            width:"100%",
            left:"0",
            textAlign:"center",
            position:mapFullscreen? "absolute" : "relative",
            bottom:mapFullscreen? "46px" : "",
            fontSize:"32px"}}>
            <SearchAssetType setInputValue={setInputValue}/>   
        </div>
        {mapFullscreen &&(
            <div className="main-wrapper" 
                style={{
                    position:"absolute", 
                    textAlign:"center", 
                    zIndex:"1", 
                    top:"58px", 
                    left:"0", 
                    width:"calc(100vw - 12px)", 
                    height:"calc(100vh - 76px)"}}>
                
                    <GoogleMap/>
        
                    <FullscreenExitOutlined 
                        onClick={()=> setMapFullscreen(false)}
                        style={{cursor:"pointer", 
                            position:"absolute", 
                            zIndex:"2", 
                            top:"15px",
                            right:"15px", 
                            fontSize:"32px"}}/>
            </div>
        )}
        {!mapFullscreen &&(
        <>
            <div style={{display:"inline-block",width:"400px", position:"relative", 
                marginLeft:"40%", marginRight:"auto", textAlign:"center", overflow:"hidden", zIndex:"1"}}>
                <ul id="grid" style={{backGroundColor:"black", width:"360px", marginLeft:"20px", marginTop:"-0px"}} class="clear">
                    <li className="overflow-hidden">
                        <div className="hexagon" style={{width:"100%", alignContent:"center"}}>
                            <img id="token" className="zoomIn" style={{cursor:"pointer", opacity:"1.0"}} src={fileUrl || require("../../../img/hexic.png").default} />            
                        </div>
                    </li> 
                </ul>
            </div>
            <Card style={styles.card}>
                <Spin spinning={loading} size="large" tip="In Progress...">
                
                <div className="" style={{textAlign:"center", height:"auto", zIndex:"1"}}>
                    <div style={{display:"inline-block", width:"800px"}}>
                        {InputForm.render()}
                        <div className="main-wrapper" style={{display:"inline-block", width:"400px", marginRight:"-30px"}}>
                            <FullscreenOutlined 
                                onClick={()=> setMapFullscreen(true)}
                                style={{cursor:"pointer", 
                                    position:"absolute", 
                                    zIndex:"3", 
                                    right:"0", 
                                    fontSize:"32px"}}/>
                            <GoogleMap/>
                        </div>
                    </div>
                    <div>
                        <input
                            id="assetFile"
                            style={{display:"none"}}
                            type="file"
                            name="Asset"
                            className=""
                            accept="image/*"
                            onChange={onChange}
                        />
                    </div>
                    <div htmlFor="assetFile" style={{width:"400px", zIndex:"2", marginLeft:"auto", marginRight:"auto", textAlign:"center"}} >
                        
                        <Spin spinning={imageUploading} size="large" tip="Uploading...">
                            <button id="pulse" htmlFor="assetFile" style={{margin:"10px 0px"}}>
                                <label htmlFor="assetFile" style={{zIndex:"1", cursor:"pointer", width:"380px", height:"28px"}}>Select Token Image</label>
                            </button>
                            <button id="load-btnAsset" onClick={createMarket} className="btnMintAsset">
                                <label style={{zIndex:"1", cursor:"pointer", width:"400px", height:"25px"}}><span></span></label>
                            </button>
                        </Spin>
                    </div>

                </div>
                </Spin>
            </Card>
            </>
        )}
        </>
  );
}

export default memo(MintFactory);
