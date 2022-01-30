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
        this.assetUnit  = React.createRef();
    }

    state = {
        price: "", 
        brand: "",
        name: "", 
        description: "",
        type: "",
        weight: "",
        unit: ""
    }

    onChange = (e) => { 
        var val = e.target.value
        this.state.unit = val
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
            <div style={{display:"inline-flex"}}>
                <div style={{opacity:"0.7", marginTop:"10px", display:"inline-block"}}>
                    <input 
                        id="assetWeight"
                        placeholder="Asset Weight"
                        className=""
                        type="text"
                        style={{width:"240px", marginRight:"10px"}}
                        ref={this.assetWeight}
                    />
                </div>
                <select
                    id="assetUnit"
                    onChange={this.onChange}
                    className="form-control"
                    ref={this.assetUnit}
                    style={{display:"inline-block", width:"50px", height:"28px", marginTop:"10px"}}
                >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                </select>
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