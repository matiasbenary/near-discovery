// https://dev.near.org/contractwizard.near/widget/ContractWizardUI
// curl https://api.fastnear.com/v1/account/here.tg/ft
// https://github.com/fastnear/fastnear-api-server-rs?tab=readme-ov-file#api-v1

import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import { Button, Flex, Input, Text, handleClientError, openToast } from '@near-pagoda/ui';

import { Form } from 'react-bootstrap';

const FungibleToken = () => {
  const near = useVmStore((store) => store.near);
  const accountId = useAuthStore((store) => store.accountId);
  const wallet = useAuthStore((store) => store.wallet);

  return (
    <Form onSubmit={form.handleSubmit(validSubmitHandler)}>
      <Flex stack gap="l">
        <Input label="Name" placeholder="MyToken" name="name" />
        <Input label="Symbol" placeholder="Near" name="symbol" />
        <Input label="Icon" name="icon" />
        <Input
          label="Decimals"
          number={{
            allowNegative: false,
            allowDecimal: false,
          }}
          name="decimals"
        />
        <Input
          label="Total Supply"
          placeholder="100000000000000"
          number={{
            allowNegative: false,
            allowDecimal: false,
          }}
          name="total_supply"
        />

        <Input label="Owner Account ID" placeholder="bob.near" name="owner_id" />

        <Button label="Continue" variant="affirmative" type="submit" loading={form.formState.isSubmitting} />
      </Flex>
    </Form>
  );
};

export default FungibleToken;
