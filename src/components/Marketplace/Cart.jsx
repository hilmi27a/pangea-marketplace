import React from "react";
import { Button, Modal } from "antd";
import "../../cart.css"



const Cart = props => {

    async function removeFromCart(nft, index){
        alert(index + window.cart)
    }
    
    return (
    <Modal
    title={props.title}
    visible={props.state}
    onCancel={props.closeCart}
    cancelText="Return"
    onOk={props.closeCart}
    
    footer={[
      <Button type="primary" onClick={props.closeCart}>
        Buy
      </Button>,
      <Button type="primary" onClick={props.closeCart}>
        Clear
      </Button>,
      <Button onClick={props.closeCart}>
        Return
      </Button>,
    ]}
  >
      <div>
        <div id="cartGrid">
            <div class="head" style={{width:"64px", background:"none"}}></div>
            <div class="head" style={{width:"64px" }}>No.</div>
            <div class="head" style={{width:"250px"}}>Item</div>
            <div class="head" style={{width:"80px"}}>Price <p style={{fontSize:"10px"}}>(AVAX)</p></div>
        
            {(props.content.length > 0)? props.content.map((nft, index) => (
                <>
                <div class="cell">
                    <Button key={index} onClick={() => removeFromCart(nft,index)} style={{marginTop:"-5px"}}>🗑️</Button>
                </div>
                <div class="cell">x1</div>
                <div class="cell">{nft.meta?.name}</div>
                <div class="cell">{nft.priceEth}</div>

                </>
            )) : (
                <>
                <div class="cell"></div>
                <div class="cell"></div>
                <h1 style={{display:"block", fontSize:"large", color:"gray", borderBottom:"1px solid lightgray"}} >Cart Is Empty...</h1>  
                <div class="cell"></div>   
                </>
            )}
            {(props.content.length  > 0) &&(
                <>
                <div class="cell"></div>
                <div class="cell">x{props.content.length}</div>
                <div class="cell">Total Price</div>
                <div class="cell">{props.total}</div>
                </>
            )}
        </div>
      </div>
        
  </Modal>
  );
};
 
export default Cart;

