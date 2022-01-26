import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Alert, Badge, Button, Card, Modal, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { getNativeByChain } from "helpers/networks";
import { getEllipsisTxt, getEllipsisNormal } from "helpers/formatters";

import NFT_ABI from "contracts/abi/NFT_ABI.json"
import MARKET_ABI from  "contracts/abi/MARKET_ABI.json"

const DRONE_DELIVERY_ICON = "https://ipfs.moralis.io:2053/ipfs/QmUtJ4m4XaTPs6mXCGqDh8Zzf1yDxw9mGn74YGC94DfWUy"
const DRONE_DROP_ICON = "https://ipfs.moralis.io:2053/ipfs/QmeadARAfFZXCkeha7XELiQsjeHdtKPXAm3xAhuP1ZMnxt"

const GMAP_API_KEY = process.env.REACT_APP_GMAP_API_KEY
const MARKETPLACE_ADDR = process.env.REACT_APP_PANGEA_MARKETPLACE_ADDR
const NFT_TOKEN_ADDR = process.env.REACT_APP_PANGEA_TOKEN_ADDR;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    width: "100%",
    gap: "10px",
  },
};

const MetaInfo = ({nftMeta, cryptoSymbol, utcTimeStamp}) => (
  <div style={{width:"450px"}}>  
    <pre id="metaSeller" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}><b>Company     : </b>{(nftMeta)?.company? (nftMeta).company : nftMeta.name}</pre>
    <pre id="metaSeller" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}><b>Account ID  : </b>{getEllipsisTxt(nftMeta.owner, 8)}</pre>
    <pre id="metaPrice"  style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Token Addr  : </b>{getEllipsisTxt(nftMeta.nftContract, 8)}</pre>
    <pre id="metaPrice"  style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Price       : </b>{nftMeta.priceEth} {cryptoSymbol}</pre>
    <pre id="metaTime"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Timestamp   : </b>{utcTimeStamp}</pre>
    <pre id="metaTime"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Token ID    : </b>{nftMeta.tokenId}</pre>
    <pre id="metaDesc"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Description : </b>{(nftMeta)?.description}</pre>
    <pre id="metaData"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Meta:</b></pre>
    <pre id="metaData"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"96px", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}>{JSON.stringify(nftMeta)}</pre>
  </div>
)

