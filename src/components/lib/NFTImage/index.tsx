import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useVmStore } from '@/stores/vm';

interface Nft {
  contractId: string;
  tokenId: string;
}

interface NftImageProps {
  nft: Nft;
  ipfs_cid?: string;
  alt: string;
}

interface NftMetadata {
  base_uri?: string;
}

interface TokenMetadata {
  media?: string;
}

export const NftImage: React.FC<NftImageProps> = ({ nft, ipfs_cid, alt }) => {
  const near = useVmStore((store) => store.near);
  const [imageUrl, setImageUrl] = useState<string>('bafkreidoxgv2w7kmzurdnmflegkthgzaclgwpiccgztpkfdkfzb4265zuu');
  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null);

  useEffect(() => {
    if (!near || !nft || !nft.contractId || !nft.tokenId || ipfs_cid) return;

    near.viewCall(nft.contractId, 'nft_metadata').then((metadata: NftMetadata) => {
      setNftMetadata(metadata);
    });
    near.viewCall(nft.contractId, 'nft_token', { token_id: nft.tokenId }).then((res: { metadata: TokenMetadata }) => {
      setTokenMetadata(res.metadata);
    });
  }, [near, nft, ipfs_cid]);

  useEffect(() => {
    if (!ipfs_cid) return;
    setImageUrl(ipfs_cid);
  }, [ipfs_cid]);

  useEffect(() => {
    if (!nftMetadata || !tokenMetadata || ipfs_cid) return;

    const tokenMedia = tokenMetadata?.media || '';

    setImageUrl(tokenMedia);

    if (tokenMedia.startsWith('https://') || tokenMedia.startsWith('http://') || tokenMedia.startsWith('data:image')) {
      setImageUrl(tokenMedia);
    }
    if (nftMetadata?.base_uri) setImageUrl(`${nftMetadata.base_uri}/${tokenMedia}`);
    if (tokenMedia.startsWith('Qm') || tokenMedia.startsWith('ba'))
      setImageUrl(`https://ipfs.near.social/ipfs/${tokenMedia}`);
  }, [nftMetadata, tokenMetadata, ipfs_cid]);

  return <Image width={40} height={40} src={`https://ipfs.near.social/ipfs/${imageUrl}`} alt={alt} />;
};
