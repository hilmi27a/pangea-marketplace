import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "../LogosGlobal"

export const networkLogo = {
    "0x1" : [
        {
            key: "0x1",
            value: "Ethereum",
            icon: <ETHLogo />,
        },
    ],
    "0x539" : [
        {
            key: "0x539",
            value: "Local Chain",
            icon: <ETHLogo />,
        },
    ],
    "0x3" : [
        {
            key: "0x3",
            value: "Ropsten Testnet",
            icon: <ETHLogo />,
        },
    ],
    "0x4" : [ 
        {
            key: "0x4",
            value: "Rinkeby Testnet",
            icon: <ETHLogo />,
         },
    ],
    "0x4" : [ 
        {
            key: "0x2a",
            value: "Kovan Testnet",
            icon: <ETHLogo />,
        },
    ],
    "0x4" : [ 
        {
            key: "0x5",
            value: "Goerli Testnet",
            icon: <ETHLogo />,
        },
    ],
    "0x4" : [ 
        {
            key: "0x38",
            value: "Binance",
            icon: <BSCLogo />,
        },
    ],
    "0x4" : [ 
        {
            key: "0x61",
            value: "Smart Chain Testnet",
            icon: <BSCLogo />,
             },
    ],
    "0x4" : [ 
        {
            key: "0x89",
            value: "Polygon",
            icon: <PolygonLogo />,
             },
    ],
    "0x4" : [ 
        {
            key: "0x13881",
            value: "Mumbai",
            icon: <PolygonLogo />,
             },
    ],
    "0x4" : [ 
        {
            key: "0xa86a",
            value: "Avalanche",
            icon: <AvaxLogo />,
             },
    ],
    "0x4" : [ 
        {
            key: "0xa869",
            value: "Fuji",
            icon: <AvaxLogo />,
        },
    ]
};
  export const getLogoByChain = (chain) => networkLogo[chain]