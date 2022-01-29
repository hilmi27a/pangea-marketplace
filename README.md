<p align="center">
  <img src="https://user-images.githubusercontent.com/58431844/151583126-99b5a800-ce31-4dd5-b3a2-d79233300655.png" alt="">
</p>

#
# 🏛️ Pangea - Marketplace!

This Project is derived from a cloned repo of [Ethereum Boilerplate](https://github.com/ethereum-boilerplate/ethereum-unity-boilerplate) and innovated to showcase the administrative, fleet management and logistics capabilities of dApp services via Moralis and Avalanche integration for drones or UAVs and possibly non aerial logistics like the postal service or even for communication service deployment. This project mainly shows the potential of blockchain being used as a logistical tools. In the case of this porject its the Fleet Management of drones and its mission request orders be it urban planning, navigation, observation, emergency medical kit deployment or just as a simple courier service. The application shows that with Moralis API and backend integration and powered by Avalanche Network chain, Its possible to create the a decentralised Administrative or Fleet Management dApp.  

<p align="center">
  <img src="https://user-images.githubusercontent.com/58431844/151638239-e17fdc7c-280b-4b4d-a977-a8578afc5ba2.png" alt="">
</p>

>Please check the [official documentation of Moralis](https://docs.moralis.io/introduction/readme) for all the functionalities of Moralis.

>All images, icons and fonts are captured and acquired from google images and free-fonts.com. This project does not take credit for any of these visuals and are meant to serve as a demo. Any modification derive from this repository will have to recreate/change the visual assets. 

![frontpage](https://user-images.githubusercontent.com/58431844/151322122-275426b5-af17-4d36-9677-d3435f9688ea.png)

# Pangea 
# 🚀Quickstart

> 💿 This Project requires the following api API access:
- `Moralis App ID` for Fuji or Avalanche Mainnet
- `Moralis Server Url` for Fuji or Avalanche Mainnet
- `Google Map` API key for geolocation, geofencing and geo positioning map request
- `Google Autoplaces` API key for location search by places.
- [`TS-Particles`](https://particles.js.org/) as an optional visual layout


Update the placeholder.env with the respective details and rename to ".env"
```sh
AREACT_APP_VALANCHE_MAINNET_MORALIS_APP_ID="Moralis Avalanche Mainnnet App ID"
REACT_APP_AVALANCHE_MAINNET_MORALIS_SERVER_URL="Moralis Avalanche Mainnnet url"

REACT_APP_AVALANCHE_FUJI_MORALIS_APP_ID="Moralis Avalanche Fuji App ID"
REACT_APP_AVALANCHE_FUJI_MORALIS_SERVER_URL="Moralis Avalanche Fuji url"

REACT_APP_PANGEA_MARKETPLACE_ADDR="Marketplace address"
REACT_APP_PANGEA_TOKEN_ADDR="Token Address"

REACT_APP_GMAP_API_KEY="Google map API key"
```

# 🔐 Authenticate
Click Authenticate to connect Metamask to the page `Authenticate`:
- Authentication will normally trigger automatically.
- Once connected, the user can assign a username or market place affiliation to the Marketplace by clicking:
  - Profile icon then `⚙️Settings`.
- Avatar, Company/Brand and email address are optional

![frontpage-authenticate](https://user-images.githubusercontent.com/58431844/151322574-46929389-066a-41c5-81c8-5fc390b192d1.png)

# 💰 Marketplace
The marketplace tab supports multiple market address contract per chain. In order to view Markets from another chain, hjust change the network from the chain dropdown box next to the profile tab. By default its set `Avalanche - Fuji` nework.

The market place supports two different view modes:
- `Cafe` :- Shows a menu like listings

![frontpage-market cafe](https://user-images.githubusercontent.com/58431844/151406325-1f46826b-bc77-48c0-8ea2-c600ac48c57f.png)

- `Honeycomb` :- Shows a honeycomb grid layout

![frontpage-market honeycomb](https://user-images.githubusercontent.com/58431844/151406346-a874f1d6-1ba2-4fb1-893c-538a818ebb5b.png)

- Items shown on the marketplace are globally published NFTs and further details can be viewed when clicking the `Buy` button.:
  
![frontpage-myaccounts geofence](https://user-images.githubusercontent.com/58431844/151406546-cf166da0-ce5f-4064-b82b-acb40ee86c1d.png)

# 🧰 Dashboard
This tab represents the core application of this dApp `Fleet Management`, `Navigation` and or `Logistics` services while the other aspects of "Tokenomics" are just a bonus of this project.

The Dashboard tab has 3 sub tabs:
- `Mint Factory`
  - This tab provide tools to create and publish NFTs to the marketplace
- `Order Request`
  - This tab allows non seller/guest to create orders to the available sellers on the marketplace. Sellers will then review and `Reject` or `Confirm` the request
- `Wallet`
  - An optional facility to provide simple token transfers from one account to another account...much like `Metamask`

## 🏭 `Mint Factory` or `Order Request`
- Both tabs are similar in its function accept for one. The Order Request tab doesnt mint the created orders/assets but merely request them from the requested parties/companies. Once the the mission orders were recieved, the party involve in vetting and approving the request will mint the orders with respect to the account owner of the orders. The approved order will be available in the owner's accounts tab under `My Accounts`->`Orders`.
### `Google Map` integration allows the user to create or request the afforementioned services or in this case missions. Theres 5 available presets for mission selections:-

  ![image](https://user-images.githubusercontent.com/58431844/151333802-5a49c99f-4ec3-4af2-af9c-ee1d800c8cbc.png)

### The map can be enlarge into a fullscreen for a larger visual estate.

![frontpage-dashboard map](https://user-images.githubusercontent.com/58431844/151407478-d30966ab-01c1-43c6-b9a6-df8e90b74a30.png)


# 📈 My Accounts
This tab represents every transactions status for the owner of the accounts. Transactions will have any of the status in [📃Transaction Status](#📃-transaction-status) depending on the type of transaction involves.
There are 4 sub tabs under `My Accounts`
- `Collections`  : Collections of assets belonging to the authenticated account
- `Listings`     : Assets or Orders created thats published to the `Pangea` Marketplace
- `Orders`       : Transactions of Orders thats published to the `Pangea` Marketplace
- `Transactions` : List of recorded transactions on the blockchain 

![frontpage-myaccounts status](https://user-images.githubusercontent.com/58431844/151407714-3b8b399a-4ee2-4115-bf09-188d880e43dd.png)

## 📃Transaction Status
- `Pending`     - Transactions thats pending approval
- `Waiting`     - Transactions thats awaiting purchase or respond from the requesting party
- `In Progress` - Transactions thats approved and are currently in progress where applicable. 
- `Completed`   - Transactions tht have been completed
- `Rejected`    - Rejected transactions will no longer be valid and will be nullified

![frontpage-myaccounts listings](https://user-images.githubusercontent.com/58431844/151407626-5569d596-b04a-418a-a651-9cfe8f38780c.png)
![frontpage-myaccounts orders](https://user-images.githubusercontent.com/58431844/151408591-df482c9a-6c40-40aa-b646-4380111402be.png)

***Note: Some instance of the transaction will only show applicable status. i.e. Transactions that are `In Progress` will apply to shipping tracking*** 

## 📖 Order Tracking
Logistical type orders like navigation, delivery, observation...etc can have a tracking protocol attached to the instance of the orders.
These orders will have the status `In Progress` untill either party confirms the delivery and promote the status to `Complete`
Below are the example of a drone tracking by updating Moralis DB in real time with the drones onboard geolocation device.

![frontpage-request-tracking](https://user-images.githubusercontent.com/58431844/151407973-21fdf393-7b3e-46bb-9edb-ee05fb1a5f1d.png)

***Note: The tracking is simulated to showcase the rendering potential of the tracking service. 

# 💲Transactions
The final shows the transactions recorded by the contract events of the marketplace. This tab shows commerce traffic of the marketplace.
Below are the possible status of the transactions:
- `Waiting`  - Assets thats awaiting buyers
- `Sold`     - Assets thats already sold
- `Buy`      - Assets thats can be purchase. 
- `N/A`      - Assets thats no longer available/listed on the market
- `Owned`    - Assets owned or purchased

![frontpage-transactions](https://user-images.githubusercontent.com/58431844/151408832-8447d876-2b8d-4aa4-b225-52089bab1388.png)

# ✔️ Added Feature

Through out the entire development of this dApp, the ability to synchronize contract events to Moralis DB made the entire experience seemless. But what made it even more interesting is that the ordering protocol of this dApp that requires interaction between the mission planner and the mission service provider. This allows for lazy minting ny default. Furthermore, we can reverse the lazy minting method and impose the minting responsibility to the service provider instead. This inherently allowing consumers to create a bulk order request.

Below are exaamples of how the `Cafe` layout mode shows the `Point Of Sales` dApp system using the same core engine of `Pangea` dApp. The only difference is in the layout and the  function below:

> NFTMarketPlace.jsx
```jsx
  function addingToCart(item){
    cart.push(item)
    priceList.push(item.priceEth)
    totalPrice = priceList.reduce((x,y) => x + parseFloat(y), 0)
    resetTotalPrice(totalPrice)

    notification.open({
      key,
      message: 'Adding to Cart',
      description: '🛒 ✚ Cart Count ' + cart.length,
      placement: 'topLeft'
    });

  };
```
### 🛒 Orders can be added to cart:
![frontpage-bulk](https://user-images.githubusercontent.com/58431844/151411722-3e47f21a-4092-40b8-b6c9-68ca05853e9c.png)

After receiving the request orders, the provider can `Reject` or `Confirm` the orders. Confirmed orders will be shown in teh users listings under `My Account` -> `Listings`
Once the orders have been accepted, the orders can be purchased. Once purchased, the orders will show in the listings of the user's account and will show the bulk of the orders purchased:

![frontpage-cafe-bulk-tokens](https://user-images.githubusercontent.com/58431844/151638764-9e5ad662-988c-4be9-9781-da974f655b58.png)

### 🌐 Checkout Pangea Demo through the link below

# ![Pangea](https://user-images.githubusercontent.com/58431844/151414248-f7425a28-db4a-427e-bedd-fc5fe505bd53.png)[Pangea - DEMO Link](https://hilmi27a.github.io/pangea-marketplace/)




