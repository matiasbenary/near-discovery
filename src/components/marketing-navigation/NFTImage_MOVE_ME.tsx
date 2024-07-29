import { useEffect, useState, useContext } from 'react';
import { useVmStore } from '@/stores/vm';

export const NftImage = ({ contractId, tokenId, alt }) => {
  const near = useVmStore((store) => store.near);
  const [imageUrl, setImageUrl] = useState(
    'https://ipfs.near.social/ipfs/bafkreidoxgv2w7kmzurdnmflegkthgzaclgwpiccgztpkfdkfzb4265zuu',
  );
  const [nftMetadata, setNftMetadata] = useState(null);
  const [tokenMetadata, setTokenMetadata] = useState(null);

  useEffect(() => {
    console.log(contractId, tokenId, alt);

    if (!near || !contractId || !tokenId) return;
    console.log(contractId, tokenId, alt);
    near.viewCall(contractId, 'nft_metadata').then(setNftMetadata);
    near.viewCall(contractId, 'nft_token', { token_id: tokenId }).then((res) => {
      setTokenMetadata(res.metadata);
    });
  }, [near, contractId, tokenId, alt]);

  useEffect(() => {
    if (!nftMetadata || !tokenMetadata) return;

    let tokenMedia = tokenMetadata.media || '';

    setImageUrl(tokenMedia);

    if (tokenMedia.startsWith('https://') || tokenMedia.startsWith('http://') || tokenMedia.startsWith('data:image')) {
      setImageUrl(tokenMedia);
    }
    if (nftMetadata.base_uri) setImageUrl(`${nftMetadata.base_uri}/${tokenMedia}`);
    if (tokenMedia.startsWith('Qm') || tokenMedia.startsWith('ba'))
      setImageUrl(`https://ipfs.near.social/ipfs/${tokenMedia}`);
  }, [nftMetadata, tokenMetadata]);

  return <img src={imageUrl} alt={alt} />;
};
