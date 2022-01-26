import React, { Component, useState, useEffect, memo } from 'react'

class Form extends Component {
    constructor(props) {
        super(props);
        this.assetBrand = React.createRef();
        this.assetName  = React.createRef();
        this.assetDesc  = React.createRef();
        this.assetPrice = React.createRef();
        this.assetType  = React.createRef();
        this.assetWeight  = React.createRef();
    }

    state = {
        price: "", 
        brand: "",
        name: "", 
        description: "",
        type: "",
        weight: ""
    }

    handleSubmit = () => {

        this.state.price = this.assetPrice.current.value
        this.state.brand = this.assetBrand.current.value
        this.state.name = this.assetName.current.value
        this.state.description = this.assetDesc.current.value
        this.state.type = this.assetType.current.value
        this.state.weight = this.assetWeight.current.value
    }
    render() {
        return (
        <div>
            <div style={{display:"inline-block", float:"left", marginTop:"10px", width:"250px"}}>
            <div style={{opacity:"0.7"}}>
                <input 
                    id="assetBrand"
                    placeholder="Company/Brand Name"
                    className=""
                    type="text"
                    style={{width:"300px"}}
                    ref={this.assetBrand}
                />
            </div>
            <div style={{opacity:"0.7", marginTop:"10px"}}>
                <input 
                    id="assetName"
                    placeholder="Asset Name"
                    className=""
                    type="text"
                    style={{width:"300px"}}
                    ref={this.assetName}
                />
            </div>
            <div style={{opacity:"0.7", marginTop:"10px"}}>
                <input 
                    id="assetType"
                    placeholder="Asset Type"
                    className=""
                    type="text"
                    style={{width:"300px"}}
                    ref={this.assetType}
                />
            </div>
            <div style={{opacity:"0.7", marginTop:"10px"}}>
                <input 
                    id="assetWeight"
                    placeholder="Asset Weight"
                    className=""
                    type="text"
                    style={{width:"300px"}}
                    ref={this.assetWeight}
                />
            </div>
            <div>
                <textarea
                    id="assetDesc"
                    placeholder="Asset Description"
                    className=""
                    style={{width:"300px", height:"120px", marginTop:"10px"}}
                    ref={this.assetDesc}
                />
            </div>
            <div>
                <input 
                    id="assetPrice"
                    placeholder={`Asset Price`}
                    className=""
                    type="text"
                    style={{width:"300px"}}
                    ref={this.assetPrice}
                />
            </div>
            
        </div>


        </div>
        );
    }
}
export default Form;