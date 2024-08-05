import { useDefaultLayout } from '@/hooks/useLayout';
import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import type { NextPageWithLayout } from '@/utils/types';
import styled,{ css } from 'styled-components';
import { useEffect, useState } from 'react';
import AccessKeyTable from './AccessKeyTable';

const SearchContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 800px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Card = styled.div<{disabled:boolean}>`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(25% - 20px);
  transition: opacity 0.3s ease;
  
  @media (max-width: 768px) {
    width: 100%;
    margin: 10px 0;
  }

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      opacity: 0.5;
    }
  `}

  ${props => !props.disabled && css`
    cursor: pointer;
    
    &:hover {
      cursor: pointer;
      background-color: #f9f9f9;
    }
  `}
`;

const CardHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardIcon = styled.div`
  font-size: 24px;
`;

const ToolsPage: NextPageWithLayout = () => {
  const near = useVmStore((store) => store.near);
  const accountId = useAuthStore((store) => store.accountId);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (!near && !accountId) return;
    const getInfo = async () => {
      const { nearConnection } = near;
      const account = await nearConnection.account(accountId);
      setKeys(await account.getAccessKeys());
    };

    getInfo();
  }, [near]);

  return (
    <SearchContainer>
      <CardContainer>
        <Card disabled={false}>
          <CardHeader>Keys</CardHeader>
          <CardIcon><i className="ph ph-key"></i></CardIcon>
        </Card>
        <Card disabled={true}>
          <CardHeader>FT</CardHeader>
          <CardIcon><i className="ph ph-coins"></i></CardIcon>
        </Card>
        <Card disabled={true}>
          <CardHeader>NFT</CardHeader>
          <CardIcon><i className="ph ph-image-square"></i></CardIcon>
        </Card>
        <Card disabled={true}>
          <CardHeader>Airdops</CardHeader>
          <CardIcon><i className="ph ph-gift"></i></CardIcon>
        </Card>
      </CardContainer>
      {keys.map((data, index) => (
        <AccessKeyTable key={index} data={data} />
      ))}
    </SearchContainer>
  );
};

ToolsPage.getLayout = useDefaultLayout;

export default ToolsPage;
