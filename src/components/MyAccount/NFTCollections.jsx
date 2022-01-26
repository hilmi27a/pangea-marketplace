import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Alert, Badge, Modal, Input } from "antd";
import { getNativeByChain } from "helpers/networks";
import { getEllipsisTxt, getEllipsisNormal } from "helpers/formatters";


// import NFT_ABI from "contracts/abi/NFT_ABI.json"
import MARKET_ABI from  "contracts/abi/MARKET_ABI.json"

const MARKETPLACE_ADDR = process.env.REACT_APP_PANGEA_MARKETPLACE_ADDR
// const NFT_TOKEN_ADDR = process.env.REACT_APP_PANGEA_TOKEN_ADDR;


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
    <pre id="metaSeller" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}><b>Company     : </b>{JSON.parse(nftMeta.metadata)?.company? JSON.parse(nftMeta.metadata)?.company : nftMeta.name}</pre>
    <pre id="metaSeller" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}><b>Account ID  : </b>{getEllipsisTxt(nftMeta.owner_of, 8)}</pre>
    <pre id="metaPrice"  style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Token Addr  : </b>{getEllipsisTxt(nftMeta.token_address, 8)}</pre>
    <pre id="metaTime"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Timestamp   : </b>{utcTimeStamp}</pre>
    <pre id="metaTime"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left"}}><b>Token ID    : </b>{nftMeta.token_id}</pre>
    <pre id="metaDesc"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Description : </b>{"JSON.parse(nftMeta.metadata)?.description"}</pre>
    <pre id="metaData"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}><b>Meta:</b></pre>
    <pre id="metaData"   style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"96px", marginTop:"-10px", textAlign:"left", whiteSpace:"pre-wrap"}}>{JSON.stringify(nftMeta)}</pre>
  </div>
)

function NFTCollections() {
  const [NFTCollections, setNFTCollections] = useState();
  const { Moralis, chainId, account } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [nftToSell, setNftToSell] = useState(null);
  
  const [nftImage, setNftImage] = useState('');
  const [utcTimeStamp, setUtcTimeStamp] = useState(null);
  const [price, setPrice] = useState();
  const contractProcessor = useWeb3ExecuteFunction()
  const nativeCrypto = getNativeByChain(chainId)
  const [contractABI, setContractABI] = useState(JSON.stringify(MARKET_ABI));
  const contractABIJson = JSON.parse(contractABI)
  const listItemFunction = "createMarketItem"

  useEffect(() => {
    // Moralis.start({ SERVER_URL, APP_ID });
    getNftCollections()
  }, [chainId, account])


  async function List(nft, currentPrice){

    const price = currentPrice * ("1e" + 18)
    const options = {
      contractAddress: MARKETPLACE_ADDR,
      functionName: listItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: nft.token_address,
        tokenId: nft.token_id,
        price: String(price)
      }
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        alert("Item Listed")
      },
      onError: (error) => {
        alert("something went wrong...\n" + error + "\n")
      }
    })
  }

  const handleSellClick = (nft, img) => {
    var dt = new Date(JSON.parse(nft.metadata).timestamp)
    var dt_str = dt.toString()// toUTCString()
    if (dt_str == "Invalid Date") { dt_str = "Timestamp Not Available!" }

    setUtcTimeStamp(dt_str)
    setNftImage(img)
    setNftToSell(nft);
    setVisibility(true);
  };
  
  async function getNftCollections(){

    // get NFTs for user
    const collectionNFTs = await Moralis.Web3API.account.getNFTs({ chain: chainId });
    var doc = document.getElementById("dcx")

       
    if(collectionNFTs?.result !== undefined){
        setNFTCollections(collectionNFTs)      
    }
  }

  return (
    <>
       <div style={styles.NFTs}>
        <div style={{width:"100%", textAlign:"center", zIndex:"0"}}> 
          <pre id="dcx"></pre>
  
          <h1 style={{display:"block", fontSize:"x-large", color:"gray"}} >Collections</h1> 
          <div style={{display:"inline-block", textAlign:"center", width:"1080px", transform: "scale(0.8)"}}>
          <ul id="grid" style={{backGroundColor:"black"}} className="clear">
              
              { NFTCollections?.result && NFTCollections.result.map((nft, index) => (
                    
                      <li key={nft.key} className="overflow-hidden">
                        <div className="hexagon">
                          
                          <div className="hexText bg-black" style={{height:"20%", marginTop:"64%"}} >
                            <p className="font-xl" >{JSON.parse(nft.metadata).name? (JSON.parse(nft.metadata).name) : getEllipsisNormal(nft.name, 12)}</p>
                          </div>
                          <img id={nft.key} preview={false}
                              src={nft.metadata.image? nft.metadata.image : JSON.parse(nft.metadata).image}
                              className="zoomIn" 
                              style={{cursor:"pointer", position:"absolute", marginTop:"0", zIndex:"-1"}} />
                          <button id="btn-publish" className="rounded" style={{zIndex:"2", marginTop:"80%"}} onClick={() => handleSellClick(nft, JSON.parse(nft.metadata).image)}>Publish</button>
 
                        </div>
                      </li> 
              ))
            }
          </ul>
          </div>
        </div>
      </div>

      {nftToSell != undefined &&(
      <Modal
            title={JSON.parse(nftToSell?.metadata)?.name? JSON.parse(nftToSell?.metadata).name : nftToSell.name }
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => List(nftToSell, price)}
            okText="Publish"
          >
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
              <Badge.Ribbon text="Owned!" color="blue"></Badge.Ribbon>
            
            </div>
            <Alert
              message="This NFT is currently owned. Publish on marketplace to sell!"
              type="info"
              style={{
                width: "480px",
                margin: "auto",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
            <MetaInfo nftMeta={nftToSell} cryptoSymbol={nativeCrypto} utcTimeStamp={utcTimeStamp}/>
            <Input autoFocus placeholder="Set Price in MATIC" onChange={e => setPrice(e.target.value)} />
        </Modal>
        )}
    </>
  );
}

export default NFTCollections;
