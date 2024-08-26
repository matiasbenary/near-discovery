import { Accordion, Text } from "@near-pagoda/ui";
import { DeployStore } from "./DeployStore";
import MintNft from "./MintNft";

const NonFungibletoken = () => {
    return (<Accordion.Root type="multiple">
    <Accordion.Item value="one">
      <Accordion.Trigger>Deploy NFT Contract</Accordion.Trigger>
  
      <Accordion.Content>
        <DeployStore/>
      </Accordion.Content>
    </Accordion.Item>
  
    <Accordion.Item value="two">
      <Accordion.Trigger>Mint NFT</Accordion.Trigger>
  
      <Accordion.Content>
        <MintNft/>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>)
}

export default NonFungibletoken;