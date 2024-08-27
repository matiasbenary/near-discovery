const { providers } = require("near-api-js");
const fs = require("fs");

const callView = async (account_id, method_name) => {
    const url = `https://rpc.mainnet.near.org`;
    const provider = new providers.JsonRpcProvider({ url });

    let res = await provider.query({
        request_type: 'call_function',
        account_id,
        method_name,
        args_base64: Buffer.from(JSON.stringify({})).toString('base64'),
        finality: 'optimistic',
    });
    return JSON.parse(Buffer.from(res.result).toString());
}

const jsonFinish = [];

const generateJSONFile = (data, fileName) => {
    fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
        console.log(`Archivo JSON guardado como ${fileName}`);
    });
}

callView("v2.ref-finance.near", "get_whitelisted_tokens").then(result => {
    const promises = result.map(token => 
        callView(token, "ft_metadata").then(res => {
            jsonFinish.push({ token_name: token, ...res });
        }).catch(error => {
            console.error(`Error con el token ${token}:`, error);
        })
    );

    Promise.all(promises).then(() => {
        generateJSONFile(jsonFinish, 'white-list.json');
    });

}).catch(error => {
    console.error(error);
});