import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { getNativeByChain } from "helpers/networks";
import { getEllipsisTxt, getEllipsisNormal } from "helpers/formatters";
import { Alert, Card, Modal, Badge, Spin, Button, notification  } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { getCollectionsByChain } from "helpers/collections";
import SearchCollections from "../SearchCollections";

// import NFT_ABI from "contracts/abi/NFT_ABI.json"
import MARKET_ABI from  "contracts/abi/MARKET_ABI.json"
import "../../cart.css"

const MARKETPLACE_ADDR = process.env.REACT_APP_PANGEA_MARKETPLACE_ADDR
const NFT_TOKEN_ADDR = process.env.REACT_APP_PANGEA_TOKEN_ADDR;
const { Meta } = Card;

const key = 'updatable'
let cart = [] 
let priceList = []
var totalPrice


const Cart = props => {

  return (
  <Modal
  title={props.title}
  visible={props.state}
  onCancel={props.closeCart}
  cancelText="Return"
  onOk={props.closeCart}
  
  footer={[
    <Button type="primary" onClick={props.buy}>
      Order
    </Button>,
    <Button type="primary" onClick={props.closeCart}>
      Clear
    </Button>,
    <Button onClick={props.clear}>
      Return
    </Button>,
  ]}
  >
    <Spin spinning={props.loading}>
      
        <div id="cartGrid">
            <div class="head" style={{width:"64px", background:"none"}}></div>
            <div class="head" style={{width:"64px" }}>No.</div>
            <div class="head" style={{width:"250px"}}>Item</div>
            <div class="head" style={{width:"80px"}}>Price <p style={{fontSize:"10px"}}>(AVAX)</p></div>
          {props.content}
            
        </div>
      </Spin>
    </Modal>
    )
  }

const MetaInfo = ({nftMeta, cryptoSymbol, utcTimeStamp}) => (
  <div style={{width:"450px"}}>  
    <pre id="metaAsset"  style={{color:"GrayText", fontSize:"20px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"center", fontWeight: "bolder", textDecoration:"underline"}}>{nftMeta.meta?.name}</pre>
    <pre id="metaSeller" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}><b>Company     : </b>{nftMeta.meta?.company? nftMeta.meta.company : nftMeta.name}</pre>
    <pre id="metaSeller" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}><b>Account ID  : </b>{getEllipsisTxt(nftMeta.owner, 8)}</pre>
    <pre id="metaPrice"  style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Token ID    : </b>{nftMeta.tokenId}</pre>
    <pre id="metaPrice"  style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Price       : </b>{nftMeta.priceEth} {cryptoSymbol}</pre>
    <pre id="metaTime"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Timestamp   : </b>{utcTimeStamp}</pre>
    <pre id="metaTime"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Type        : </b>{nftMeta.meta?.type}</pre>
    <pre id="metaDesc"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Description : </b>{nftMeta.meta?.description}</pre>
    <pre id="metaData"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Meta:</b></pre>
    <pre id="metaData"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"96px", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}>{JSON.stringify(nftMeta)}</pre>
  </div>
)

