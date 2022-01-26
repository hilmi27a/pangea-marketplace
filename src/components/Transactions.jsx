import React, { useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Table, Tag, Space } from "antd";
import { PolygonCurrency } from "./Chains/Logos";
import moment from "moment";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "./LogosGlobal";
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

function NFTMarketTransactions() {
    const { Moralis, chainId, account } = useMoralis();
    const NFTCollectionsList = getCollectionsByChain(chainId)
    const [iconSelected, setIconSelected] = useState(netIcons[10]);
    const queryItemImages = useMoralisQuery("ItemImages");
    const fetchItemImages = JSON.parse(
      JSON.stringify(queryItemImages.data, [
        "nftContract",
        "tokenId",
        "name",
        "image",
      ])
    );
    const queryMarketItems = useMoralisQuery("Assets");
    const fetchMarketItems = JSON.parse(
      JSON.stringify(queryMarketItems.data, [
        "updatedAt",
        "price",
        "nftContract",
        "address",
        "itemId",
        "sold",
        "tokenId",
        "seller",
        "owner",
      ])
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
                if( e.addr.toLowerCase() === addrs){
                    return e
                }
            }
        )
        return element?.image;
    }
  
    function getName(addrs, id) {
        const element = NFTCollectionsList.find(
            (e) => {
                if( e.addr.toLowerCase() == addrs){
                    return e
                }
            }
        )
        return element?.name;
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
            <img src={getImage(record.collection, record.tokenId)} style={{ width: "30px", height:"30px", borderRadius:"4px"}} />
            <span>#{record.tokenId}</span>
          </Space>
        ),
      },
      {
        title: "Collection",
        key: "collection",
        render: (text, record) => (
          <Space size="middle">
            <span>{getName(record.collection, record.tokenId)}</span>
          </Space>
        ),
      },
      {
        title: "Transaction Status",
        key: "tags",
        dataIndex: "tags",
        render: (tags) => (
          <>
            {tags.map((tag) => {
                let color = "purple" //"volcano"
                let status = "WAITING"
                if (String(tag).startsWith("seller")) 
                    {
                    if (String(tag).startsWith("seller" + "true")) {
                        color = "green"
                        status = "SOLD"
                    }
                    else if (String(tag).startsWith("seller" + "false")) {
                        color = "volcano"
                        status = "WAITING"
                    }           
                }
                else if (String(tag).startsWith("owner")) 
                    {
                    if (tag === "owner" + "true" + account) {
                        color = "geekblue"
                        status = "OWNED"
                    }
                    else if (String(tag).startsWith("owner" + "false")) {
                        color = "purple"
                        status = "BUY"
                    }
                    else if (String(tag).startsWith("owner" + "true")) {
                        color = "grey"
                        status = "N/A"
                    }
                }
      
                return (
                <Tag color={color} key={tag}>
                  {status.toUpperCase()}
                </Tag>
              );
            })}
          </>
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
  
    const data = fetchMarketItems?.map((item, index) => ({
      key: index,
      date: moment(item.updatedAt).format("DD-MM-YYYY HH:mm"),
      token: item.nftContract,
      collection: item.address,
      tokenId: item.tokenId,
      tags: [
        "owner"+ item.sold + item.owner, 
        "seller"+ item.sold + item.seller, 
        //item.sold
        ],
      price: item.price / ("1e" + 18)
    }));
  
    return (
      <>
      <div style={{zIndex:"1"}}>
            <div style={{width:"100%"}}> 
            {/* 💸Transactions */}
                <h1 style={{fontSize:"x-large", color:"gray"}}>Transactions</h1>
            </div>
            <div style={styles.table}>
            <Table columns={columns} dataSource={data} style={{opacity:"0.7"}}/>
          </div>
        </div>
      </>
    );
  }
  
  export default NFTMarketTransactions;
