// Variabel global untuk menyimpan format BEP (default: unit)
let isBepRupiah = false;

// Fungsi toggle format BEP (unit <-> rupiah)
function toggleFormatBep() {
    isBepRupiah = !isBepRupiah;
    hitungAnalisis();
}

// Fungsi untuk memvalidasi angka
function isValidInput(value) {
    return !isNaN(value) && value >= 0;
}

function hitungAnalisis() {
    let investment = getValue("investment"); // Biaya investasi awal
    let operational = getValue("operational"); // Biaya operasional bulanan
    let cost = getValue("biayaProduksi"); // Biaya produksi per unit
    let volume = getValue("volume"); // Volume produksi / penjualan
    let markup = parseFloat(document.getElementById("markup").value); // Markup % dari HPP

    // Validasi input
    if (![investment, operational, cost, volume, markup].every(isValidInput)) {
        alert("Harap masukkan angka yang valid! Nilai tidak boleh negatif.");
        return;
    }

    if (volume <= 0) {
        alert("Harap masukkan volume penjualan yang valid dan lebih besar dari 0.");
        return;
    }

    if (cost > 0 && volume === 0) {
        alert("Jika menggunakan biaya produksi, volume tidak boleh 0!");
        return;
    }

    // **Perhitungan HPP**
    let hpp = cost + (operational / Math.max(volume, 1));
    let metode = "Menggunakan perhitungan berdasarkan biaya produksi dan operasional per unit.";

    // **Perhitungan Harga Jual**
    let hargaJual = hpp * (1 + (markup / 100));

    if (hargaJual <= hpp) {
        alert("Harga jual harus lebih tinggi dari HPP untuk menghitung BEP!");
        return;
    }

    // **Perhitungan Profit**
    let profit = volume * (hargaJual - hpp);
    let roi = "Tidak valid", pp = "Tidak valid";

    if (investment > 0 && profit > 0) {
        roi = (profit / investment * 100).toFixed(2) + "%";
    }

    // **Perhitungan Payback Period (PP)**
    if (investment > 0 && profit > 0) {
        let totalHari = Math.round((investment / profit) * 30);
        let ppTahun = Math.floor(totalHari / 365);
        totalHari %= 365;
        let ppBulan = Math.floor(totalHari / 30);
        totalHari %= 30;
        let ppMinggu = Math.floor(totalHari / 7);
        let ppHari = totalHari % 7;

        pp = `${ppTahun} tahun ${ppBulan} bulan ${ppMinggu} minggu ${ppHari} hari`;
    }

    // **Perhitungan BEP**
    let bepUnit = "Tidak valid", bepRupiah = "Tidak valid";

    if (hargaJual > hpp && investment > 0) {
        bepUnit = (investment / (hargaJual - hpp)).toFixed(2);
        bepRupiah = formatRupiah(investment / (hargaJual - hpp) * hargaJual);
    } else if (investment <= 0 && operational > 0) {
        bepUnit = (operational / (hargaJual - hpp)).toFixed(2);
        bepRupiah = formatRupiah(operational / (hargaJual - hpp) * hargaJual);
    }

    // **Perhitungan Revenue & Profit Margin**
    let revenue = hargaJual * volume;
    let profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) + "%" : "Tidak valid";

    // **Tampilkan hasil perhitungan**
    setText("hargaJual", formatRupiah(hargaJual));
    setText("revenue", formatRupiah(revenue));
    setText("profit", formatRupiah(profit));
    setText("bep", isBepRupiah ? bepRupiah : `${bepUnit} unit`);
    setText("hpp", formatRupiah(hpp));
    setText("roi", roi);
    setText("pp", pp);
    setText("profit-margin", profitMargin);
    setText("metode", metode);
}

// Fungsi untuk format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(number);
}

// Fungsi mendapatkan nilai input dengan ID tertentu
function getValue(id) {
    let el = document.getElementById(id);
    return el ? parseFloat(el.value) || 0 : 0;
}

// Fungsi mengubah teks dalam elemen dengan ID tertentu
function setText(id, text) {
    let el = document.getElementById(id);
    if (el) el.textContent = text;
}

