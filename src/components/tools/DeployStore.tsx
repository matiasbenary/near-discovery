import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Flex, Form, Input, openToast } from '@near-pagoda/ui';
import { useAuthStore } from '@/stores/auth';

type FormData = {
  store: string;
  symbol: string;
};

export const DeployStore: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const wallet = useAuthStore((store) => store.wallet);
  const accountId = useAuthStore((store) => store.accountId);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!wallet) throw new Error('Wallet has not initialized yet');
    try {
      const args = {
          owner_id: accountId,
          metadata: {
            "spec": "nft-1.0.0",
            "name": data.store,
            "symbol": data.symbol,
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEXUlEQVRYR8VXW4hVVRj+vrX3OYbFNBl2eSsoa8pkxMJmzpGGoIwMY0wwImuCXmKKkiikKayHQIpAwbdAswskBYqJSlANek7TUOPURGKCWdmFkJnsoZnhzNn/F2vcZ9gez2UfEVoP+2Gv///Xt771X4mUq6enpz2Kogck3S2pk+R1ki736iT/kfQzyW/N7PNsNrtvcHDwTBrTbCbU1dV1cxiGGyWtA3BJM/l4f1rSLjPbPDQ0dKyRTl0AS5YsubStre11AP0AwiYHi+SJmJGFCdmypG3T09MDIyMjk7Vs1ASQy+VuIrkbQEezG3vqJfXGTzHhnFtlZttIuoTuUQC9hULheLW98wDkcrnbARwkeWWzw+P9ewCsB/AYgBkz6yW5lmRfUl/SOMmVhUJhJPn/HAD+5gCKLRzubS0AMO59MTa828z2Oud2VF8gBtGdZGIOQPzmX6ehPWk4iqKOIAg+BnCr/y/pJUmnnHPv1WHw6NTU1B0Vn5gDkM/ntwB4NiXtc2KS9kdR1B+G4aMA/pD0kaQHGwDwILcUi8UNs37jPz7UgiD4PoW318Qn6QSA/STbJc2T9EkjAAB8dCwuFos/zgLI5/M7YydqlYBa8vvMbFcTAJ6FncVisY/5fP4KT10LSaYZyFQAAEyHYXitB+BD6N1mVlvYTwsAZraeuVxuR3XMNjpM0mFJW0n+VUfub0mnSS6S5JxznQBeBpDMkBXV7R7AKEkv1HRJGiLpvX0rgHYzGyB5S5yuZ/VJHioUCv25XO4Vn/0AHDCzD51z35DMViWnUf8EEwC8H6RZj5O8Py5M3pF+D4JghZn9lFDeB+AtAF9U/vmw9CBJ3lt1yIQHYIks1gzEapJPSlodJ53xcrncmclkTiUOOwRgM8n9iX8Pk/S+tqqKAWsZgJmddM6971kzs+f9W5P0VbOyZmZmZjyo5yStcc4djKJoE8kxkvNrAWjlCVZLugHAYefcpJmtIzkAIKii7ldJL5jZkTAMF0t6A8CNNeidaMkJAXjqNwLobvZWafYljbYahhcVAIDtrSaiiwpgNhGlSMVjAI5J8m3Xm3FILapD8UKSd9XwiVriZ1Ox36lXjCRtMLPPwjC8s1QqHRgeHv6tu7v7IefcNYkQG8tkMqPlcnmNrylm9q9z7lMAlzXyg7li5IXqlOOvADwN4EsAPoOdLpVKHdlsdm/SCUku8/UdwIo4NzxF8noALzYAcG45jlmobkjelnTc014xRPI+Sa8BWJ4w7lsyH8qVtUfSHpLv1ANwXkPiBWu0ZEeiKOoLgsAzMd+nXTNb7pz7geTsQBLfuIvkqwBWnu3I9ASAZSSfqQOgdkvmhaubUpKboij6IAiCpSSH/aAB4JEqw9+VSqXeTCZzm6Q/nXNXA/A94rxqAA2b0opwjbb8JADfzy8FcFWdW01K8kwtqFdZU7XlCRCpB5M0GQ9A+sGkYrDF0awejgsbzZLW/rfhtPpKTcbzM5J+uZDx/D8+0FUx/4DhyAAAAABJRU5ErkJggg==",
            "base_uri": "https://arweave.net",
            "reference": null,
            "reference_hash": null
          },
      };
      // near call mg.tkn.near storage_deposit '{"account_id": "maguila.near"}' --depositYocto 1250000000000000000000 --accountId maguila.near
      // near call mg.tkn.near ft_transfer '{"receiver_id": "maguila.near", "amount": "1000"}' --depositYocto 1 --accountId maguila.near
      // near view  mg.tkn.near ft_balance_of '{"account_id": "maguila.near"}' --networkId mainnet
      // --networkId mainnet
    const result = await wallet.signAndSendTransaction({
      receiverId: "mintspace2.testnet",
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'create_store',
            args,
            gas: "300000000000000",
            deposit: "3700000000000000000000000"
          },
        },
      ],
    });

    if (result) {
      const transactionId = result.transaction_outcome.id;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      window.open(`https://testnet.nearblocks.io/txns/${transactionId}`, '_blank')!.focus();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      window.open(`https://testnet.nearblocks.io/address/${data.owner_id}`, '_blank')!.focus();
    }

      openToast({
        type: 'success',
        title: 'Token Created',
        description: `Token ${data.name} (${data.symbol}) created successfully`,
        duration: 5000,
      });
    } catch (error) {
      openToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to create token',
        duration: 5000,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Flex stack gap="l">
        <Input
          label="Store Name"
          placeholder="e.g., myfirststore"
          error={errors.store?.message}
          {...register('store', { required: 'Store Name is required'})}
        />
        <Input
          label="Symbol"
          placeholder="e.g., MFS"
          error={errors.symbol?.message}
          {...register('symbol', { required: 'Symbol is required' })}
        />
        <Button 
          label="Deploy" 
          variant="affirmative" 
          type="submit" 
          loading={isSubmitting} 
        />
      </Flex>
    </Form>
  );
};