function NFTListings() {
  const[debug, setDebug] = useState("")
  const [NFTCreated, setNFTCreated] = useState([]);
  const [NFTOrdered, setNFTOrdered] = useState([]);
  const [NFTSold, setNFTSold] = useState([]);
  const [loading, setLoading] = useState(false)
  const { Moralis, chainId, account } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [zoomCanvas, setZoomCanvas] = useState(false);
  const [amountToSend, setAmount] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [nftAssets, setNfAssets] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [reloadTracking, setReloadTracking] = useState(false);
  
  const [nftImage, setNftImage] = useState('');
  const [utcTimeStamp, setUtcTimeStamp] = useState(null);
  const contractProcessor = useWeb3ExecuteFunction()
  const nativeCrypto = getNativeByChain(chainId)
  const [fetchOrders, setFetchOrders] = useState([])
  
  const [Tracking, setTracking] = useState('');
  const [SatelliteMap, setSatelliteMap] = useState('');
  const [RoadMap, setRoadMap] = useState('');
  const staticMapURI = "https://maps.googleapis.com/maps/api/staticmap?&size=600x400&maptype="

  let createdItems = []
  let soldItems = []

  useEffect( () => {
    getNFTCreated()
    getOrders()
  }, [chainId, account])

  function onRefresh(){
    
    getOrders()
    setRefresh(true)
    setTimeout(()=>setRefresh(false),800)
  }
  
  var testInit = true
  var testCycle = 3
  let testPath = []
  const [countCycle, setcountCycle] = useState(0);
  const incrementCounter = () => setcountCycle(countCycle + 1);

  async function onRefreshTracking(nft){

    /*Simulated tracking....*/
    if (testInit) { 
      testInit = false
      for(var i = 0; i < nft.metaData.length - 1; i++){
        var lat1, lat2, lng1, lng2, dlat, dlng
        lat1  = nft.metaData[i].lat
        lng1  = nft.metaData[i].lng
        lat2  = nft.metaData[i+1].lat
        lng2  = nft.metaData[i+1].lng

        dlat = (parseFloat(lat2) - parseFloat(lat1)) / testCycle
        dlng = (parseFloat(lng2) - parseFloat(lng1)) / testCycle

        testPath.push({lat:parseFloat(lat1), lng: parseFloat(lng1)})
        for(var j = 1; j<= testCycle; j++){
          testPath.push({lat:parseFloat(lat1) + dlat*j, lng: parseFloat(lng1) + dlng*j})
        }
        testPath.push({lat:lat2, lng: lng2})
      

      }
      
    }
    incrementCounter()
    var packageDroped = false
    // alert(countCycle)
    let testRoute = []
    
    if(countCycle < testPath.length){
      testRoute = testPath.slice(0, countCycle)
    }
    else if(countCycle > testPath.length - 1){
      packageDroped = true
      setTracking('')
      // alert(packageDroped)
      const OrdersList = Moralis.Object.extend("Orders")
      const reset = new Moralis.Query(OrdersList);
      await reset.get(nft.objectId)
        .then(obj => {
          obj.set("tracking", '')
          obj.set("delivered", false)
          obj.save()

        }).catch(function(error) {
          // There was an error.
          alert("Fail to reset Tracking #" + nft.objectId + "\n" + JSON.stringify(nft))
        });
        testPath = []
        testInit = true
        setcountCycle(0)
    }
    const OrdersList = Moralis.Object.extend("Orders")
    const update = new Moralis.Query(OrdersList);
    await update.get(nft.objectId)
      .then(obj => {
        obj.set("tracking", testRoute)
        obj.set("delivered", packageDroped)
        obj.save()

      }).catch(function(error) {
        // There was an error.
        alert("Fail to update Tracking #" + nft.objectId + "\n" + JSON.stringify(nft))
      });

    /*Simulated tracking....END*/

    var path, trackPath = ""

    const Tracking = Moralis.Object.extend("Orders");
    const query = new Moralis.Query(Tracking);
    query.equalTo("objectId", nft.objectId);
    const route = await query.find();

    var pathColor = "0x828886bb"
    var fillColor = `|fillcolor:0xFFFF0033`
    var icon

    if(route[0].delivered === true){
      icon = DRONE_DROP_ICON
    }
    else 
      icon = DRONE_DELIVERY_ICON

    if(JSON.parse(JSON.stringify(route)).length > 0){
      path = JSON.parse(JSON.stringify(route[0]), "", 2).tracking

      setReloadTracking(true)
      if(path.length > 0){
        path.forEach((path, index) => {
            trackPath += `|${path.lat},${path.lng}`
        });

        fillColor=""
        trackPath = `&path=color:${pathColor}|weight:5${fillColor}
                    ${trackPath}&markers=anchor:center%7Cicon:${icon}%7c
                    ${path[path.length - 1].lat},${path[path.length - 1].lng}`

        setTracking(trackPath)

      }
      handleAssetsClick(nft, nft.image)
    }
    setTimeout(()=>setReloadTracking(false),800)
  }

  async function transfer(nft, amount, receiver) {
    const options = {
      type: nft.contract_type,
      tokenId: nft.token_id,
      receiver: receiver,
      contractAddress: nft.token_address,
    };

    if (options.type === "erc1155") {
      options.amount = amount;
    }

    setIsPending(true);
    await Moralis.transfer(options)
      .then((tx) => {
        console.log(tx);
        setIsPending(false);
      })
      .catch((e) => {
        alert(e.message);
        setIsPending(false);
      });
  }

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  function onCanvasClick(state, type){
    setZoomCanvas(state)
    setVisibility(!state)
  }

  async function onConfirmClick(state, nft){
    setLoading(true)
    if(nft.status === "Pending")
      await createSale(nft)
    else if(nft.status === "In-Progress")
      await updateOrderProgress(nft)
  }

  async function updateOrderProgress(nft){
    const orderList = Moralis.Object.extend("Orders")
    const update = new Moralis.Query(orderList);
    await update.get(nft.objectId)
      .then(obj => {
        obj.set("status", "Completed")
        obj.save()
        setLoading(false)
      }).catch(function(error) {
        // There was an error.
        alert("Fail to update Order Status #" + nft.objectId + "\n" + JSON.stringify(error))
        setLoading(false)
      });
  }

  async function createSale(nft) {

      /*create the item */
      const options = {
          contractAddress: nft.nftContract,
          functionName: "createToken",
          abi: NFT_ABI,
          awaitReceipt: false,
          params: {
              tokenURI: nft.tokenURI
          },
        }

      const transaction = await Moralis.executeFunction(options)
      transaction
      .on("receipt", async(receipt) => {
          
          let txEvents = receipt.events
          let txTransfer = txEvents.Transfer
          let txReturnVal = txTransfer.returnValues
          let tokenId = txReturnVal.tokenId
          
          createMarketItem(nft, tokenId)
      })
      .on("error", (error) => {
          setLoading(false)
          setZoomCanvas(false)
          alert( "Error " + JSON.stringify(error) )
      });
  }

  async function createMarketItem(nft, tokenId){
      
      /* then list the item for sale on the marketplace */
      const price = Moralis.Units.ETH(nft.priceEth)
      const listingPrice = (price/10).toString()

      const options = {
          contractAddress: MARKETPLACE_ADDR,
          functionName: "createMarketItem",
          abi: MARKET_ABI,
          msgValue: listingPrice,
          awaitReceipt: false,
          params: {
              nftContract: nft.nftContract,
              tokenId: tokenId,
              price: price
          },
      }

      const transaction = await Moralis.executeFunction(options)
      transaction
      .on("receipt", async(receipt) => {
          setLoading(false)
          
          setZoomCanvas(false)
          setVisibility(false)
          
          updateMarketplace(nft, tokenId) 
      })
      .on("error", (error) => {
          setLoading(false)
          alert("Transaction Failed...\n" + JSON.stringify(error)) 
      })

  }

  async function updateMarketplace(nft, tokenId){

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
        obj.set("target", nft.target)
        obj.set("orderId", nft.objectId)
        obj.save()
        updateOrders(nft, itemId, tokenId, objId)
        // setLoading(false)
      }).catch(function(error) {
        // There was an error.
        alert("Fail to update Marketplace \n" + JSON.stringify(error))
        setLoading(false)
      });

  }
  
  async function updateOrders(nft, itemId, tokenId, marketId){
    
    const id = nft.objectId

    const updateOrders = Moralis.Object.extend("Orders")
    const query = new Moralis.Query(updateOrders);
    await query.get(id)
      .then(obj => {
        obj.set("status", "Published")
        obj.set("itemId", itemId)
        obj.set("tokenId", tokenId)
        obj.set("marketId", marketId)
        obj.save()
      })
      .then((setOrder) => {
        // The object was saved successfully.
        alert("Order Published Successful!")
          getOrders()
          setLoading(false)
      }, (error) => {
        // The save failed.
        // error is a Moralis.Error with an error code and message.
          alert('Error Publishing Order: ' + JSON.stringify(error, null, 2))
          setLoading(false)
      });
      setLoading(false)
  }

  async function onRejectClick(state, nft){
    
    setLoading(true)
    const id = nft.objectId

    const updateOrders = Moralis.Object.extend("Orders")
    const query = new Moralis.Query(updateOrders);
    await query.get(id)
      .then(obj => {
        obj.set("status", "Rejected")
        obj.save()
      })
      .then((setOrder) => {
        // The object was saved successfully.
        alert("Order Rejected Successful!")
          setLoading(false)
          setZoomCanvas(state)
          setVisibility(state)
          getOrders()
      }, (error) => {
        // The save failed.
        // error is a Moralis.Error with an error code and message.
          alert('Error Rejecting Order: ' + JSON.stringify(error, null, 2))
          setLoading(false)
      });
      setLoading(false)
  }
  

  const geodeticFencePoints = (radius, lat, lng) => {
    
    var earth = 6378.137  //radius of the earth in kilometer
    var geoFence = []
    //For latitude
    var pi = Math.PI
    var cos = Math.cos
    var sin = Math.sin
    var _meters = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

    for(var i = 0; i < 51; i++){
    
        geoFence.push({
            lat: lat + (radius * _meters * cos(i/8)), 
            lng: lng + (radius * _meters * sin(i/8)) / cos(lat * (pi / 180))
        })
      }
    return geoFence
  }

  const handleAssetsClick = (nft, img) => {

    var mapParameters = ""
    var mapPath = ""
    var dt = new Date((nft).timestamp)
    var dt_str = dt.toString()// toUTCString()
    if (dt_str === "Invalid Date") { dt_str = "Timestamp Not Available!" }

    setUtcTimeStamp(dt_str)
    
    var pathColor = "lightblue"
    var fillColor = "lightblue"
    if(nft.type === "GMAP"){
     
      if(nft.subType === "Observation" || nft.subType === "Communication"){
        pathColor = nft.subType === "Observation"? '0xee950a33' : '0x0aee8733'
        fillColor = "|fillcolor:" + pathColor 
        
        var markerColor = "red"
        markerColor = "red"
       
        mapParameters += `&markers=color:${markerColor}%7Clabel:1%7C${nft.metaData[0].lat},${nft.metaData[0].lng}`
        
        geodeticFencePoints(2500, nft.metaData[0].lat, nft.metaData[0].lng).forEach((element, index) => {
          mapPath += `|${element.lat},${element.lng}`
        });
        mapPath = `&path=color:${pathColor}|weight:5${fillColor}` + mapPath
      }
      else{
        if(nft.subType === "Courier" || nft.subType === "Navigation"){
          pathColor = 'lightblue' 
          fillColor = ""
        }
        else if(nft.subType === "Emergency") {
          pathColor = 'red'
          fillColor = ""
        }
        
        nft.metaData.forEach((element, index) => {
          markerColor = "red"
          mapParameters += `&markers=color:${markerColor}%7Clabel:${index}%7C${element.lat},${element.lng}`

          mapPath += `|${element.lat},${element.lng}`
        });
        mapPath = `&path=color:${pathColor}|weight:5${fillColor}` + mapPath

      }

      setSatelliteMap(`${staticMapURI}satellite${mapParameters}${mapPath}${Tracking}&key=${GMAP_API_KEY}`)
      setRoadMap(`${staticMapURI}roadmap${mapParameters}${mapPath}${Tracking}&key=${GMAP_API_KEY}`)
      
      setNftImage(RoadMap)
    }else
      setNftImage(img)
    
    setNfAssets(nft);
    setVisibility(true);
  };
  
  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  async function getOrders() {

    var keyIdx = 0

    const Orders = Moralis.Object.extend("Orders");
    const query = new Moralis.Query(Orders);
    query.equalTo("marketplace", MARKETPLACE_ADDR);
    const object = await query.find();

    setFetchOrders(object)

    if(fetchOrders !== null){
        
      const items = await Promise.all(fetchOrders?.map(async elm => {
        
        const element = JSON.parse(JSON.stringify(elm))
        var metaData
      
        try {
          metaData = JSON.parse(Get(element.tokenURI));
        } catch (error) {
          ;
        }

        const priceEth = Moralis.Units.FromWei(element.price? element.price : 0)
        const priceUSD = ""
      
        let item = {
          key: keyIdx++,
          priceEth,
          priceUSD,
          priceWei: element.price,
          objectId: element.objectId,
          tokenId: element.tokenId,
          itemId: element.itemId,
          marketId: element.marketId,
          company: element.company,
          image: metaData?.image,
          name: metaData?.name,
          type: element.type,
          subType: element.subType,
          description: metaData?.description,
          nftContract: element.nftContract,
          tokenURI: element.tokenURI,
          timestamp: element.createdAt,
          metaData: metaData?.meta,
          orderRequest: true,
          status: element?.status,
          target: element?.target,
          bulk: element?.bulk,
          tracking: element.tracking
        }
        
        return item
      }))
      setNFTOrdered(items)       
    }
  }

  async function getNFTCreated() {

    const marketList = Moralis.Object.extend("Assets")
    const query = new Moralis.Query(marketList);
    const marketData = await query.equalTo("seller", account).find()

    let tokens = []
    marketData.forEach (elm => {
      const i = JSON.parse(JSON.stringify(elm))
       tokens.push(i.tokenId)
    })
    const nftTransaction = Moralis.Object.extend("AvaxNFTOwners")
    const query2 = new Moralis.Query(nftTransaction);
    const tokenData = await query2.containedIn("token_id", tokens).find()

    if(marketData !== null){

        var keyIdx = 0

        marketData.forEach(elm => {
          const i = JSON.parse(JSON.stringify(elm))
          tokenData.forEach( item =>  {
            const e = JSON.parse(JSON.stringify(item))
            if(JSON.stringify(e.token_id) === JSON.stringify(i.tokenId)){

              const price = i?.price? i.price : 0

              const priceEth = Moralis.Units.FromWei(price)
              const priceUSD = ""

              var metaData

              try {
                metaData = JSON.parse(Get(e.token_uri));
              } catch (error) {
                ;
              }
            
              let item = {
                key: keyIdx++,
                priceEth,
                priceUSD,
                objectId: i?.objectId,
                tokenId: e.token_id,
                itemId: i?.itemId,
                company: metaData?.company,
                seller: i?.seller,
                owner: e.owner_of,
                image: metaData?.image,
                name: metaData?.name,
                description: metaData?.description,
                nftContract: i?.nftContract,
                sold: i?.sold,
                confirmed: i?.confirmed,
                timestamp: i?.updatedAt,
                metaData: metaData?.meta,
              }

              if(item.sold === false){
                createdItems.push(item) 
                   
              }else if(item.sold === true){
                soldItems.push(item) 
              } 

            }
          })
      })
    }
    try {
      setNFTCreated((createdItems))
      setNFTSold(soldItems)
     
    } catch (error) {
      setDebug("NFTList >> " + JSON.stringify(error))
    }
  }

  async function buyNFT(nft) {

    setLoading(true)
    const price = Moralis.Units.ETH(nft.priceEth)
    const options = {
      contractAddress: MARKETPLACE_ADDR,
      functionName: "createMarketSale",
      abi: MARKET_ABI,
      msgValue: price,
      params: {
        nftContract: NFT_TOKEN_ADDR,
        itemId: nft.itemId
      },
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        alert("Transaction Successful, Item Purchased!")
        updateSoldMarketItem(nft)
        setVisibility(false)
        setLoading(false)
      },
      onError: (error) => {
        alert("Transaction Failed!, something went wrong...\n" + JSON.stringify(error, null, 2))
  
        setVisibility(false)
        setLoading(false)
      }
    })
  }

  async function updateSoldMarketItem(nft){

    const id = nft.marketId
    const marketList = Moralis.Object.extend("Assets")
    const query = new Moralis.Query(marketList);
    await query.get(id)
      .then(obj => {
        obj.set("sold", true)
        obj.set("owner", account)
        obj.set("status", "Completed")
        obj.save()
      })

    const orderId = nft.objectId
    const orderList = Moralis.Object.extend("Orders")
    const update = new Moralis.Query(orderList);
    await update.get(orderId)
      .then(obj => {
        obj.set("status", "In-Progress")
        obj.set("tokenId", nft.tokenId)
        obj.save()
        setLoading(false)
      })
  }

  function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
  }
  return (
    <>
       <div style={styles.NFTs}>
        <div onClick={()=>onRefresh()} style={{cursor:"pointer", zIndex:"1", width:"200px", marginLeft:"720px", fontSize:"xx-large", fontWeight:"bold", color:"gray"}}>
          <ReloadOutlined spin={refresh}/> Refresh
        </div>
        <div style={{width:"100%", textAlign:"center", zIndex:"0"}}> 
        {NFTOrdered.length > 0 && ( 
          <div style={{display:"inline-block", textAlign:"center", width:"1080px", transform: "scale(0.8)"}}>
            <h1 style={{display:"block", textAlign:"left", fontSize:"x-large", color:"gray", textDecoration:"underline"}}>Orders</h1>
              <ul id="grid" style={{backGroundColor:"black"}} className="clear">
              
                {NFTOrdered?.map((nft, index) => (                      
                  <li key={nft.key} className="overflow-hidden">
                    <div className="hexagon">
                      
                      <div className="hexText bg-black" >
                        <p className="font-xl" >{(nft).name? getEllipsisNormal(nft.name, 12) : "???"}</p>
                        <p className="font-large">{nft.priceEth} {nativeCrypto}</p>
                      </div>
                      <img id={nft?.key} preview={false}
                          src={nft.image? nft.image : ""}
                          alt=""
                          className="zoomIn" 
                          style={{cursor:"pointer", position:"absolute", marginTop:"0", zIndex:"-1"}} />
                      {nft.status === "Pending" && (
                        <button id="btn-orders" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleAssetsClick(nft, nft.image)}>Pending</button> 
                      )}
                      {nft.status === "Published" && (
                        <button id="btn-buy" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleAssetsClick(nft, nft.image)}>Buy</button>
                      )}
                      {nft.status === "In-Progress" && (
                        <button id="btn-inProgress" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleAssetsClick(nft, nft.image)}>In-Progress</button>
                      )}
                      {nft.status === "Completed" && (
                        <button id="btn-completed" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleAssetsClick(nft, nft.image)}>Completed</button>
                      )}
                      {nft.status === "Rejected" && (
                        <button id="btn-rejected" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleAssetsClick(nft, nft.image)}>Rejected</button>
                      )}
                      
                    </div>
                  </li> 
                ))}
              </ul>
            </div>
          )}

        {NFTCreated.length > 0 && ( 
        <div style={{display:"inline-block", textAlign:"center", width:"1080px", transform: "scale(0.8)"}}>
         
          <h1 style={{display:"block", textAlign:"left", fontSize:"x-large", color:"gray", textDecoration:"underline"}}>Published</h1>
            <ul id="grid" style={{backGroundColor:"black"}} className="clear">
              
                {NFTCreated?.map((nft, index) => (                      
                  <li key={nft.key} className="overflow-hidden">
                    <div className="hexagon">
                      
                      <div className="hexText bg-black" >
                        <p className="font-xl" >{(nft).name? getEllipsisNormal(nft.name, 12) : "???"}</p>
                        <p className="font-large">{nft.priceEth} {nativeCrypto}</p>

                      </div>
                      <img id={nft.key} preview={false}
                          src={nft.image? nft.image : ""}
                          alt=""
                          className="zoomIn" 
                          style={{cursor:"pointer", position:"absolute", marginTop:"0", zIndex:"-1"}} />
                      <button id="btn-published" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleAssetsClick(nft, nft.image)}>Published</button> 

                    </div>
                  </li> 
                ))}
            </ul>
          </div>
        )}
        
        {NFTSold.length > 0 && ( 
          <div style={{display:"inline-block", textAlign:"center", width:"1080px", transform: "scale(0.8)"}}>
          
            <h1 style={{display:"block", textAlign:"left", fontSize:"x-large", color:"gray", textDecoration:"underline"}} >Sold</h1> 
            <ul id="grid" style={{backGroundColor:"black"}} className="clear">
              
                {NFTSold?.map((nft, index) => (
                      
                  <li key={nft.key} className="overflow-hidden">
                    <div className="hexagon">
                      
                      <div className="hexText bg-black" >
                      <p className="font-xl" >{(nft).name? getEllipsisNormal((nft).name, 12) : getEllipsisNormal(nft.name, 12)}</p>
                      <p className="font-large">{nft.priceEth} {nativeCrypto}</p>

                      </div>
                      <img id={nft.key} preview={false}
                          src={nft.image? nft.image : ""}
                          alt=""
                          className="zoomIn img-grayscale" 
                          style={{cursor:"pointer", position:"absolute", marginTop:"0", zIndex:"-1"}} />
                      <button id="btn-sold" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleAssetsClick(nft, (nft).image)}>Sold</button> 

                    </div>
                  </li> 
                ))}
            </ul>
          </div>
        )}
        </div>
      </div>
  
      {nftAssets !== undefined &&(
      <Modal
        title={(nftAssets)?.name? (nftAssets).name : nftAssets.name }
        visible={visible}
        onCancel={() => setVisibility(false)}
        cancelText = "Return"
        onOk={() => (nftAssets.status === "Pending" || nftAssets.status === "In-Progress")? onCanvasClick(true, nftAssets.type) 
        : (nftAssets.status === "Published")? buyNFT(nftAssets) : setVisibility(false)}
        okText={(nftAssets.status === "Pending" || nftAssets.status === "In-Progress")? "Options" 
        : (nftAssets.status === "Published")? "Buy" : "OK"}
      >
        <Spin spinning={loading} size="large" tip="In Progress...">
          <div style={{display:"block",
              width: "250px",
              marginRight:"auto",
              marginLeft:"auto",
              textAlign:"center"}}>
            <img
              src={nftImage}
              alt=""
              className={nftAssets.sold ? "img-grayscale" : ""}
              onClick={() => nftAssets.sold ? onCanvasClick(false, nftAssets.type) : onCanvasClick(true, nftAssets.type)}
              style={{display:"block",
              height: "100%",
              width: "100%",
              overflow: "hidden",
              borderRadius: "10px",
              marginTop: "-15px",
              marginBottom: "15px",
              cursor:"pointer"}}
            />
            {nftAssets.orderRequest ? (
              <Badge.Ribbon 
                text={nftAssets.status} 
                color={nftAssets.status === "Rejected"? "red" 
                  : nftAssets.status === "Published"? "volcano" 
                  : nftAssets.status === "In-Progress"? "purple" 
                  : nftAssets.status === "Completed"? "black" : "magenta"}>

              </Badge.Ribbon>
                ) : ( 
                nftAssets.sold ? (
                  <Badge.Ribbon text="Sold!" color="black"></Badge.Ribbon>
                  ) : (
                  <Badge.Ribbon text="Published!" color="orangered"></Badge.Ribbon>
                )
              )
            }
          </div>

          {nftAssets.orderRequest ? (
            <Alert
              message={nftAssets.status === "Rejected" ? "This order is Rejected" 
                    : nftAssets.status === "In-Progress" ? "This order is currently In-Progress!"
                    : nftAssets.status === "Published" ? "This order is currently awaiting purchase or payment!"
                    : nftAssets.status === "Completed" ? "This order has been Completed!" 
                    : "This order is currently Pending request approval!"}
              type={nftAssets.status === "Rejected" ? "error" : "info"}
              style={{
                textAlign:"center",
                width: "480px",
                margin: "auto",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
            ) : ( 
            nftAssets.sold ? (
              <Alert
                message="This NFT has been sold!"
                type="success"
                style={{
                  textAlign:"center",
                  width: "480px",
                  margin: "auto",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
              ) : (
                <Alert
                message="This NFT is currently published on the marketplace!"
                type="info"
                style={{
                  textAlign:"center",
                  width: "480px",
                  margin: "auto",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
              )
            )}
            <MetaInfo nftMeta={nftAssets} cryptoSymbol={nativeCrypto} utcTimeStamp={utcTimeStamp}/>
          </Spin>
        </Modal>
        )}

        {zoomCanvas && 
          <Modal
            title={(nftAssets)?.name? (nftAssets).name : nftAssets.name }
            visible={zoomCanvas? "visible" : "hidden"}
            onCancel={() => onCanvasClick(false, nftAssets.type)}
            cancelText="Return"
            onOk={() => onCanvasClick(false, nftAssets.type)}
            okText={(nftAssets.status === "Pending")? "Confirm" : "OK"}
            width={(nftAssets.type === "Cafe")? 1080 : window.innerWidth }
            height={(nftAssets.type === "Cafe")? 800: window.innerHeight}
            style={{top:0}}
            
            footer={[
              <Button type="primary" style={{visibility:(nftAssets.status === "Pending" || nftAssets.status === "In-Progress")? "visible" : "hidden"}} 
                onClick={() => {
                  onRefreshTracking(nftAssets)
                }}>
                <ReloadOutlined spin={reloadTracking}/> Refresh
              </Button>,
              <Button type="primary" style={{visibility:(nftAssets.status === "Pending" || nftAssets.status === "In-Progress")? "visible" : "hidden"}} onClick={() => onConfirmClick(false, nftAssets)}>
                Confirm
              </Button>,
              <Button type="primary" style={{visibility:(nftAssets.status === "Pending" || nftAssets.status === "In-Progress")? "visible" : "hidden"}} onClick={() => onRejectClick(false, nftAssets)}>
                Reject
              </Button>,
              <Button onClick={() => onCanvasClick(false, nftAssets.type)}>
                Return
              </Button>,
            ]}
          >
          <Spin spinning={loading} size="large" tip="In Progress...">
            <div style={{display:"block",
              width: "100%",
              height: "100%",
              marginRight:"auto",
              marginLeft:"auto",
              textAlign:"center"}}>
              
              {nftAssets.bulk? (
                <>
                <div className="sticky"  style={{height:"180px", textAlign:"center", top:"56px", zIndex:"2"}}/>
                <div style={{ position:"absolute", textAlign:"center", marginLeft:"40%", marginRight:"auto", top:"-86px", zIndex:"10"}}>
                  <h1 style={{display:"block", fontSize:"x-large", color:"gray"}} >{(nftAssets.company)}</h1>     
                  <div style={{width:"100px", marginLeft:"auto", marginRight:"auto"}}>
                   <img src={nftAssets.image || require("../../img/hexic.png").default} className="zoomIn" style={{ textAlign:"center", alignContent:"center", width:"150px", height:"100px", borderRadius:"50%"}} />
                  </div> 
                </div>
                <div style={{marginTop:"64px", width:"1080px", transform: "scale(0.8)"}}>
                  {nftAssets.metaData.map((nft, index) => (
                    <div style={{height:"240px", marginLeft:"0px", paddingRight:"20px", display:"inline-block"}}>
                      <ul id="grid" style={{backGroundColor:"black", width:"520px", display:"inline-block"}} className="clear">
                        <li key={nft?.key} className="overflow-hidden">
                          <div className="hexagon">
                            <img id={nft?.key} src={nft?.meta?.image? nft?.meta.image : JSON.parse(nft?.meta)?.image} alt="" className="zoomIn" style={{cursor:"pointer", position:"absolute", marginTop:"0", zIndex:"-1"}} />
                          </div>
                        </li> 
                      </ul>
                      <div style={{marginLeft:"-368px", marginTop:"25px", position:"absolute", display:"inline-block"}}>
                        <Card size="small"
                          style={{width:"380px"}} 
                          >
                          <div className="" >
                            <p className=""  style={{textAlign:"left"}}>{nft?.meta?.name? nft.meta.name : nft?.name}</p>
                            <p className="font-large" style={{textAlign:"left"}}>{nft?.priceEth} {nativeCrypto}</p>
                            <p className="font-large" style={{textAlign:"left"}}>{getEllipsisNormal(nft?.meta.description, 45)}</p>  
                          </div>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
                </>
              ) : (
              <img
                src={(nftAssets.type === "GMAP")? SatelliteMap : nftImage}
                className={nftAssets.sold ? "img-grayscale" : ""}
                style={{display:"block",
                height: "100%",
                width: "100%",
                overflow: "hidden",
                borderRadius: "10px",
                marginTop: "-15px",
                marginBottom: "15px",
                }}
              />
              )}
                
            </div>
          </Spin>
          </Modal>
    }
    </>
  );
}

export default NFTListings;