// Fungsi untuk update perhitungan berdasarkan data tabel
function updateCalculations() {
    let totalUnit = getValue("totalUnit");
    let biayaProduksi = getValue("biayaProduksi");
    let hppValue = totalUnit > 0 ? biayaProduksi / totalUnit : 0;

    setText("hpp", totalUnit > 0 ? formatRupiah(hppValue) : "Tidak valid");
    setText("bep", hppValue > 0 ? (getValue("investment") / hppValue).toFixed(2) : "Tidak valid");
}

// Fungsi untuk tabel (tambah/hapus/update total)
function addRow(tableId) {
    let table = document.querySelector(`#${tableId} tbody`);
    let row = table.insertRow();
    row.innerHTML = `
        <td><input type="text"></td>
        <td><input type="number" oninput="updateTotalCost('${tableId}')"></td>
        <td><input type="number" oninput="updateTotalCost('${tableId}')"></td>
        <td><button class="btn-hapus" onclick="deleteRow(this, '${tableId}')">Hapus</button></td>
    `;
}

function deleteRow(button, tableId) {
    button.parentElement.parentElement.remove();
    updateTotalCost(tableId);
}

function updateTotalCost(tableId) {
    let total = 0;
    document.querySelectorAll(`#${tableId} tbody tr`).forEach(row => {
        let qty = row.cells[1].querySelector("input").value || 0;
        let price = row.cells[2].querySelector("input").value || 0;
        total += (parseFloat(qty) * parseFloat(price));
    });
    document.getElementById(tableId === "investmentTable" ? "investment" : "operational").value = total;
}

// Fungsi untuk membuka/menutup tabel pop-up
function openTablePopup(type) {
    let popup = document.getElementById(type === 'investment' ? "investmentPopup" : "operationalPopup");
    if (popup) {
        popup.style.display = "flex"; // Use flex for proper centering
        popup.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Prevent scrolling
    }
}

function closeTablePopup(type) {
    let popup = document.getElementById(type);
    if (popup) {
        popup.style.display = "none";
        popup.classList.add("hidden");
        document.body.style.overflow = "auto"; // Restore scrolling
    }
}

// Menutup pop-up jika klik di luar kontennya (termasuk popup info)
document.querySelectorAll(".popup, #popupInfo, #investmentPopup, #operationalPopup").forEach(popup => {
    popup.addEventListener("click", function(event) {
        if (event.target === this) {
            this.style.display = "none";
            this.classList.add("hidden");
            document.body.style.overflow = "auto";
        }
    });
});

// Menutup pop-up jika tombol 'Esc' ditekan
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        document.querySelectorAll(".popup, #popupInfo, #investmentPopup, #operationalPopup").forEach(popup => {
            popup.style.display = "none";
            popup.classList.add("hidden");
        });
        document.body.style.overflow = "auto";
    }
});

// Event listener untuk tombol "info"
document.querySelectorAll(".info-btn").forEach(button => {
    button.addEventListener("click", function () {
        let infoText = this.getAttribute("data-info");
        showPopupInfo(infoText);
    });
});

// Fungsi untuk menampilkan pop-up info
function showPopupInfo(text) {
    let popup = document.getElementById("popupInfo");
    let popupText = document.getElementById("popupText");
    popupText.innerHTML = text;
    popup.classList.remove("hidden");
    popup.style.display = "flex"; // Ensure the popup is displayed
}

// Event listener untuk menutup pop-up
document.getElementById("closePopup").addEventListener("click", function () {
    let popup = document.getElementById("popupInfo");
    popup.classList.add("hidden");
    popup.style.display = "none"; // Ensure the popup is hidden
});

