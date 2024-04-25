import MetaMaskSDK from "@metamask/sdk";

const sdk = new MetaMaskSDK({
    dappMetadata: {
        name: "eVault",
        url: window.location.href,
    },
    injectProvider: true,
    
});

export const metamask = sdk.getProvider();
