import { NearContext } from "@/components/WalletSelector";
import { useContext, useEffect, useState, useCallback } from "react";

const useListNftMintbase = () => {
    const { signedAccountId } = useContext(NearContext);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchStores = useCallback(async () => {
        setLoading(true);
        console.log("🚀 ~ fetchStores ~ reload", signedAccountId);
        
        try {
            const response = await fetch('https://graph.mintbase.xyz/testnet', {
                headers: {
                    'content-type': 'application/json',
                    'mb-api-key': 'omni-site',
                },
                body: JSON.stringify({
                    operationName: "v2_omnisite_GetStoresByMinterOwner",
                    variables: { id: signedAccountId },
                    query: `query v2_omnisite_GetStoresByMinterOwner($id: String!) {
                        mb_store_minters(
                            where: {_or: [{minter_id: {_eq: $id}}, {nft_contracts: {owner_id: {_eq: $id}}}]}
                            distinct_on: nft_contract_id
                        ) {
                            nft_contract_id
                            nft_contracts {
                                owner_id
                                __typename
                            }
                            __typename
                        }
                    }`
                }),
                method: 'POST',
            });
            const data = await response.json();
            setStores(data?.data?.mb_store_minters);
            console.log(data);
        } catch (error) {
            console.error("Error fetching stores:", error);
        } finally {
            setLoading(false);
        }
    }, [signedAccountId]);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    return { stores, loading, reloadStores: fetchStores };
}

export default useListNftMintbase;