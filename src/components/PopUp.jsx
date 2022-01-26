import React from "react";
 
const Popup = props => {
  return (
    <div className="popup-box" style={{position:"fixed", width:"100%"}}>
      <div className="box" style={{width:"100%", height:"auto", maxHeight:"100%", marginTop:"10%", marginLeft:"auto", marginRight:"auto"}}>
        <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};
 
export default Popup;