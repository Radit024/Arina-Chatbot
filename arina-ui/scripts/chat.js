document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");
    const sendButton = document.getElementById("sendButton");
    
    // Inisialisasi status tombol send
    updateSendButtonState();

    // Fungsi untuk memperbarui status tombol send
    function updateSendButtonState() {
        sendButton.disabled = inputField.value.trim() === "";
    }

    // Tambahkan event listener untuk memperbarui status tombol saat input berubah
    inputField.addEventListener("input", updateSendButtonState);

    // Fungsi reusable untuk mengirim pesan ke chatbot (Gemini via n8n)
    const sendToChatbot = async (message) => {
        try {
            const res = await fetch("https://daffaradityoa.app.n8n.cloud/webhook-test/646a0850-4398-4002-908e-47e635acf8fb", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await res.json();
            return data.answer || "Maaf, tidak ada respons dari AI.";
        } catch (error) {
            console.error("Fetch error:", error);
            throw error; // Re-throw untuk ditangkap oleh fungsi pemanggil
        }
    };

    // Fungsi utama untuk mengelola pengiriman dan tampilan pesan
    async function sendMessage() {
        const message = inputField.value.trim();
        if (message === "") return;

        // Nonaktifkan tombol kirim dan input selama menunggu respons
        sendButton.disabled = true;
        inputField.disabled = true;

        // Tampilkan pesan user
        const userMessage = document.createElement("div");
        userMessage.classList.add("chat-message", "user");
        userMessage.innerText = message;
        chatBox.appendChild(userMessage);

        // Kosongkan input
        inputField.value = "";

        // Tambahkan indikator loading
        const loadingIndicator = document.createElement("div");
        loadingIndicator.classList.add("chat-message", "bot", "loading");
        loadingIndicator.innerText = "Mengetik...";
        chatBox.appendChild(loadingIndicator);

        // Auto scroll ke bawah
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const botReply = await sendToChatbot(message);
            
            // Hapus indikator loading
            chatBox.removeChild(loadingIndicator);

            // Tampilkan balasan bot
            const botMessage = document.createElement("div");
            botMessage.classList.add("chat-message", "bot");
            botMessage.innerText = botReply;
            chatBox.appendChild(botMessage);

            // Auto scroll ke bawah
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
            console.error("Error connecting to server:", error);
            
            // Hapus indikator loading jika masih ada
            if (loadingIndicator.parentNode === chatBox) {
                chatBox.removeChild(loadingIndicator);
            }
            
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("chat-message", "bot", "error");
            errorMessage.innerText = "Terjadi kesalahan saat menghubungi server: " + error.message;
            chatBox.appendChild(errorMessage);
            
            // Auto scroll ke bawah
            chatBox.scrollTop = chatBox.scrollHeight;
        } finally {
            // Aktifkan kembali input dan tombol kirim
            inputField.disabled = false;
            inputField.focus();
            updateSendButtonState();
        }
    }

    // Event listeners untuk tombol kirim dan enter key
    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey && !sendButton.disabled) {
            event.preventDefault(); // Prevent form submission
            sendMessage();
        }
    });
});