function exportToXlsx() {
    // Create a new workbook and worksheet
    let wb = XLSX.utils.book_new();

    // Export Investment Table
    let investmentTable = document.querySelector("#investmentTable tbody");
    let investmentData = [["Nama", "Kuantitas", "Harga (Rp)"]];
    investmentTable.querySelectorAll("tr").forEach(row => {
        let item = row.cells[0].querySelector("input").value;
        let qty = parseFloat(row.cells[1].querySelector("input").value) || 0;
        let price = parseFloat(row.cells[2].querySelector("input").value) || 0;
        investmentData.push([item, qty, price]);
    });
    if (investmentData.length > 1) { // Check if there are more than one data rows
        let lastRow = investmentData.length + 1;
        investmentData.push(["Total", { f: `SUM(B2:B${lastRow - 1})` }, { f: `SUM(C2:C${lastRow - 1})` }]);
    }
    let wsInvestment = XLSX.utils.aoa_to_sheet(investmentData);
    XLSX.utils.book_append_sheet(wb, wsInvestment, "Tabel Investment Cost");

    // Export Operational Table
    let operationalTable = document.querySelector("#operationalTable tbody");
    let operationalData = [["Nama", "Kuantitas", "Harga (Rp)"]];
    operationalTable.querySelectorAll("tr").forEach(row => {
        let item = row.cells[0].querySelector("input").value;
        let qty = parseFloat(row.cells[1].querySelector("input").value) || 0;
        let price = parseFloat(row.cells[2].querySelector("input").value) || 0;
        operationalData.push([item, qty, price]);
    });
    if (operationalData.length > 1) { // Check if there are more than one data rows
        let lastRow = operationalData.length + 1;
        operationalData.push(["Total", { f: `SUM(B2:B${lastRow - 1})` }, { f: `SUM(C2:C${lastRow - 1})` }]);
    }
    let wsOperational = XLSX.utils.aoa_to_sheet(operationalData);
    XLSX.utils.book_append_sheet(wb, wsOperational, "Tabel Operational Cost");

    // Export Hasil Analisis
    let investmentRowCount = document.querySelectorAll("#investmentTable tbody tr").length + 1; // +1 for header
    let operationalRowCount = document.querySelectorAll("#operationalTable tbody tr").length + 1; // +1 for header

    let investmentSumFormula = investmentRowCount > 2 ? `SUM('Tabel Investment Cost'!C2:C${investmentRowCount})` : `'Tabel Investment Cost'!C2`;
    let operationalSumFormula = operationalRowCount > 2 ? `SUM('Tabel Operational Cost'!C2:C${operationalRowCount})` : `'Tabel Operational Cost'!C2`;

// BROKEN
    let hasilAnalisisData = [
        ["Parameter", "Nilai", "Unit"],
        ["Investment", { f: investmentSumFormula }, "Rupiah"],
        ["Operational", { f: operationalSumFormula }, "Rupiah"],
        ["Biaya Produksi", { f: `'Tabel Investment Cost'!C2` }, "Rupiah"],
        ["Volume", { f: `'Tabel Investment Cost'!B2` }, "unit"],
        ["Markup", { f: `'Tabel Investment Cost'!B3` }, "%"],
        ["HPP", { f: `'Hasil Analisis'!B3 + ('Hasil Analisis'!B2 / MAX('Hasil Analisis'!B4, 1))` }, "Rupiah"],
        ["Harga Jual", { f: `'Hasil Analisis'!B7 * (1 + ('Hasil Analisis'!B6 / 100))` }, "Rupiah"],
        ["Revenue", { f: `'Hasil Analisis'!B8 * 'Hasil Analisis'!B5` }, "Rupiah"],
        ["Profit", { f: `'Hasil Analisis'!B9 - ('Hasil Analisis'!B7 * 'Hasil Analisis'!B5)` }, "Rupiah"],
        ["ROI", { f: `IF('Hasil Analisis'!B2 > 0, ('Hasil Analisis'!B10 / 'Hasil Analisis'!B2) * 100, "Tidak valid")` }, "%"],
        ["BEP", { f: `IF('Hasil Analisis'!B8 > 'Hasil Analisis'!B7, 'Hasil Analisis'!B2 / ('Hasil Analisis'!B8 - 'Hasil Analisis'!B7), "Tidak valid")` }, isBepRupiah ? "Rupiah" : "unit"],
        ["Payback Period", { f: `IF('Hasil Analisis'!B2 > 0, ROUND(('Hasil Analisis'!B2 / 'Hasil Analisis'!B10) * 30, 0), "Tidak valid")` }, ""],
        ["Profit Margin", { f: `IF('Hasil Analisis'!B9 > 0, ('Hasil Analisis'!B10 / 'Hasil Analisis'!B9) * 100, "Tidak valid")` }, "%"]
    ];
// BROKEN

    let wsHasilAnalisis = XLSX.utils.aoa_to_sheet(hasilAnalisisData);
    XLSX.utils.book_append_sheet(wb, wsHasilAnalisis, "Hasil Analisis");

    // Export the workbook to XLSX file
    XLSX.writeFile(wb, "AKU_Analisis_Kelayakan_Usaha.xlsx");
}

