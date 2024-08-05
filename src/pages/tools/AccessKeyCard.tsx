import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const DeauthorizeButton = styled.button`
  background-color: #f1f3f5;
  color: #ff4d4f;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const PublicKey = styled.div`
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  word-break: break-all;
  margin-bottom: 16px;
`;

const FeeAllowance = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 16px;
  color: #6c757d;
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const AccessKeyCard = ({ data }) => {
  const truncatePublicKey = (key) => `${key.slice(0, 20)}...${key.slice(-20)}`;

  return (
    <Card>
      <Header>
        <Title>{data.access_key.permission.FunctionCall?.receiver_id ?? 'Hola'}</Title>
        <DeauthorizeButton>Deauthorize</DeauthorizeButton>
      </Header>
      <PublicKey>{truncatePublicKey(data.public_key)}</PublicKey>
      <FeeAllowance>
        <Label>Fee Allowance</Label>
        <Value>{parseFloat(data.access_key.permission.FunctionCall?.allowance ?? 0) / 1e24} NEAR</Value>
      </FeeAllowance>
    </Card>
  );
};

export default AccessKeyCard;
