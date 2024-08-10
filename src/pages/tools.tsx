import { useDefaultLayout } from '@/hooks/useLayout';
import type { NextPageWithLayout } from '@/utils/types';
import { useRouter } from 'next/router';

import { Button, Card, Container, Flex, Grid, Section, SvgIcon, Tabs, Text } from '@near-pagoda/ui';
import { Coin, Gift, ImageSquare, ImagesSquare, Key } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth';
import { useSignInRedirect } from '@/hooks/useSignInRedirect';
import FungibleToken from '@/components/tools/FungibleToken';

const ToolsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const selectedTab = (router.query.tab as string) || 'ft';
  const signedIn = useAuthStore((store) => store.signedIn);
  const { requestAuthentication } = useSignInRedirect();
  return (
    <Section grow="available" style={{ background: 'var(--sand3)' }}>
      <Container size="s">
        <Flex stack gap="l">
          <Text as="h1" size="text-2xl">
            Tools
          </Text>

          {signedIn ? (
            <Card style={{ paddingTop: 0 }}>
              <Tabs.Root value={selectedTab}>
                <Tabs.List style={{ marginBottom: 'var(--gap-m)' }}>
                  <Tabs.Trigger href="?tab=ft" value="ft">
                    <SvgIcon icon={<Coin fill="bold" />} />
                    FT
                  </Tabs.Trigger>

                  <Tabs.Trigger href="?tab=nft" value="nft" disabled>
                    <SvgIcon icon={<ImagesSquare fill="bold" />} />
                    NFT
                  </Tabs.Trigger>

                  <Tabs.Trigger href="?tab=export" value="export" disabled>
                    <SvgIcon icon={<Gift fill="bold" />} />
                    Airdops
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="ft">
                  <FungibleToken/>
                </Tabs.Content>

                <Tabs.Content value="receive"></Tabs.Content>

                <Tabs.Content value="export"></Tabs.Content>
              </Tabs.Root>
            </Card>
          ) : (
            <Card>
              <Text>Please sign in to use wallet utilities.</Text>
              <Button label="Sign In" fill="outline" onClick={() => requestAuthentication()} />
            </Card>
          )}
        </Flex>
      </Container>
    </Section>
  );
};

ToolsPage.getLayout = useDefaultLayout;

export default ToolsPage;
