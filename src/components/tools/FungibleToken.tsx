// https://dev.near.org/contractwizard.near/widget/ContractWizardUI
// curl https://api.fastnear.com/v1/account/here.tg/ft
// https://github.com/fastnear/fastnear-api-server-rs?tab=readme-ov-file#api-v1
// near call tkn.near create_token '{"args":{"owner_id": "maguila.near","total_supply": "1000000000","metadata":{"spec": "ft-1.0.0","name": "Test Token","symbol": "TTTEST","icon": "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7","decimals": 18}},"account_id": "maguila.near"}' --gas 300000000000000 --depositYocto 2234830000000000000000000 --accountId maguila.near --networkId mainnet
// https://docs.near.org/build/primitives/ft

import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import { Card, Flex, SvgIcon, Switch, Text, Tooltip } from '@near-pagoda/ui';
import { useEffect, useState } from 'react';
import whiteList from '@/utils/white-list.json';

import { CheckFat, ListNumbers,PlusCircle } from '@phosphor-icons/react';
import { providers } from 'near-api-js';
import { CreateTokenForm } from './CreateTokenForm';

const formattedBalance = (balance: string, decimals: number = 24) => {
  const numericBalance = Number(balance);
  if (isNaN(numericBalance) || isNaN(decimals)) {
    return '0';
  }
  const result = numericBalance / Math.pow(10, decimals);
  return result % 1 === 0 ? result.toString() : result.toFixed(5).replace(/\.?0+$/, '');
};

const callView = async (account_id, method_name) => {
  const url = `https://rpc.mainnet.near.org`;
  const provider = new providers.JsonRpcProvider({ url });

  let res = await provider.query({
    request_type: 'call_function',
    account_id,
    method_name,
    args_base64: Buffer.from(JSON.stringify({})).toString('base64'),
    finality: 'optimistic',
  });
  return JSON.parse(Buffer.from(res.result).toString());
};

export const fetching = async (accountId: string) => {
  const response = await fetch(`https://api.fastnear.com/v1/account/${accountId}/ft`);
  return await response.json();
};

const FungibleToken = () => {
  const near = useVmStore((store) => store.near);
  const accountId = useAuthStore((store) => store.accountId);
  const wallet = useAuthStore((store) => store.wallet);
  const [tokens, setTokens] = useState([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (!near || !accountId) return;

    const getInfo = async () => {
      const res = await fetching(accountId);
      const tokensWithMetadata = await Promise.all(
        res.tokens
          .filter((token) => token.balance !== '0')
          .map(async (token) => {
            const tokenVerified = whiteList.find((item) => item.token_name === token.contract_id);
            if (!tokenVerified) {
              const metadata = await callView(token.contract_id, 'ft_metadata');
              return {
                ...metadata,
                balance: token.balance,
                verified: false,
              };
            }
            return {
              ...tokenVerified,
              balance: token.balance,
              verified: true,
            };
          }),
      );
      setTokens(tokensWithMetadata);
      // setTokens(whiteList);

    };

    getInfo();
  }, [near, accountId]);
  console.log(toggle);
  
  return (
    <div>
      
      <Switch onClick={()=>setToggle(!toggle)} iconOn={<PlusCircle weight="bold" />} iconOff={<ListNumbers weight="bold" />} />
      {toggle && <CreateTokenForm/>}
      {!toggle && tokens.map((token, index) => (
        <Card key={index} style={{ marginBottom: '8px' }}>
          <Flex align="center" justify="space-between">
            <Flex align="center" style={{flex:"1"}} >
              <Text>{token.icon && <img width={25} height={25} alt={token.symbol} src={token.icon} />}</Text>
            </Flex>
            <Text style={{flex:"1"}} size="text-l">{formattedBalance(token.balance, token.decimals)}</Text>

            <Flex justify="end" align='center' style={{flex:"1"}}>
              <Text>{token.symbol}</Text>
              {/* {token.verified && ( */}
              <Tooltip content="It is verified">
                <SvgIcon icon={<CheckFat /> /*<SealCheck />*/} size="m" color="violet8" />
              </Tooltip>
              {/* )} */}
            </Flex>
          </Flex>
        </Card>
      ))}
    </div>
  );
};
export default FungibleToken;
