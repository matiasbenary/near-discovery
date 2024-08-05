import { useRouter } from 'next/router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useBosComponents } from '@/hooks/useBosComponents';
import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import { NftImage } from '../lib/NFTImage';

const Wrapper = styled.div`
  > button {
    all: unset;
    display: flex;
    align-items: center;
    border-radius: 50px;
    transition: all 200ms;
  }

  img {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }

  .profile-info {
    margin: 0 8px;
    line-height: normal;
    max-width: 110px;
    font-size: 14px;

    .profile-username {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .DropdownMenuContent {
    background-color: white;
    border-radius: 6px;
    margin-top: 11px;
    padding: 8px;
    box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
    animation-duration: 600ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
    z-index: 10000000;
    min-width: 220px;
  }

  .DropdownMenuContent[data-side='top'] {
    animation-name: slideDownAndFade;
  }
  .DropdownMenuContent[data-side='right'] {
    animation-name: slideLeftAndFade;
  }
  .DropdownMenuContent[data-side='bottom'] {
    animation-name: slideUpAndFade;
  }
  .DropdownMenuContent[data-side='left'] {
    animation-name: slideRightAndFade;
  }

  .DropdownMenuItem {
    all: unset;
    font-size: 14px;
    line-height: 1;
    color: black;
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    position: relative;
    user-select: none;
    outline: none;
    i {
      color: #9ba1a6;
    }
  }

  .DropdownMenuItem:hover {
    cursor: pointer;
    background-color: var(--sand3);
    color: var(--sand12);
    i {
      color: var(--violet10);
    }
  }

  .DropdownMenuItem i {
    font-size: 20px;
    margin-right: 10px;
  }

  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideRightAndFade {
    from {
      opacity: 0;
      transform: translateX(-2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideLeftAndFade {
    from {
      opacity: 0;
      transform: translateX(2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 800px) {
    .profile-info,
    .ph {
      display: none;
    }

    > button {
      background: var(--sand6);
      padding: 1px;
    }

    img {
      width: 40px;
      height: 40px;
    }
  }
`;

type Props = {
  showUsername?: boolean;
};

export const UserDropdownMenu = ({ showUsername }: Props) => {
  const accountId = useAuthStore((store) => store.accountId);
  const availableStorage = useAuthStore((store) => store.availableStorage);
  const logOut = useAuthStore((store) => store.logOut);
  const near = useVmStore((store) => store.near);
  const router = useRouter();
  const components = useBosComponents();

  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    async function getProfile() {
      const profile = await near.viewCall('social.near', 'get', { keys: [`${accountId}/profile/**`] });
      console.log(profile[accountId].profile);
      setProfile(profile[accountId].profile);
    }

    if (!near || !accountId) return;

    getProfile();
  }, [near, accountId]);

  const withdrawStorage = useCallback(async () => {
    if (!near) return;
    await near.contract.storage_withdraw({}, undefined, '1');
  }, [near]);

  return (
    <Wrapper>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <NftImage {...profile.image} alt={profile.name || accountId} />
          {showUsername && (
            <div className="profile-info">
              <div className="profile-username">{profile.name || accountId}</div>
            </div>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={10}>
          <DropdownMenu.Item
            className="DropdownMenuItem"
            onClick={() => router.push(`/${components.profilePage}?accountId=${accountId}`)}
          >
            <i className="ph-duotone ph-user"></i>
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => router.push(`/settings`)}>
            <i className="ph ph-gear"></i>
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => withdrawStorage()}>
            <i className="ph-duotone ph-bank"></i>
            {availableStorage && `Withdraw ${availableStorage.div(1000).toFixed(2)}kb`}
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => logOut()}>
            <i className="ph-duotone ph-sign-out"></i>
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Wrapper>
  );
};
