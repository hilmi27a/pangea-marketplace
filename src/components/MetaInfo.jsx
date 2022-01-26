import React from "react";
 
const MetaInfo = (props) => {
  <div style={{width:"400px", textAlign:"center"}}>  
    <p id="metaAsset" style={{color:"GrayText", maxWidth:"auto", height:"auto", marginTop:"20px", marginLeft:"25%", textAlign:"left", fontWeight: "bold", fontSize:"18px"}}>{props.nftMeta.name}</p>
    <p id="metaSeller" style={{color:"GrayText", fontSize:"18px", maxWidth:"auto", height:"auto", marginTop:"20px", marginLeft:"25%", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}>Company: {props.nftMeta.company}</p>
    <p id="metaSeller" style={{color:"GrayText", fontSize:"18px", maxWidth:"auto", height:"auto", marginTop:"20px", marginLeft:"25%", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}>Account ID: {props.nftMeta.owner}</p>
    <p id="metaPrice" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"20px", marginLeft:"25%", textAlign:"left"}}>Price: {props.nftMeta.price} eth</p>
    <p id="metaTime" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"20px", marginLeft:"25%", textAlign:"left"}}>Timestamp: {props.nftMeta.timestamp}</p>
    <p id="metaTime" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"20px", marginLeft:"25%", textAlign:"left"}}>Type: {props.nftMeta.type}</p>
    <p id="metaDesc" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"20px", marginLeft:"25%", textAlign:"left", overflow: "hidden", textOverflow: "ellipsis"}}>Description: {props.nftMeta.description}</p>
    <p id="metaData" style={{color:"GrayText", fontSize:"16px", maxWidth:"auto", height:"auto", marginTop:"20px", marginLeft:"25%", textAlign:"left", wordWrap:"break-word"}}>Meta: {JSON.stringify(props.nftMeta)}</p>
  </div>
}

export default MetaInfo;