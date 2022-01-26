import React, { useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Table, Tag, Space } from "antd";
import moment from "moment";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "../LogosGlobal";
import { getCollectionsByChain } from "helpers/collections";

const netIcons = [
    {
      key: "0x1",
      value: "Ethereum",
      icon: <ETHLogo />,
    },
    {
      key: "0x539",
      value: "Local Chain",
      icon: <ETHLogo />,
    },
    {
      key: "0x3",
      value: "Ropsten Testnet",
      icon: <ETHLogo />,
    },
    {
      key: "0x4",
      value: "Rinkeby Testnet",
      icon: <ETHLogo />,
    },
    {
      key: "0x2a",
      value: "Kovan Testnet",
      icon: <ETHLogo />,
    },
    {
      key: "0x5",
      value: "Goerli Testnet",
      icon: <ETHLogo />,
    },
    {
      key: "0x38",
      value: "Binance",
      icon: <BSCLogo />,
    },
    {
      key: "0x61",
      value: "Smart Chain Testnet",
      icon: <BSCLogo />,
    },
    {
      key: "0x89",
      value: "Polygon",
      icon: <PolygonLogo />,
    },
    {
      key: "0x13881",
      value: "Mumbai",
      icon: <PolygonLogo />,
    },
    {
      key: "0xa86a",
      value: "Avalanche",
      icon: <AvaxLogo />,
    },
    {
      key: "0xa869",
      value: "Fuji",
      icon: <AvaxLogo />,
    },
  ];
  
const styles = {
  table: {
    margin: "0 auto",
    width: "1000px",
  },
};

function MyOrders() {

    const { chainId, account } = useMoralis();
    const NFTCollectionsList = getCollectionsByChain(chainId)
    const [iconSelected, setIconSelected] = useState(netIcons[10]);
    
    const queryOrders = useMoralisQuery("Orders");
    const fetchOrders = JSON.parse(
      JSON.stringify(queryOrders.data, [
        "updatedAt",
        "price",
        "nftContract",
        "marketplace",
        "company",
        "tokenId",
        "tokenURI",
        "target",
        "status",
      ])
    )
      .filter(
        (item) => item.target === account
      )
      .sort((a, b) =>
        a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0
      );
  
    useEffect(() => {
    if (!chainId) return netIcons[11];
    const newSelected = netIcons.find((item) => item.key === chainId);
    setIconSelected(newSelected);
    }, [chainId]);
    
    function getImage(addrs, id) {

        const element = NFTCollectionsList.find(
            function (e) {
                if( e.addr.toLowerCase() === addrs.toLowerCase()){
                    return e
                }
            }
        )
        return element?.image;
    }
  
    function getCollection(addrs, id) {
    
        const element = NFTCollectionsList.find(
            (e) => {
                if( e.addr.toLowerCase() === addrs.toLowerCase()){
                    return e
                }
            }
        )
        return element?.name;
    }
  
    function getAssetName(addrs, id) {
      var metaData = JSON.parse(Get(addrs))
      return metaData?.name;
    }

    function getAssetImage(addrs, id) {
      var metaData = JSON.parse(Get(addrs))
      return metaData?.image;
    }
    
    function Get(yourUrl){
      var Httpreq = new XMLHttpRequest(); // a new request
      Httpreq.open("GET",yourUrl,false);
      Httpreq.send(null);
      return Httpreq.responseText;          
    }

    const columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Token ID",
        key: "tokenId",
        render: (text, record) => (
          <Space size="middle">
            <span>#{record.tokenId}</span>
          </Space>
        ),
      },
      {
        title: "Asset",
        key: "asset",
        render: (text, record) => (
          <Space size="middle">
            <img src={getAssetImage(record.tokenURI, record.tokenId)} alt="" style={{ width: "30px", height:"30px", borderRadius:"4px"}} />
            <span>{getAssetName(record.tokenURI, record.tokenId)}</span>
          </Space>
        ),
      },
      {
        title: "Collection",
        key: "collection",
        render: (text, record) => (
          <Space size="middle">
            <img src={getImage(record.collection, record.tokenId)} alt="" style={{ width: "30px", height:"30px", borderRadius:"4px"}} />
            <span>{getCollection(record.collection, record.tokenId)}</span>
          </Space>
        ),
      },
      {
        title: "Transaction Status",
        key: "status",
        render: (text, record) => (
          <Tag color={record.status === "Pending"? "magenta" 
              : record.status === "Published"? "volcano"
              : record.status === "In-Progress"? "purple"
              : record.status === "Completed"? "black"
              : record.status === "Rejected"? "grey" : "grey"}>
            <span>{record.status.toUpperCase()}</span>
          </Tag>
        ),
      },
      {
        title: "Price",
        key: "price",
        dataIndex: "price",
        render: (e) => (
          <Space size="small">
            {iconSelected.icon}
            <span>{e}</span>
          </Space>
        ),
      }
    ];
  
    const data = fetchOrders?.map((item, index) => ({
      key: index,
      date: moment(item.updatedAt).format("DD-MM-YYYY HH:mm"),
      token: item.nftContract,
      tokenURI: item.tokenURI,
      collection: item.marketplace,
      tokenId: item.tokenId,
      status: item.status,
      price: item.price / ("1e" + 18)
    }));
  
    return (
      <>
      <div style={{zIndex:"1", marginTop:"-50px"}}>
        <div style={{width:"100%"}}> 
            <h1 style={{fontSize:"x-large", color:"gray"}}>&#x1F6D2;Orders</h1>
        </div>
        <div style={styles.table}>
          <Table columns={columns} dataSource={data} style={{opacity:"0.7"}}/>
        </div>
      </div>
      </>
    );
  }
  
  export default MyOrders;
