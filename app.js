document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {

        const tg = window.Telegram?.WebApp;

        if (!tg || !tg.initData) {
            document.body.innerHTML = "Access denied";
            return;
        }

        tg.ready();
        tg.expand();

        startApp();

    }, 500);
});


function startApp() {

    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://ton-connect-app.vercel.app/tonconnect-manifest.json',
        buttonRootId: 'ton-connect'
    });

    window.tonConnectUI = tonConnectUI;

    tonConnectUI.onStatusChange(wallet => {
        if (wallet) {
            const name = wallet.device?.appName || "";
            if (!name.toLowerCase().includes("telegram")) {
                tonConnectUI.disconnect();
                alert("Use Telegram Wallet only");
            }
        }
    });

    const input = document.getElementById("tonAmount");
    const result = document.getElementById("tagsResult");
    const status = document.getElementById("status");

    const MAX_TON = 100;

    input.addEventListener("input", (e) => {
        let ton = parseFloat(e.target.value) || 0;

        if (ton > MAX_TON) {
            ton = MAX_TON;
            e.target.value = MAX_TON;
        }

        result.innerText = (ton * 10000) + " TAGS";
    });

    window.setMax = function () {
        input.value = MAX_TON;
        result.innerText = (MAX_TON * 10000) + " TAGS";
    };

    window.mintTokens = async function () {

        if (!tonConnectUI.connected) {
            alert("Connect wallet first");
            return;
        }

        const ton = parseFloat(input.value);

        if (!ton || ton <= 0) {
            alert("Enter valid TON");
            return;
        }

        const tx = {
            validUntil: Math.floor(Date.now() / 1000) + 120,
            messages: [
                {
                    address: "UQAPRU6cHYSkS8hIxl-zbcts9yt8_GtYcSh_R0nbYnWL5lFX",
                    amount: (ton * 1e9).toString()
                }
            ]
        };

        try {
            status.innerText = "Processing...";
            await new Promise(r => setTimeout(r, 500));
            await tonConnectUI.sendTransaction(tx);
            status.innerText = "Success!";
        } catch (err) {
            status.innerText = "Cancelled";
        }
    };
}
