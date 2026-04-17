const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://ton-connect-app.vercel.app/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

tonConnectUI.onStatusChange(wallet => {
    if (wallet) {
        alert("Connected: " + wallet.account.address);
    }
});

async function sendTransaction() {
    const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
            {
                address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: "10000000"
            }
        ]
    };

    await tonConnectUI.sendTransaction(tx);
}
