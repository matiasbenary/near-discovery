import { Accordion, Text } from "@near-pagoda/ui";

import { DeployStore } from "./DeployStore";
import MintNft from "./MintNft";

const NonFungibletoken = ({storesMintbase,reloadStoresMintbase}) => {
    const stores = [{name:"nft.primitives.near",origin:"reference"},...storesMintbase.map(store => ({name:store.nft_contract_id,origin:"mintbase"}))]
    return (<Accordion.Root type="multiple" defaultValue="two">
    <Accordion.Item value="one">
      <Accordion.Trigger>Deploy NFT Contract</Accordion.Trigger>
  
      <Accordion.Content>
        <DeployStore reloadStoresMintbase={reloadStoresMintbase}/>
      </Accordion.Content>
    </Accordion.Item>
  
    <Accordion.Item value="two">
      <Accordion.Trigger>Mint NFT</Accordion.Trigger>
  
      <Accordion.Content>
        <MintNft stores={stores}/>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>)
}

export default NonFungibletoken;