const MenuInfo = ({nftMeta, cryptoSymbol, utcTimeStamp}) => (
  <div style={{width:"450px"}}>  
    <pre id="metaAsset"  style={{color:"GrayText", fontSize:"20px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"center", fontWeight: "bolder", textDecoration:"underline"}}>{nftMeta.meta?.name}</pre>
    <pre id="metaPrice"  style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Price       : </b>{nftMeta.priceEth} {cryptoSymbol}</pre>
    <pre id="metaTime"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Type        : </b>{nftMeta.meta?.type}</pre>
    <pre id="metaDesc"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Description : </b>{nftMeta.meta?.description}</pre>
  </div>
)

function NFTBalance() {
  const[debug, setDebug] = useState("")
  const [utcTimeStamp, setUtcTimeStamp] = useState(null);
  const { Moralis, chainId, account, web3, user } = useMoralis();
  const [visible, setVisibility] = useState(false);

  const [nftToBuy, setNftToBuy] = useState(null);
  const [nftImage, setNftImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ordersUploading, setOrdersUploading] = useState(false);

  const [setCart, resetCart] = useState(cart);
  const [setTotalPrice, resetTotalPrice] = useState();
  const contractProcessor = useWeb3ExecuteFunction()
  const [cartVisible, setCartVisible] = useState(false)
  const [nftCollections, setNftCollections] = useState([])
  const NFTCollectionsList = getCollectionsByChain(chainId);
  const [inputValue, setInputValue] = useState({addr:"0x0", name:"Market", image:"", type:"Honeycomb"})
  const nativeCrypto = getNativeByChain(chainId)


  useEffect(async () => {
    getMarketNftCollections()

  }, [inputValue, chainId, account])

  useEffect(async () => {
    setInputValue({addr:"0x0", name:"Market", image:"", type:"Honeycomb"})
  }, [chainId])

  useEffect(async () => {
    resetCart(cart)
  }, [cart])

  
  function removeFromCart(nft, index)
  {
    cart.splice(index, 1)
    priceList.splice(index, 1)
    resetTotalPrice(priceList.reduce((x,y) => x + parseFloat(y), 0)) 
    resetCart(cart)
  }

  function addingToCart(item){
    cart.push(item)
    priceList.push(item.priceEth)
    totalPrice = priceList.reduce((x,y) => x + parseFloat(y), 0)
    resetTotalPrice(totalPrice)

    notification.open({
      key,
      message: 'Adding to Cart',
      description: '🛒 ✚ Cart Count ' + cart.length,
      placement: 'topLeft'
    });

  };

  async function createBulkOrders(){
    var description = "Order request to " + inputValue.name + " from " + user.attributes.username
    const data = JSON.stringify({
        name:user.attributes.username, 
        company:inputValue.name, 
        description: description, 
        meta: setCart, 
        type: inputValue.type, 
        image: inputValue.image, 
        timestamp: Date.now()
    })    

    try {
      setOrdersUploading(true)

        const metadataFile = new Moralis.File("metadata.json", {base64 : btoa((data))});
        await metadataFile.saveIPFS();
        const metadataURI = metadataFile.ipfs();
        
        /* after file is uploaded to IPFS, pass the URL to save it on the blockchain */
        submitBulkOrders(metadataURI)
    } catch (error) {
        alert('Error uploading metadataURI: ' + JSON.stringify(data, null, 2))
        setOrdersUploading(false)
    }  
  }
  
  async function submitBulkOrders(metaURI){

    const priceEth = Moralis.Units.ETH(setTotalPrice)
    const Orders = Moralis.Object.extend("Orders");
    const newOrder = new Orders();
    newOrder.save({
        company: inputValue.name,
        type: inputValue.type,
        tokenURI: metaURI, 
        nftContract: NFT_TOKEN_ADDR, 
        marketplace: MARKETPLACE_ADDR, 
        price: priceEth, 
        target: account,
        bulk: true
    })
    
    newOrder.save()
    .then((newOrder) => {
      // The object was saved successfully.
      alert("Order Created " + JSON.stringify(newOrder, null, 2))
      setOrdersUploading(false)
    }, (error) => {
      // The save failed.
      // error is a Moralis.Error with an error code and message.
        alert('Error uploading newOrder: ' + JSON.stringify(error, null, 2))
        setOrdersUploading(false)
    });
    setOrdersUploading(false)
    
    resetCart([])
    resetTotalPrice()
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

    const id = nft.objectId
    const marketList = Moralis.Object.extend("Assets")
    const query = new Moralis.Query(marketList);
    await query.get(id)
      .then(obj => {
        obj.set("sold", true)
        obj.set("owner", account)
        obj.set("status", "Completed")
        obj.save()
      })

    const orderId = nft.orderId
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

  async function getMarketNftCollections(){
    var debug

    const Assets = Moralis.Object.extend("Assets");
    const query = new Moralis.Query(Assets);
    query.equalTo("confirmed", true)
    query.equalTo("sold", false)
    query.equalTo("brand", inputValue.name)
     
    query.limit(200);
    const fetchMarketItems = await query.find(); 

    const web3 = await Moralis.enableWeb3();
    const optionsNFT = { chain: chainId, address: inputValue.addr, token_address: NFT_TOKEN_ADDR, limit:200 };
    const marketNFTs = await Moralis.Web3API.account.getNFTsForContract(optionsNFT); 
   
    const data = JSON.parse(JSON.stringify(fetchMarketItems))
    if(marketNFTs?.result !== null){
      
      var items = await Promise.all(marketNFTs?.result?.map(async i => {
        
        var element = data.find(function (obj) {
          debug += "\n find " + i.token_id + " " + obj.tokenId
          if (obj.tokenId === i.token_id){
            return obj
          }
        })
        if(element !== null){
          if(element?.brand === inputValue.name || element?.target === account){
            const price = element?.price? element.price : 0

            const priceEth = Moralis.Units.FromWei(price)
            const priceUSD = ""
            
            var keyIdx = 0
            const meta = JSON.parse(i.metadata)
            let item = {
              key: keyIdx++,
              priceEth,
              priceUSD,
              objectId: element?.objectId,
              tokenId: i.token_id,
              itemId: element?.itemId,
              seller: element?.seller,
              owner: i.owner_of,
              image: meta?.image,
              name: i.name,
              nftContract: element?.token_address,
              sold: element?.sold,
              confirmed: element?.confirmed,
              timestamp: element?.updatedAt,
              meta: meta,
              target: element?.target,
              orderId: element?.orderId,
              brand: element?.brand
            }
            return item
          }
        }
      }))
      items = items.filter(Boolean)
      setNftCollections(items)
    
    }
    
  }

  const handleBuyClick = (nft, img) => {
    var dt = new Date(nft.meta?.timestamp)
    var dt_str = dt.toString() 
    if (dt_str == "Invalid Date") { dt_str = "Timestamp Not Available!" }

    setNftImage(img)
    setUtcTimeStamp(dt_str)
    setNftToBuy(nft)
    setVisibility(true)

  };

  return (
    <>
      <div className="sticky"  style={{textAlign:"center", top:"62px", zIndex:"1"}}/>{debug}
      <div style={{ position:"absolute", textAlign:"center", marginLeft:"auto", marginRight:"auto", top:"62px", zIndex:"2"}}>
        <div style={{display:"inline-block", textAlign:"center", paddingTop:"15px", cursor:"pointer"}}
          >
          <Cart
            title={inputValue.name}
            content={cart}
            buy={()=> createBulkOrders()}
            itemKey={key}
            clear={()=> setCartVisible(false)}
            state={cartVisible}
            closeCart={()=>setCartVisible(false)} 
            loading={ordersUploading}
            content={
              <>
              {(setCart.length > 0)? setCart.map((nft, index) => (
                <>
                <div id={"c0" + nft.tokenId} class="cell">
                    <Button key={nft.tokenId} onClick={() => removeFromCart(nft,index)} style={{marginTop:"-5px"}}>🗑️</Button>
                </div>
                <div id={"c1" + nft.tokenId} class="cell">x1</div>
                <div id={"c2" + nft.tokenId} class="cell">{nft.meta?.name}</div>
                <div id={"c3" + nft.tokenId} class="cell">{nft.priceEth}</div>
                
                </>
            )) : (
                <>
                <div class="cell"></div>
                <div class="cell"></div>
                <h1 style={{display:"block", fontSize:"large", color:"gray", borderBottom:"1px solid lightgray"}} >Cart Is Empty...</h1>  
                <div class="cell"></div>   
                </>
            )}
            {(setCart.length  > 0) &&(
                <>
                <div class="cell"></div>
                <div class="cell">x{cart.length}</div>
                <div class="cell">Total Price</div>
                <div id="sum" class="cell">{setTotalPrice}</div>
                </>
            )}
            </>
          }
          />
          <div>
            <p style={{display:"inline-block", color:"gray", fontSize:"18px"}}>{cart.length > 0 ? "x" + cart.length : ""}</p>
            <p onClick={()=>setCartVisible(true)} style={{display:"inline-block", color:"gray"}}>🛒</p>
          </div>
        </div>
        <SearchCollections setInputValue={setInputValue}/>   
        <h1 style={{display:"block", fontSize:"x-large", color:"gray"}} >{(inputValue.name)}</h1>     
        <div style={{width:"100px", marginLeft:"auto", marginRight:"auto"}}>
          <img src={inputValue.image || require("../../img/hexic.png").default} className="zoomIn" style={{ textAlign:"center", alignContent:"center", width:"150px", height:"100px", borderRadius:"50%"}} />
        </div> 
      </div>
      
      <div style={{textAlign:"center", marginTop:"125px", zIndex:"0"}}>
        {chainId && (
        <div style={{display:"block", textAlign:"center", width:"1080px", transform: "scale(0.8)"}}>
          {(inputValue.name !== "Market" && inputValue.type === "Honeycomb") && (
          <ul id="grid" style={{backGroundColor:"black", top:"-580px"}} className="clear">
            
              { nftCollections && nftCollections.map((nft, index) => (
                  
                      <li key={nft?.key} className="overflow-hidden">
                        <div className="hexagon">
                          
                          <div className="hexText bg-black" >
                            <p className="font-xl" >{nft?.meta?.name? getEllipsisNormal(nft.meta.name, 12) : nft?.name}</p>
                            <p className="font-large">{nft?.priceEth} {nativeCrypto}</p>
                            
                          </div>
                          <img id={nft?.key} src={nft?.meta?.image? nft?.meta.image : JSON.parse(nft?.meta)?.image} className="zoomIn" style={{cursor:"pointer", position:"absolute", marginTop:"0", zIndex:"-1"}} />
                          {(nft?.confirmed != false)? (
                            <button id="btn-buy" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleBuyClick(nft, (nft.meta?.image? nft.meta.image : JSON.parse(nft.meta)?.image))}>Buy</button>
                          ) : (
                            <button id="btn-notForSale" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleBuyClick(nft, (nft.meta?.image? nft.meta?.image : JSON.parse(nft.meta)?.image))}>Buy</button>
                          ) }
                          
                        </div>
                      </li> 
              ))
            }
          </ul>)}
          {(inputValue.name !== "Market" && inputValue.type === "Cafe") && (
            <div style={{marginTop:"-0px"}}>
              { nftCollections && nftCollections.map((nft, index) => (
                <>
                <div style={{height:"240px", marginLeft:"15px", display:"inline-block"}}>
                  <ul id="grid" style={{backGroundColor:"black", width:"520px", display:"inline-block"}} className="clear">
                    <li key={nft?.key} className="overflow-hidden">
                      <div className="hexagon">
                        <img id={nft?.key} src={nft?.meta?.image? nft?.meta.image : JSON.parse(nft?.meta)?.image} className="zoomIn" style={{cursor:"pointer", position:"absolute", marginTop:"0", zIndex:"-1"}} />
                      </div>
                    </li> 
                  </ul>
                  <div style={{marginLeft:"-35%", marginTop:"0", position:"absolute", display:"inline-block"}}>
                    <Card size="small"
                      style={{width:"380px", paddingRight:"15px"}} 
                      actions={[
                        <>
                        {(nft?.confirmed != false)? (
                          <button id="btn-buy" className="rounded" style={{zIndex:"2", marginTop:"0", width:"88px"}} onClick={() => handleBuyClick(nft, (nft.meta?.image? nft.meta.image : JSON.parse(nft.meta)?.image))}>Buy</button>
                        ) : (
                          <button id="btn-notForSale" className="rounded" style={{zIndex:"2"}} onClick={() => handleBuyClick(nft, (nft.meta?.image? nft.meta?.image : JSON.parse(nft.meta)?.image))}>Buy</button>
                        ) }
                        </>,
                        <ShoppingCartOutlined style={{transform: "scale(1.8)"}} onClick={() => addingToCart(nft)}/>
                      ]}
                      >
                      <div className="" >
                        <p className=""  style={{textAlign:"left"}}>{nft?.meta?.name? nft.meta.name : nft?.name}</p>
                        <p className="font-large" style={{textAlign:"left"}}>{nft?.priceEth} {nativeCrypto}</p>
                        <p className="font-large" style={{textAlign:"left"}}>{getEllipsisNormal(nft?.meta.description, 45)}</p>  
                      </div>
                    </Card>
                  </div>
                </div>
                  {/* )} */}
                 </>
              ))}
              
            </div>
          )}
          {inputValue.name == "Market" && (
          <ul id="grid" style={{backGroundColor:"black"}} className="clear">
            
              { NFTCollectionsList && NFTCollectionsList.map((nft, index) => (
                  
                      <li key={nft.key} className="overflow-hidden">
                        <div className="hexagon" style={{width:"100%", alignContent:"center"}}>
                          
                          <img id={nft.key} src={nft.image} className="zoomIn" style={{cursor:"pointer", position:"absolute", marginTop:"0", zIndex:"-1"}} />
                          <button id="btn-explore" className="rounded" style={{zIndex:"1"}} onClick={() => setInputValue({addr: nft.addr, name:nft.name, image:nft.image, type:nft.type})}><p id="btn-explore-txt">{(nft.name)}</p></button>
                          
                        </div>
                      </li> 
              ))
            }
          </ul>)}
        </div> 
        )}
        
      </div>

      {(nftToBuy?.confirmed != false) ? (
        <Modal
          title={`${nftToBuy?.meta?.name}`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          onOk={() => buyNFT(nftToBuy)}
          okText="Buy"
          footer={[
            <>
            {(inputValue.type === "Cafe") && (
            <ShoppingCartOutlined style={{transform: "scale(1.8)", marginRight:"15px"}} 
              onClick={() => addingToCart(nftToBuy)}/>
            )}
            </>,
            <Button onClick={() => setVisibility(false)}>
              Return
            </Button>,
            <Button type="primary" onClick={() => buyNFT(nftToBuy)}>
              Buy
            </Button>,
          ]}
         >
          <Spin spinning={loading} size="large" tip="In Progress...">
            <div style={{display:"block",
                width: "250px",
                marginRight:"auto",
                marginLeft:"auto",
                textAlign:"center"}}>
              <img
                  src={nftImage}
                  style={{ 
                  display:"block",
                  width: "250px",
                  borderRadius: "10px",
                  marginTop: "-15px",
                  marginBottom: "15px",
                }}
              />
              <Badge.Ribbon text={`${nftToBuy?.priceEth} ${nativeCrypto}`} color="green"></Badge.Ribbon>
            </div>

                <Alert
                message="This NFT is for purchase"
                type="success"
                style={{
                  width: "480px",
                  margin: "auto",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  textAlign:"center"
                }}
              /> 
              {inputValue.type === "Honeycomb"? (
                <MetaInfo nftMeta={nftToBuy} cryptoSymbol={nativeCrypto} utcTimeStamp={utcTimeStamp}/>
              ) : (
                <MenuInfo nftMeta={nftToBuy} cryptoSymbol={nativeCrypto} utcTimeStamp={utcTimeStamp}/>  
              )}
            </Spin>
          </Modal>
        ): (
          <Modal
            title={`${nftToBuy?.name} - ${nftToBuy?.meta?.name}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => setVisibility(false)}
            okText="Ok"
          >
            <Spin spinning={loading} size="large" tip="In Progress...">
              <div style={{display:"block",
                  width: "250px",
                  marginRight:"auto",
                  marginLeft:"auto",
                  textAlign:"center"}}>
                <img
                  src={nftImage}
                  style={{display:"block",
                    width: "250px",
                    borderRadius: "10px",
                    marginTop: "-15px",
                    marginBottom: "15px",
                  }}
                />
                <Badge.Ribbon text={`${nftToBuy?.priceEth} ${nativeCrypto}`} color="black"></Badge.Ribbon>
              </div>
              <Alert
                message="This NFT is currently not for purchase"
                type="warning"
                style={{
                  width: "480px",
                  margin: "auto",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  textAlign:"center"
                }}
                />
                {inputValue.type === "Honeycomb"? (
                  <MetaInfo nftMeta={nftToBuy} cryptoSymbol={nativeCrypto} utcTimeStamp={utcTimeStamp}/>
                ) : (
                  <MenuInfo nftMeta={nftToBuy} cryptoSymbol={nativeCrypto} utcTimeStamp={utcTimeStamp}/>  
                )}
            </Spin>
          </Modal>
            )
          }
    </>
  );
}

export default NFTBalance;
