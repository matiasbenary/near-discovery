import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { networkId } from '@/utils/config';
import { connect, transactions } from 'near-api-js';
import { Action } from 'near-api-js/lib/transaction';
import { Button, Table, Text } from '@near-pagoda/ui';

const TextStyled = styled(Text)`
  margin-bottom: 12px;
`;


const AccessKeyCard = () => {
  const near = useVmStore((store) => store.near);
  const accountId = useAuthStore((store) => store.accountId);
  const [keys, setKeys] = useState([]);
  const wallet = useAuthStore((store) => store.wallet);

  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    if (!near || !accountId) return;
    const getInfo = async () => {
      const { nearConnection } = near;
      const account = await nearConnection.account(accountId);
      let accessKeys = await account.getAccessKeys();
      setKeys(accessKeys.filter((accessKey) => accessKey.access_key.permission !== 'FullAccess'));
    };
    getInfo();
  }, [near, accountId]);

  const truncatePublicKey = (key) => `${key.slice(0, 20)}...${key.slice(-20)}`;

  const handleSelectAll = () => {
    if (selectedKeys.length === keys.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(keys.map((key) => key.public_key));
    }
  };

  const handleSelect = (id) => {
    setSelectedKeys((prev) => (prev.includes(id) ? prev.filter((keyId) => keyId !== id) : [...prev, id]));
  };

  const handleDeauthorizeAll = async () => {
    if (!accountId || !wallet) return;
    // const actions = selectedKeys.map(key => transactions.deleteKey(key));
    const actions: Action[] = selectedKeys.map((publicKey) => ({
      type: 'DeleteKey',
      params: {
        publicKey: publicKey,
      },
    }));

    wallet.signAndSendTransaction({ receiverId: accountId, actions });
  };

  return (
    <>
      <TextStyled size="text-2xl">Authorized Apps</TextStyled>
      <Button label="Deauthorize" onClick={handleDeauthorizeAll} style={{ margin: '0 12px 12px 0' }} />
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>
              <input type="checkbox" onChange={handleSelectAll} checked={selectedKeys.length === keys.length} />
            </Table.HeaderCell>
            <Table.HeaderCell>Receiver ID</Table.HeaderCell>
            <Table.HeaderCell>Keys</Table.HeaderCell>
            <Table.HeaderCell>Fee Allowance</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {keys.map((data) => (
            <Table.Row key={data.public_key}>
              <Table.Cell>
                <input
                  type="checkbox"
                  onChange={() => handleSelect(data.public_key)}
                  checked={selectedKeys.includes(data.public_key)}
                />
              </Table.Cell>
              <Table.Cell>{data.access_key.permission.FunctionCall?.receiver_id ?? 'Hola'}</Table.Cell>
              <Table.Cell>{truncatePublicKey(data.public_key)}</Table.Cell>
              <Table.Cell>{parseFloat(data.access_key.permission.FunctionCall?.allowance ?? 0) / 1e24} NEAR</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default AccessKeyCard;
