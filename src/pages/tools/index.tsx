import { useDefaultLayout } from '@/hooks/useLayout';
import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import type { NextPageWithLayout } from '@/utils/types';
import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import AccessKeyTable from './AccessKeyTable';
import { Card, Container, Grid, Section, SvgIcon, Text } from '@near-pagoda/ui';
import { Coin, Gift, ImageSquare, Key } from '@phosphor-icons/react';
import FungibleToken from './FungibleToken';

// const Container = styled.div`
//   font-family: Arial, sans-serif;
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 20px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   flex-grow: 1;

//   @media (max-width: 768px) {
//     padding: 10px;
//   }
// `;

const CardSelection = styled(Card)<{ disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 10px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        opacity: 0.5;
      }
    `}

  ${(props) =>
    !props.disabled &&
    css`
      cursor: pointer;

      &:hover {
        cursor: pointer;
        background-color: #f9f9f9;
      }
    `}
`;

const Content = styled.div`
  margin-top: 20px;
  /* width: 100%; */
`

const ToolsPageContent = ({ activeTab }:{activeTab:string}) => {
  const foundComponent = componentsMap.find((item) => item.key === activeTab);
  return foundComponent ? foundComponent.component : null;
};

const componentsMap = [
  { key: 'keys', component: <AccessKeyTable /> },
  { key: 'ft', component: <FungibleToken /> },
];


const ToolsPage: NextPageWithLayout = () => {
  const [activeTab, setActiveTab] = useState('keys');

  const activeTabFunction = (tab:string) => () => setActiveTab(tab);
  return (
    
    <Section grow="available" style={{ background: 'var(--sand3)' }}>
      <Container size="m">
      <Grid columns="1fr 1fr 1fr 1fr" columnsTablet="1fr 1fr" columnsPhone="1fr">
        <CardSelection disabled={false} onClick={activeTabFunction('keys')}>
          <SvgIcon icon={<Key weight="duotone" />} size="l" color={activeTab == "keys"?'black':"violet8"} />
          <Text>Keys</Text>
        </CardSelection>
        <CardSelection disabled={false} onClick={activeTabFunction('ft')}>
          <SvgIcon icon={<Coin weight="duotone" />} size="l" color={activeTab == "ft"?'black':"violet8"}/>
          <Text>FT</Text>
        </CardSelection>
        <CardSelection disabled={true} onClick={activeTabFunction('nft')}>
          <SvgIcon icon={<ImageSquare weight="duotone" />} size="l" />
          <Text>NFT</Text>
        </CardSelection>
        <CardSelection disabled={true} onClick={activeTabFunction('airdrops')}>
          <SvgIcon icon={<Gift weight="duotone" />} size="l" />
          <Text>Airdops</Text>
        </CardSelection>
      </Grid>
      <Content>
        <ToolsPageContent activeTab={activeTab} />
      </Content>
      </Container>
    </Section>
  );
};

ToolsPage.getLayout = useDefaultLayout;

export default ToolsPage;
