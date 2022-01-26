export const MarkerWaypoint = ({ text }) => (

    <div style={{
      zIndex:1,
      color: 'white',
      background: 'rgba(25, 25, 25, 0.577)',
      padding: '15px 10px',
      display: 'inline-flex',
      width:'40px',
      height:'40px',
      marginTop: '-22px',
      position: 'absolute',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '100%',
      borderStyle:'solid',
      borderColor:'#fd005f',
      borderWidth: '3px',
      transform: 'translate(-50%, -50%)',
      cursor: 'pointer'
  
    }}>
      <div style={{
        zIndex:1,
        position: 'absolute',
        top: '4.5%',
        left: '26.5%',
        marginTop: '100%',
        height:"20px",
        borderWidth: '8px',
        borderStyle: 'solid',
        transform: 'rotate(0deg)',
        borderColor:'#fd005f transparent transparent transparent',
       }}>
       </div>
      {text}
    </div>
  );

  
  
export const MarkerInfo = ({ text, header }) => (

    <div style={{
      className:"infoPanel valigndiv",
      zIndex:10,
      color: 'black',
      background: 'rgba(255, 255, 255, 1)',
      padding: '0px 0px 0px 0px',
      display: 'absolute',
      width:'180px',
      height:'90px',
      minHeight:'70px',
      maxHeight:'140px',
      fontSize: "12px",
      marginTop: '-100px',
      marginLeft: '55px',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
      paddingBottom:"60px",
      borderRadius: '10px',
      transform: 'translate(-50%, -50%)',
      visibility:'visible',
      borderStyle:'solid',
      borderColor:'rgba(255,255,255,1)',
      borderWidth: '3px',
      whiteSpace: 'pre-wrap'
  
    }}>
      <div style={{
        className:"infoPanel",
        zIndex:10,
        position: 'absolute',
        top: '103%',
        left: '15%',
        borderStyle:'solid',
        borderBlockColor:'white',
        borderWidth: '8px',
        borderStyle: 'solid',
        transform: 'rotate(0deg)',
        borderColor:'rgba(255,255,255,1) transparent transparent transparent',
       }}>
       </div>
        <p style={{fontWeight:"bold", fontSize:"14px", textDecorationLine:"underline", overflow: "hidden", textOverflow: "ellipsis", width:"180px", height:"32px"}}>{header}</p>
        <p style={{width:'180px', height:"auto", fontSize:"12px"}}> {text} </p>
      
    </div>
  );

  