function importFromXlsx(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Import Investment Table
        const wsInvestment = workbook.Sheets["Tabel Investment Cost"];
        const investmentData = XLSX.utils.sheet_to_json(wsInvestment, { header: 1 });
        updateTableFromData("investmentTable", investmentData);

        // Import Operational Table
        const wsOperational = workbook.Sheets["Tabel Operational Cost"];
        const operationalData = XLSX.utils.sheet_to_json(wsOperational, { header: 1 });
        updateTableFromData("operationalTable", operationalData);

        // Import Hasil Analisis
        const wsHasilAnalisis = workbook.Sheets["Hasil Analisis"];
        const hasilAnalisisData = XLSX.utils.sheet_to_json(wsHasilAnalisis, { header: 1 });

        if (hasilAnalisisData.length > 1) {
            setInputValue("investment", hasilAnalisisData[1][1] || "");
            setInputValue("operational", hasilAnalisisData[2][1] || "");
            setInputValue("biayaProduksi", hasilAnalisisData[3][1] || "");
            setInputValue("volume", hasilAnalisisData[4][1] || "");
            setInputValue("markup", hasilAnalisisData[5][1] || "");
            setText("hpp", hasilAnalisisData[6][1] || "");
            setText("hargaJual", hasilAnalisisData[7][1] || "");
            setText("revenue", hasilAnalisisData[8][1] || "");
            setText("profit", hasilAnalisisData[9][1] || "");
            setText("roi", hasilAnalisisData[10][1] || "");
            setText("bep", hasilAnalisisData[11][1] || "");
            setText("pp", hasilAnalisisData[12][1] || "");
            setText("profit-margin", hasilAnalisisData[13][1] || "");

            // Trigger recalculation after importing
            updateTotalCost("investmentTable");
            updateTotalCost("operationalTable");
            hitungAnalisis();
        }
    };

    reader.readAsArrayBuffer(file);
}

function updateTableFromData(tableId, data) {
    let table = document.querySelector(`#${tableId} tbody`);
    table.innerHTML = ""; // Clear existing rows
    data.slice(1).forEach(row => { // Skip header row
        if (row[0] !== "Total") { // Exclude "Total" row
            let newRow = table.insertRow();
            newRow.innerHTML = `
                <td><input type="text" value="${row[0] || ''}"></td>
                <td><input type="number" value="${row[1] || 0}" oninput="updateTotalCost('${tableId}')"></td>
                <td><input type="number" value="${row[2] || 0}" oninput="updateTotalCost('${tableId}')"></td>
                <td><button class="btn-hapus" onclick="deleteRow(this, '${tableId}')">Hapus</button></td>
            `;
        }
    });
    updateTotalCost(tableId); // Update total cost after importing
}

// Helper function to get the text content of an element by its ID
function getText(id) {
    let el = document.getElementById(id);
    return el ? el.textContent : "";
}

// Helper function to get the value of an input field by its ID
function getValue(id) {
    let el = document.getElementById(id);
    return el ? parseFloat(el.value) || 0 : 0;
}

// Helper function to set the value of an input field by its ID
function setInputValue(id, value) {
    let el = document.getElementById(id);
    if (el) {
        el.value = value;
    }
}

// Helper function to set the text content of an element by its ID
function setText(id, text) {
    let el = document.getElementById(id);
    if (el) {
        el.textContent = text;
    }
}
