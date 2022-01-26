import { useEffect, useState } from "react";
import MyAccount from "./MyAccount"
import MyOrders from "./MyOrders"
import { Card, Layout, Tabs } from "antd";
import "antd/dist/antd.css";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "600",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    width: "450px",
    fontSize: "16px",
    fontWeight: "500",
    textAlign:"center",
    marginLeft:"auto",
    marginRight:"auto",
    opacity:"0.7",
  },
};

function Audit() {
  const [tabSelected, setTabSelected] = useState("1")
  return (
    <div style={{width:"1000px"}}> 
      <Tabs defaultActiveKey="1" style={{marginTop:"-14px"}} indicatorColor={{backgroundColor: 'gray'}}>
        <Tabs.TabPane key="1" tab={<h1 onClick={()=>setTabSelected("1")} style={tabSelected === "1"? {fontSize:"x-large", color:"gray"}:{fontSize:"18px", color:"lightgray"}}>Transactions</h1>} >
            <MyAccount/>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab={<h1 onClick={()=>setTabSelected("2")} style={tabSelected === "2"? {fontSize:"x-large", color:"gray"}:{fontSize:"18px", color:"lightgray"}}>Orders</h1>} >
            <MyOrders/>
        </Tabs.TabPane>
      </Tabs>
    </div>
    
  );
}

export default Audit;
