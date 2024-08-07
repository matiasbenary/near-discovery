import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { networkId } from '@/utils/config';
import { connect, transactions } from 'near-api-js';
import { Action } from 'near-api-js/lib/transaction';

const Panel = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const AccessKeyCard = () => {
  const near = useVmStore((store) => store.near);
  const accountId = useAuthStore((store) => store.accountId);
  const [keys, setKeys] = useState([]);
  const wallet = useAuthStore((store) => store.wallet);

  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    if (!near || !accountId ) return;
    const getInfo = async () => {
      const { nearConnection } = near;
      const account = await nearConnection.account(accountId);
      let accessKeys = await account.getAccessKeys();
      setKeys(accessKeys.filter(accessKey => accessKey.access_key.permission !== 'FullAccess'));
    };
    getInfo();
  }, [near,accountId]);

  const truncatePublicKey = (key) => `${key.slice(0, 20)}...${key.slice(-20)}`;

  const handleSelectAll = () => {
    console.log("pepe count",keys.length);
    if (selectedKeys.length === keys.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(keys.map(key => key.public_key));
    }
  };

  const handleSelect = (id) => {
    setSelectedKeys((prev) => 
      prev.includes(id) ? prev.filter((keyId) => keyId !== id) : [...prev, id]
    );
  };

  const handleDeauthorizeAll = async() => {
    if (!accountId || !wallet) return;
    // console.log("pepe 1");
    
    // const actions = selectedKeys.map(key => transactions.deleteKey(key));
    // console.log("pepe 2");
    // const { nearConnection } = near;
    // const account = await nearConnection.account(accountId);
    // console.log("pepe 3");
    // await wallet.signAndSendTransaction({receiverId:accountId, actions:actions});
    // console.log("pepe 4",accountId, actions,selectedKeys);
    // const { nearConnection } = near;
    const actions: Action[] = selectedKeys.map((publicKey) => ({
      type: 'DeleteKey',
      params: {
        publicKey: publicKey,
      },
    }));
    
    wallet.signAndSendTransaction({receiverId:accountId, actions});
  };

  return (
    <div>
      <Panel>
        <Button onClick={handleDeauthorizeAll}>Deauthorize selected {selectedKeys.length} - {keys.length}</Button>
      </Panel>
      <Table>
        <thead>
          <tr>
            <Th>
              <input type="checkbox" onChange={handleSelectAll} checked={selectedKeys.length === keys.length} />
            </Th>
            <Th>Receiver ID</Th>
            <Th>Keys</Th>
            <Th>Fee Allowance</Th>
          </tr>
        </thead>
        <tbody>
          {keys.map((data) => (
            <tr key={data.public_key}>
              <Td>
                <input
                  type="checkbox"
                  onChange={() => handleSelect(data.public_key)}
                  checked={selectedKeys.includes(data.public_key)}
                />
              </Td>
              <Td>{data.access_key.permission.FunctionCall?.receiver_id ?? 'Hola'}</Td>
              <Td>{truncatePublicKey(data.public_key)}</Td>
              <Td>{parseFloat(data.access_key.permission.FunctionCall?.allowance ?? 0) / 1e24} NEAR</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AccessKeyCard;
