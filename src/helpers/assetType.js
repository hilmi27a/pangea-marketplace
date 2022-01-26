import comm from "../../src/img/tokens/drone-comm.png"
import nav from "../../src/img/tokens/drone-nav.png"
import delivery from "../../src/img/tokens/drone-delivery.png"
import recon from "../../src/img/tokens/drone-recon.png"
import dispatch from "../../src/img/tokens/drone-dispatch.png"

export const assetType = {
    "Pangea": [
      //Add Your Collections here
      {
        image: comm,
        name: "Communication",
      },
      {
        image: recon,
        name: "Observation",
      },
      {
        image: delivery,
        name: "Courier",
      },
      {
        image: nav,
        name: "Navigation",
      },
      {
        image: dispatch,
        name: "Emergency",
      },
    ],

  };
  
  export const getAssetType = (company) => assetType[company];