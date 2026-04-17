document.addEventListener("DOMContentLoaded", () => {

    const tg = window.Telegram?.WebApp;

    // ❌ kalau benar-benar bukan dari Telegram
    if (!tg) {
        document.body.innerHTML =
            "<h3 style='color:white;text-align:center;margin-top:50%'>Open via Telegram</h3>";
        return;
    }

    // ✅ paksa Telegram ready
    tg.ready();
    tg.expand();

    startApp();
});

function startApp() {

    const tg = window.Telegram.WebApp;

    // 🔗 TON CONNECT (Telegram Wallet only)
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://ton-connect-app.vercel.app/tonconnect-manifest.json', // 🔴 GANTI
        buttonRootId: 'ton-connect',

        walletsListConfiguration: {
            includeWallets: [
                { appName: "telegram-wallet" }
            ]
        },

        actionsConfiguration: {
            twaReturnUrl: 'https://t.me/Tags_coinmintbot' // 🔴 GANTI
        }
    });

    // 🔒 blok wallet selain Telegram
    tonConnectUI.onStatusChange(wallet => {
        if (wallet) {
            const name = wallet.device?.appName || "";

            if (!name.toLowerCase().includes("telegram")) {
                tonConnectUI.disconnect();
                alert("Use Telegram Wallet only");
            }
        }
    });

    const MAX_TON = 100;

    const input = document.getElementById("tonAmount");
    const result = document.getElementById("tagsResult");
    const status = document.getElementById("status");

    // 🔢 hitung TAGS
    input.addEventListener("input", (e) => {
        let ton = parseFloat(e.target.value) || 0;

        if (ton > MAX_TON) {
            ton = MAX_TON;
            e.target.value = MAX_TON;
        }

        result.innerText = (ton * 10000) + " TAGS";
    });

    // 🔘 tombol MAX
    window.setMax = function () {
        input.value = MAX_TON;
        result.innerText = (MAX_TON * 10000) + " TAGS";
    };

    // 🚀 mint
    window.mintTokens = async function () {

        const ton = parseFloat(input.value);

        if (!ton || ton <= 0) {
            alert("Enter valid TON");
            return;
        }

        const tx = {
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: "UQAPRU6cHYSkS8hIxl-zbcts9yt8_GtYcSh_R0nbYnWL5lFX", // 🔴 GANTI
                    amount: (ton * 1e9).toString()
                }
            ]
        };

        try {
            status.innerText = "Processing...";

            await tonConnectUI.sendTransaction(tx);

            status.innerText =
                "Success! +" + (ton * 10000) + " TAGS 🎉";

        } catch (err) {
            status.innerText = "Transaction failed";
            console.error(err);
        }
    };
}
