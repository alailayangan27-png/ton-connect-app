const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://ton-connect-app.vercel.app/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

let maxTON = 100;
let totalMinted = 0;

// Auto hitung
document.getElementById("tonAmount").addEventListener("input", (e) => {
    let ton = parseFloat(e.target.value) || 0;

    if (ton > 100) {
        ton = 100;
        e.target.value = 100;
    }

    let tags = ton * 10000;
    document.getElementById("tagsResult").innerText = tags + " TAGS";
});

async function mintTokens() {
    const ton = parseFloat(document.getElementById("tonAmount").value);

    if (!ton || ton <= 0) {
        alert("Enter valid TON amount");
        return;
    }

    if (totalMinted + ton > maxTON) {
        alert("Mint limit reached!");
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

        totalMinted += ton;

        document.getElementById("status").innerText =
            "Success! You got " + (ton * 10000) + " TAGS 🎉";

    } catch (err) {
        document.getElementById("status").innerText = "Transaction failed";
    }
}
