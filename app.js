function isTelegram() {
    return window.Telegram && window.Telegram.WebApp;
}

window.addEventListener("load", () => {

    if (!isTelegram()) {
        document.body.innerHTML = "<h3 style='color:white;text-align:center;margin-top:50%'>Open via Telegram</h3>";
        return;
    }

    startApp();
});

function startApp() {

    const tg = window.Telegram.WebApp;
    tg.expand();

    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://ton-connect-app.vercel.app/tonconnect-manifest.json',
        buttonRootId: 'ton-connect',

        walletsListConfiguration: {
            includeWallets: [
                { appName: "telegram-wallet" }
            ]
        },

        actionsConfiguration: {
            twaReturnUrl: 'https://t.me/Tags_coinmintbot'
        }
    });

    // hanya telegram wallet
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

    document.getElementById("tonAmount").addEventListener("input", (e) => {
        let ton = parseFloat(e.target.value) || 0;

        if (ton > MAX_TON) {
            ton = MAX_TON;
            e.target.value = MAX_TON;
        }

        document.getElementById("tagsResult").innerText =
            (ton * 10000) + " TAGS";
    });

    window.setMax = function () {
        document.getElementById("tonAmount").value = MAX_TON;
        document.getElementById("tagsResult").innerText =
            (MAX_TON * 10000) + " TAGS";
    };

    window.mintTokens = async function () {
        const ton = parseFloat(document.getElementById("tonAmount").value);

        if (!ton || ton <= 0) {
            alert("Enter valid TON");
            return;
        }

        const tx = {
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: "UQAPRU6cHYSkS8hIxl-zbcts9yt8_GtYcSh_R0nbYnWL5lFX",
                    amount: (ton * 1e9).toString()
                }
            ]
        };

        try {
            document.getElementById("status").innerText = "Processing...";

            await tonConnectUI.sendTransaction(tx);

            document.getElementById("status").innerText =
                "Success! +" + (ton * 10000) + " TAGS 🎉";

        } catch (err) {
            document.getElementById("status").innerText = "Transaction failed";
        }
    };
}
