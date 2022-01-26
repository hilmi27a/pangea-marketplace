import { Select } from 'antd';
import { getAssetType } from "helpers/assetType";


function SearchAssetType({setInputValue}){
    const { Option } = Select;
    const company = "Pangea";
    const Assets = getAssetType(company);
    
    function onChange(value, collection, image) { 
        setInputValue(collection.collection);
    }

    return (
        <>
        <Select
            showSearch
            style={{width: "500px",
                    marginLeft: "20px",
                    fontSize:"large",
                    color:"gray" }}
            placeholder="Select Mission Type"
            optionFilterProp="children"
         onChange={onChange}
        >   
            {Assets && 
                Assets.map((asset, i) => 
                <Option value={asset.name} collection={asset} image={asset.image} key= {i} style={{fontSize:"large", color:"gray"}}>
                    <img src={asset.image || "" }style={{borderRadius:"50%", height:"28px", width:"28px", marginRight:"25px"}} />
                    {asset.name}</Option>
                )
            }   
        </Select>
            
        </>
    )
}
export default SearchAssetType;