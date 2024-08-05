import { useCallback } from 'react';

import { useBosComponents } from '@/hooks/useBosComponents';
import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';

import { UserDropdownMenu } from '../marketing-navigation/UserDropdownMenu';
import { VmComponent } from '../vm/VmComponent';
import * as S from './styles';

export const LargeScreenProfileDropdown = () => {
  const components = useBosComponents();
  UserDropdownMenu;
  const near = useVmStore((store) => store.near);
  const availableStorage = useAuthStore((store) => store.availableStorage);
  const availableStorageDisplay = availableStorage?.gte(10) ? availableStorage.div(1000).toFixed(2) : '0';
  const logOut = useAuthStore((store) => store.logOut);

  const withdrawTokens = useCallback(async () => {
    if (!near) return;
    await near.contract.storage_withdraw({}, undefined, '1');
  }, [near]);

  return (
    <S.LargeScreenHeaderActionWrapper $width="100%" $justifyContent="start">
      <VmComponent
        src={components.navigation.profileDropdown}
        props={{
          availableStorage: availableStorageDisplay,
          withdrawTokens,
          logOut,
        }}
      />
    </S.LargeScreenHeaderActionWrapper>
  );
};
