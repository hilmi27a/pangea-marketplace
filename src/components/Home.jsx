import { Card, Timeline, Typography } from "antd";
import React, { useMemo } from "react";
import { useMoralis } from "react-moralis";

const { Text } = Typography;

export default function Home({ isServerInfo }) {
  const { Moralis } = useMoralis();

  return (
    <>
    <div style={{ gap: "10px", marginTop:"20%", verticalAlign:"middle", textAlign:"center", zIndex:"1" }}>
      <div style={{transform:"scale(3)", verticalAlign:"middle"}}>
        <p strong style={{display:"inline-block", fontFamily:"D3Honeycombism", fontSize:"32px", color:"black"}}>P</p>
        <p strong style={{display:"inline-block", fontFamily:"D3Honeycombism", fontSize:"16px", color:"black"}}>ANGEA</p>
      </div>
      <div style={{transform:"scale(0.5)", verticalAlign:"middle", width:"800px", marginTop:"192px"}}>
        <img src={require('../img/Avalanche.png').default} alt='' style={{width:"300px", height:"110px", float:"left"}}></img>
        <p strong style={{display:"inline-block", fontFamily:"D3Honeycombism", fontSize:"64px", marginTop:"15px", color:"black"}}>+</p>
        <img src={require('../img/Moralis.png').default} alt='' style={{width:"300px", height:"110px", float:"right"}}></img>
      </div>
    </div>
    </>
  );
}
