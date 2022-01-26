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
    </div>
    </>
  );
}
