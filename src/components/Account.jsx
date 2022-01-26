import { useMoralis, useMoralisQuery } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import { getExplorer, getNativeByChain } from "helpers/networks";
import Blockie from "./Blockie";
import { Button, Card, Modal, Spin, Alert } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import Address from "./Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { useNativeBalance } from "react-moralis";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "./LogosGlobal";
import { useERC20Balance } from "hooks/useERC20Balance";

const menuItems = [
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
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "192px",//"fit-content",
    marginTop:"5px",
    borderRadius: "12px",
    backgroundColor: "black",//"rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "orange",
  },
};
function Account(props) {
  const { authenticate, isAuthenticated, logout, account, chainId, Moralis, user, isWeb3Enabled, isWeb3EnableLoading, web3EnableError, enableWeb3, web3 } = useMoralis();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: balance, nativeToken } = useNativeBalance(props);
  const nativeCrypto = getNativeByChain(chainId)
  const [selected, setSelected] = useState(menuItems[10]);
  const [formInput, updateFormInput] = useState({ username: null, email: null, company: null, marketplace:null})
  const [imageUploading, setImageUploading] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(require('../img/hexic.png').default)
  const [gasFee, setGasFee] = useState()
  const [unit, setUnit] = useState("GWei")
  const { assets } = useERC20Balance();

  useEffect(async () => {
    if (!chainId) return menuItems[11];
    const newSelected = menuItems.find((item) => item.key === chainId);
    setSelected(newSelected);
    toggleEthUnits()
    // setGasFee(gas)

  }, [chainId, isWeb3EnableLoading]);

  useEffect(() => {
    if(isAuthenticated)
      logout()
    authenticate({ signingMessage: "Logging In..." })

    // alert("current assets: " + JSON.stringify(nativeToken));
  }, [account]);


  if (!isAuthenticated) {
    return (
      <div style={styles.account} onClick={() => authenticate({ signingMessage: "Logging In..." })}>
        <p style={styles.text}>Authenticate</p>
      </div>
    );
  }
  async function onAvatarChange(e) {
    const file = e.target.files[0]
    try {
        setImageUploading(true)
        const imageFile = new Moralis.File(file.name, file)
        await imageFile.saveIPFS()
        const imageURI = imageFile.ipfs()

        setAvatar(imageURI)
        
        setImageUploading(false)
    } catch (error) {
        setImageUploading(false)
        alert('Error uploading imageURI: ', error)
    }  
    setImageUploading(false)
  }

  async function onUpdateProfile(){

    const { username, email, company, marketplace } = formInput

        if(username != null) user.set("username", username)
        if(email != null) user.set("email", email)
        if(company != null) user.set("company", company)
        if(avatar != null) user.set("avatarURL", avatar)
        if(marketplace != null) user.set("marketplace", marketplace)
        await user.save()
        .then(() => {
          alert("Update User Profile Successful!")
          setLoading(false)
        }) 
        .catch(function(error) {
        // There was an error.
        alert("Fail to update User Profile #" + account + "\n" + JSON.stringify(error))
        setLoading(false)
      });

  }

  async function toggleEthUnits(){

    const web3 = await Moralis.Web3.enableWeb3()  
    const gas = await web3.eth.getGasPrice()
    if (parseFloat(gas) < 1000) {
      setGasFee(parseFloat(gas))
      setUnit("Wei")
    }
    else if (parseFloat(gas) >= 1000 && gas <= 1000000) {
      setGasFee((parseFloat(gas)/1000).toFixed(6))
      setUnit("KWei")
    }
    else if (parseFloat(gas) >= 1000000 && gas <= 1000000000) {
      setGasFee((parseFloat(gas)/1000000).toFixed(6))
      setUnit("MWei")
    }
    else if (parseFloat(gas) >= 1000 && gas <= 1000000000000) {
      setGasFee((parseFloat(gas)/1000000000).toFixed(6))
      setUnit("GWei")
    }
    else if (parseFloat(gas) > 1000000000000) {
      setGasFee(parseFloat(Moralis.Units.FromWei(gas, 18).toFixed(6)))
      setUnit(nativeCrypto)
    }
      
  }

  return (
    <>

      <div onClick={() => setIsModalVisible(true)} className="popup" style={{width: "192px", display: "inline-block", borderStyle:"none", borderRadius: "10px 10px 10px 10px",  marginTop: "10px",float: "right"}}> 
        
        <div id="popupInfo">
        
           <div className="popuptext" style={{float:"right"}}>
            <div style={{background:"black", borderRadius: "6px 6px 0px 0px", height: "56px", marginTop:"-8px"}}>
              <img src={user.attributes.avatarURL? user.attributes.avatarURL : require('../img/hexic.png').default} alt='' style={{marginTop:"0px", marginLeft:"10px", height: "48px", width: "48px", borderRadius:"50%"}}></img>
              <p style={{color:"white"}}>Crypto Wallet</p>
            </div>
            <div style={{textAlign:"center",  width:"350px"}}>
              <p style={{fontSize: "medium", color:"white", wordWrap: "break-word", height:"32px"}}>Account</p>
              <p style={{fontSize: "medium", color:"white", overflow: "hidden"}} id="accountId">{getEllipsisTxt(account, 6)}</p>
              <hr style={{width: "198px", marginLeft: "auto", marginRight: "auto"}}></hr>
    
              <div style={{display:"inline-block", textAlign:"center", marginTop:"25px"}}>
                  <div style={{marginTop:"-5px", height:"32px", transform: "scale(1.5)"}}>{selected.icon}</div>
                  <p style={{fontSize: "medium", color:"white", height:"32px"}}>{selected.value}</p>
                  <div>
                    <p style={{fontSize: "medium", color:"white", height:"32px"}}>Chain ID: <span id="chainId">{chainId}</span></p>
                    <p style={{fontSize: "medium", color:"white", height:"32px"}}>Gas Fee: </p>
                    <span id="gasId" style={{color:"white", height:"32px"}}>{gasFee} {unit}</span>
                  </div>
                </div>
                <hr style={{width: "198px", marginLeft: "auto", marginRight: "auto"}}></hr>
                <div style={{display:"inline-block", width:"250px"}}>
                  <p style={{fontSize: "medium", color:"white", overflow: "hidden", textOverflow: "ellipsis", display:"inline-block", height:"38px"}}>Balance: </p>
                  <p id="balanceInfo"  style={{fontSize: "medium", color:"white", fontWeight:"bold", overflow: "hidden", textOverflow: "ellipsis", display:"inline-block", width:"150px", height:"38px"}}>
                    {parseFloat(Moralis.Units.FromWei(balance.balance, 18).toFixed(6))} {nativeCrypto}
                  </p>
                </div>
              </div>
            </div>
        </div>  
        <div id="connectToWallet" style={{display:"inline-block", fontSize: "small", height:"40px", width: "200px", float: "right", 
            fontWeight: "bold", backgroundColor: "rgb(207, 177, 8)", borderStyle: "hidden", borderRadius: "6px 6px 6px 6px", color: "black", padding: "2px"}}>
            
            <img src={user.attributes.avatarURL? user.attributes.avatarURL : require('../img/metamask.svg').default} style={{borderStyle:"none", borderRadius:"50%", visibility:"visible", marginTop:"-4px", height: "42px", width: "42px"}}></img>
            <div>
              <div style={{marginTop:"-20px", marginRight:"auto", marginLeft:"auto"}}>{ user.attributes.email? user.attributes.username : getEllipsisTxt(account, 6)}</div>
              <div style={{marginTop:"-44px"}}>Balance: {parseFloat(Moralis.Units.FromWei(balance.balance, 18).toFixed(3))} {nativeCrypto}</div>
            </div>
        </div>
         
      </div>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
          padding: "15px",
          fontSize: "17px",
          fontWeight: "500",
        }}
        style={{ fontSize: "16px", fontWeight: "500" }}
        width="400px"
      >
        Account
        <Card
          style={{
            marginTop: "10px",
            borderRadius: "1rem",
          }}
          bodyStyle={{ padding: "15px" }}
        >
          <img src={user.attributes.avatarURL? user.attributes.avatarURL : require('../img/metamask.svg').default} style={{borderRadius:"50%", marginLeft:"-14px", height: "64px", width: "64px"}}></img>
          {user.attributes.email? (   
            <div style={{paddingLeft:"64px"}}>
              <h1 style={{display:"block", textAlign:"left", fontSize:"x-large", color:"gray"}}>{user.attributes.username}</h1>
              <h1 style={{display:"block", textAlign:"left", fontSize:"large", color:"gray"}}>{user.attributes.company}</h1>
            </div>
          ) : (
            <Address size={6} copyable style={{ fontSize: "10px" }} />
          )}
          <div onClick={() => setIsProfileVisible(true)} style={{ cursor:"pointer", display:"inline-block", marginTop: "10px", padding: "0 10px" }} >
            <SettingOutlined key="settings" style={{ marginRight: "5px" }} />Settings
          </div>
          <div style={{ display:"inline-block", marginTop: "10px", float:"right", padding: "0 10px" }}>
            <a href={`${getExplorer(chainId)}/address/${account}`} target="_blank" rel="noreferrer">
              <SelectOutlined style={{ marginRight: "5px" }} />
              View on Explorer
            </a>
          </div>
        </Card>
        <Button
          size="large"
          type="primary"
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "0.5rem",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={() => {
            logout();
            setIsModalVisible(false);
          }}
        >
          Disconnect Wallet
        </Button>
      </Modal>

      <Modal
            title="Profile"
            visible={isProfileVisible}
            onCancel={() => setIsProfileVisible(false)}
            cancelText="Return"
            onOk={() => onUpdateProfile()}
            okText="Submit"
            width={500}
            bodyStyle={{
              padding: "15px",
              fontSize: "17px",
              fontWeight: "500",
            }}
            style={{ fontSize: "16px", fontWeight: "500" }}
            
            footer={[
              <Button type="primary" onClick={() => onUpdateProfile()}>
                Submit
              </Button>,
              <Button onClick={() => setIsProfileVisible(false)}>
                Return
              </Button>,
            ]}
          >
          <Spin spinning={loading} size="large" tip="In Progress...">
         <div style={{
            marginRight:"auto",
            marginLeft:"auto",
            textAlign:"center"}}>
            <img
              src={avatar}
              style={{
                height: "240px",
              width: "240px",
              overflow: "hidden",
              borderRadius: "10px",
              marginTop: "-15px",
              marginBottom: "15px",
              marginLeft:"25%",
              marginRight:"auto",
              textAlign:"center"
              }}
            />
            <Alert
              message="Edit Profile"
              type="info"
              style={{
                textAlign:"center",
                width: "400px",
                margin: "auto",
                borderRadius: "10px",
                marginBottom: "15px",
            }}/>
            <div style={{opacity:"0.7"}}>
              <input 
                  id="username"
                  placeholder="Username"
                  className=""
                  type="text"
                  style={{width:"400px", marginTop:"10px"}}
                  onChange={e => updateFormInput({ ...formInput, username: e.target.value })}
              />
            </div>
            <div>
              <input
                  id="email"
                  placeholder="e-Mail"
                  className=""
                  type="text"
                  style={{width:"400px", marginTop:"10px"}}
                  onChange={e => updateFormInput({ ...formInput, email: e.target.value })}
              />
            </div>
            <div>
              <input
                  id="company"
                  placeholder="Company"
                  type="text"
                  style={{width:"400px", marginTop:"10px"}}
                  onChange={e => updateFormInput({ ...formInput, company: e.target.value })}
              />
            </div>
            <div>
              <input
                  id="marketplace"
                  placeholder="Market Address"
                  type="text"
                  style={{width:"400px", marginTop:"10px"}}
                  onChange={e => updateFormInput({ ...formInput, marketplace: e.target.value })}
              />
            </div>
            <div>
              <input
                  id="avatarPic"
                  style={{display:"none"}}
                  type="file"
                  name="avatar"
                  className=""
                  accept="image/*"
                  onChange={onAvatarChange}
              />
            </div>
            <div htmlFor="avatarPic" style={{width:"400px", zIndex:"2", marginLeft:"auto", marginRight:"auto", marginTop:"10px", textAlign:"center"}} >
                <Spin spinning={imageUploading} size="large" tip="Uploading...">
                    <button id="avatarSelect" htmlFor="avatarPic" style={{margin:"10px 0px"}}>
                        <label htmlFor="avatarPic" style={{zIndex:"1", cursor:"pointer", width:"400px", height:"28px"}}>Select Avatar</label>
                    </button>
                </Spin>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
}

export default Account;
