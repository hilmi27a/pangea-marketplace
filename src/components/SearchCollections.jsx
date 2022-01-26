import { Select } from 'antd';
import { useMoralis } from "react-moralis";
import { getCollectionsByChain } from "helpers/collections";

function SearchCollections({setInputValue}){
    const { Option } = Select;
    const { chainId } = useMoralis();
    const NFTCollections = getCollectionsByChain(chainId);
    
    function onChange(value, collection, image, type) { 
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
            placeholder="Find a Collection"
            optionFilterProp="children"
         onChange={onChange}
        >   
            {NFTCollections && 
                NFTCollections.map((asset, i) => 
                <Option value={asset.name} collection={asset} image={asset.image} type={asset.type} key= {i} style={{fontSize:"large", color:"gray"}}>
                    <img src={asset.image || "" } style={{borderRadius:"50%", height:"28px", width:"28px", marginRight:"25px"}} />
                    {asset.name}</Option>
                )
            }   
        </Select>
            
        </>
    )
}
export default SearchCollections;