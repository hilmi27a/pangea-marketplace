import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        height: "64px",
        justifyContent: "center",
        color: "white",
        background: "#000"
      }}
      
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/home" style={{backgroundColor:"transparent"}}>
        <NavLink to="/home" style={{backgroundColor:"black", color:"white", fontWeight:"normal"}}>Home</NavLink>
      </Menu.Item>
      <Menu.Item key="/marketplace" style={{backgroundColor:"transparent"}}>
        <NavLink to="/marketplace" style={{backgroundColor:"black", color:"white", fontWeight:"normal"}}>Market Place</NavLink>
      </Menu.Item>
      <Menu.Item key="/dashboard" style={{backgroundColor:"transparent"}}>
        <NavLink to="/dashboard" style={{backgroundColor:"black", color:"white", fontWeight:"normal"}}>Dashboard</NavLink>
      </Menu.Item>
      <Menu.Item key="/myAccount" style={{backgroundColor:"transparent"}}>
        <NavLink to="/myAccount" style={{backgroundColor:"black", color:"white", fontWeight:"normal"}}>My Account</NavLink>
      </Menu.Item>
      <Menu.Item key="/transactions" style={{backgroundColor:"transparent"}}>
        <NavLink to="/transactions" style={{background:"black", color:"white", padding:"0,10px,0,10px", fontWeight:"normal"}}>Transactions</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
