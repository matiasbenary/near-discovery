// https://dev.near.org/contractwizard.near/widget/ContractWizardUI
// curl https://api.fastnear.com/v1/account/here.tg/ft
// https://github.com/fastnear/fastnear-api-server-rs?tab=readme-ov-file#api-v1

import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import { Button, Flex, Input, Text, handleClientError, openToast } from '@near-pagoda/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import type { SubmitHandler } from 'react-hook-form';
import { Form } from 'react-bootstrap';

const FungibleToken = () => {
  const near = useVmStore((store) => store.near);
  const accountId = useAuthStore((store) => store.accountId);
  const wallet = useAuthStore((store) => store.wallet);
  console.log('wallet', wallet);

  const form = useForm<FormData>();

  const validSubmitHandler: SubmitHandler<FormData> = async (data) => {
    try {
      if (!wallet) throw new Error('Wallet has not initialized yet');

      form.reset();

      // const args = {
      //     args: {
      //     owner_id: "bob.near",
      //     total_supply: "1000000000",
      //     metadata: {
      //         spec: "ft-1.0.0",
      //         name: "Test Token",
      //         symbol: "test",
      //         icon: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      //         decimals: 18,
      //     },
      //     },
      //     account_id: "bob.near",
      // };

      // const outcome = await wallet.signAndSendTransaction({
      //   receiverId: "tkn.near",
      //   actions: [
      //     {
      //       type: 'FunctionCall',
      //       params: {
      //         methodName: 'create_token',
      //         args,
      //         gas: "300000000000000",
      //         deposit: "2234830000000000000000000"
      //       },
      //     },
      //   ],
      // });
      // const result = await wallet.callMethod({
      //   method: 'create_token',
      //   args,
      //   contractId: "tkn.near",
      //   gas: 300000000000000,
      //   deposit: "2234830000000000000000000"
      //   });
      const result = true;

      openToast({
        type: 'success',
        title: 'Transaction Success',
        description: `pepe`,
        duration: Infinity,
        actionText: 'View Transaction',
        action: () => {
          /*
                NOTE: When sending a transaction while signed in with a FastAuth account, 
                the request will succeed, however the result object is undefined.
              */

          if (result) {
            const transactionId = 123;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            window.open(`https://nearblocks.io/txns/${transactionId}`, '_blank')!.focus();
          } else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            window.open(`https://nearblocks.io/address/${123}`, '_blank')!.focus();
          }
        },
      });
    } catch (error) {
      handleClientError({ error, title: 'Transaction Failed' });
    }
  };

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
