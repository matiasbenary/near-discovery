import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Flex, Form, Input, openToast } from '@near-pagoda/ui';
import { useAuthStore } from '@/stores/auth';

type FormData = {
  owner_id: string;
  total_supply: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
};

export const CreateTokenForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const wallet = useAuthStore((store) => store.wallet);
  const accountId = useAuthStore((store) => store.accountId);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!wallet) throw new Error('Wallet has not initialized yet');
    try {
      const args = {
        args: {
          owner_id: data.owner_id,
          total_supply: data.total_supply,
          metadata: {
            spec: "ft-1.0.0",
            name: data.name,
            symbol: data.symbol,
            icon: data.icon,
            decimals: data.decimals,
          },
        },
        account_id: data.owner_id,
      };
      // near call mg.tkn.near storage_deposit '{"account_id": "maguila.near"}' --depositYocto 1250000000000000000000 --accountId maguila.near
      // near call mg.tkn.near ft_transfer '{"receiver_id": "maguila.near", "amount": "1000"}' --depositYocto 1 --accountId maguila.near
      // near view  mg.tkn.near ft_balance_of '{"account_id": "maguila.near"}' --networkId mainnet
      // --networkId mainnet
    const result = await wallet.signAndSendTransaction({
      receiverId: "tkn.near",
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'create_token',
            args,
            gas: "300000000000000",
            deposit: "2234830000000000000000000"
          },
        },
      ],
    });

    if (result) {
      const transactionId = result.transaction_outcome.id;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      window.open(`https://nearblocks.io/txns/${transactionId}`, '_blank')!.focus();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      window.open(`https://nearblocks.io/address/${data.owner_id}`, '_blank')!.focus();
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
          label="Owner ID"
          placeholder="e.g., bob.near"
          error={errors.owner_id?.message}
          {...register('owner_id', { required: 'Owner ID is required', value: accountId })}
        />
        <Input
          label="Total Supply"
          placeholder="e.g., 1000000000"
          error={errors.total_supply?.message}
          {...register('total_supply', { required: 'Total supply is required' })}
        />
        <Input
          label="Token Name"
          placeholder="e.g., Test Token"
          error={errors.name?.message}
          {...register('name', { required: 'Token name is required' })}
        />
        <Input
          label="Token Symbol"
          placeholder="e.g., TEST"
          error={errors.symbol?.message}
          {...register('symbol', {})}
        />
        <Input
          label="Icon (Base64)"
          placeholder="data:image/gif;base64,..."
          error={errors.icon?.message}
          {...register('icon', { required: 'Icon is required' })}
        />
        <Input
          label="Decimals"
          type="number"
          placeholder="e.g., 18"
          error={errors.decimals?.message}
          {...register('decimals', { 
            required: 'Decimals is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Decimals must be non-negative' },
            max: { value: 24, message: 'Decimals must be 24 or less' }
          })}
        />
        <Button 
          label="Create Token" 
          variant="affirmative" 
          type="submit" 
          loading={isSubmitting} 
        />
      </Flex>
    </Form>
  );
};