import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Account from "components/Account";
import Chains from "components/Chains";
import MyAccount from "components/MyAccount/MyAccount";
import MyOrders from "components/MyAccount/MyOrders";
import NFTCollections from "components/MyAccount/NFTCollections";
import NFTListings from "components/MyAccount/NFTListings";
import NFTMarketPlace from "components/Marketplace/NFTMarketPlace";
import { Layout, Tabs } from "antd";
import { TwitterSquareFilled, FacebookFilled, YoutubeOutlined, InstagramFilled, LinkedinOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "./style.css";
import "./custom.css";
import "./gmap.css";
import "./honeycomb.css";
import CreatorsDashboard from "components/CreatorsDashboard/CreatorsDashboard";
import NFTMarketTransactions from "components/Transactions";
import Home from "components/Home";
import MenuItems from "./components/MenuItems";
import PolygonWeb from './components/PolygonWeb'

// import { ReactSVG as LogoM } from "./img/metamsk.svg";
const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "15px",
  },
  header: {
    position: "fixed",
    width: "100%",
    height: "62px",
    background: "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "0px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
    zIndex:"10"
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
    zIndex:"10"
  },
  footer: { textAlign: "center", 
    position:"absolute", 
    background:"transparent", 
    bottom:"0px",
    zIndex:"10", 
    width:"100%", 
    height:"64px" },
  socialMedia: { cursor:"pointer", fontSize:"36px", paddingRight:"10px", color:"black" }
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();
  const [tabSelected, setTabSelected] = useState("1")

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto"}}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"
        type="application/javascript"></script>
      <div style={{position:"absolute"}}><PolygonWeb/></div>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <MenuItems/>
          <div style={styles.headerRight}>
            <Chains />
            <Account />
          </div>
        </Header>

        <div style={styles.content}>
          <Switch>
            <Route exact path="/home">
              <Home isServerInfo={isServerInfo} />
            </Route>
            <Route path="/marketplace">              
              <NFTMarketPlace/>
            </Route>
            <Route path="/dashboard">
              <CreatorsDashboard/>
            </Route>
            <Route path="/myAccount">
              <Tabs defaultActiveKey="1" style={{marginTop:"-14px"}} indicatorColor={{backgroundColor: 'gray'}}>
                <Tabs.TabPane key="1" tab={<h1 onClick={()=>setTabSelected("1")} style={tabSelected === "1"? {fontSize:"x-large", color:"gray"}:{fontSize:"18px", color:"lightgray"}}>Collections</h1>} >
                  <NFTCollections/>
                </Tabs.TabPane>
                <Tabs.TabPane key="2" tab={<h1 onClick={()=>setTabSelected("2")} style={tabSelected === "2"? {fontSize:"x-large", color:"gray"}:{fontSize:"18px", color:"lightgray"}}>Listings</h1>} >
                  <NFTListings/>
                </Tabs.TabPane>
                <Tabs.TabPane key="4" tab={<h1 onClick={()=>setTabSelected("4")} style={tabSelected === "4"? {fontSize:"x-large", color:"gray"}:{fontSize:"18px", color:"lightgray"}}>Orders</h1>}>
                  <MyOrders/>
                </Tabs.TabPane>
                <Tabs.TabPane key="3" tab={<h1 onClick={()=>setTabSelected("3")} style={tabSelected === "3"? {fontSize:"x-large", color:"gray"}:{fontSize:"18px", color:"lightgray"}}>Transactions</h1>}>
                  <MyAccount/>
                </Tabs.TabPane>
              </Tabs>
            </Route>
            <Route path="/transactions">
              <NFTMarketTransactions/>
            </Route>
            <Route path="/">
              <Redirect to="/home" />
            </Route>
            <Route path="/home">
              <Redirect to="/home" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>

      <Footer style={styles.footer}>
        <FacebookFilled style={styles.socialMedia}/>
        <InstagramFilled style={styles.socialMedia}/>
        <TwitterSquareFilled style={styles.socialMedia}/>  
        <YoutubeOutlined style={styles.socialMedia}/>    
        <LinkedinOutlined style={styles.socialMedia}/>   
          
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
  <p strong style={{display:"inline-block", fontFamily:"D3Honeycombism", fontSize:"56px", marginTop:"20px", color:"white"}}>P</p>
  </div>
);

export default App;
