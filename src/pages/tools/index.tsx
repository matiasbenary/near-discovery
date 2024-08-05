import { useDefaultLayout } from '@/hooks/useLayout';
import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import type { NextPageWithLayout } from '@/utils/types';
import styled from 'styled-components';
import { network } from '@/utils/config';
import { useEffect, useState } from 'react';
import AccessKeyCard from './AccessKeyCard';

const SearchContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ToolsPage: NextPageWithLayout = () => {
  const near = useVmStore((store) => store.near);
  const accountId = useAuthStore((store) => store.accountId);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (!near && accountId) return;
    const getInfo = async () => {
      const { nearConnection } = near;
      const account = await nearConnection.account(accountId);
      setKeys(await account.getAccessKeys());
    };

    getInfo();
  }, [near]);

  console.log(keys);

  return (
    <SearchContainer>
      {keys.map((data, index) => (
        <AccessKeyCard key={index} data={data} />
      ))}
    </SearchContainer>
  );
};

ToolsPage.getLayout = useDefaultLayout;

export default ToolsPage;
