const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://ton-connect-app.vercel.app/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

let totalMintedTON = 0; // total global (sementara di frontend)

// Auto hitung TAGS
document.getElementById("tonAmount").addEventListener("input", (e) => {
    let ton = parseFloat(e.target.value) || 0;
    let tags = ton * 10000;
    document.getElementById("tagsResult").innerText = "TAGS: " + tags;
});

async function mintTokens() {
    const ton = parseFloat(document.getElementById("tonAmount").value);

    if (!ton || ton <= 0) {
        alert("Masukkan jumlah TON yang valid");
        return;
    }

    if (totalMintedTON + ton > 100) {
        alert("Max mint 100 TON tercapai!");
        return;
    }

    const amountNano = (ton * 1e9).toString();

    const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
            {
                address: "UQAPRU6cHYSkS8hIxl-zbcts9yt8_GtYcSh_R0nbYnWL5lFX", // ganti alamat kamu
                amount: amountNano
            }
        ]
    };

    try {
        document.getElementById("status").innerText = "Mengirim transaksi...";

        await tonConnectUI.sendTransaction(tx);

        totalMintedTON += ton;

        const tags = ton * 10000;

        document.getElementById("status").innerText =
            "Berhasil mint " + tags + " TAGS 🎉";

    } catch (err) {
        document.getElementById("status").innerText = "Transaksi gagal ❌";
        console.error(err);
    }
}
