# 📂 KAMPUNG COIN (KPNG) - Smart Contract (Testnet Version)

Repository ini berisi source code Smart Contract untuk **Kampung Coin (KPNG)** yang telah dideploy ke jaringan **BNB Smart Chain (BSC) Testnet**.

## 📋 Informasi Kontrak (Deployment Details)
*Tim developer wajib mencatat alamat ini untuk integrasi frontend/backend.*

* **Nama Token:** Kampung Coin
* **Simbol:** KPNG
* **Total Supply:** 1,000,000,000 (1 Milyar)
* **Network:** BNB Smart Chain Testnet (Chain ID: 97)
* **Contract Address:** `[MASUKKAN_ALAMAT_KONTRAK_DARI_REMIX_DISINI]`
* **Initial Owner Wallet (OKX):** `[MASUKKAN_ALAMAT_WALLET_OKX_DISINI]`
* **Compiler Version:** Solidity ^0.8.20 (OpenZeppelin v5)

---

## 🛠️ Fitur Teknis (Code Breakdown)
Kode ini dibangun di atas standar **ERC-20 OpenZeppelin** dengan modifikasi logika bisnis pada fungsi `_update`:

1.  **Marketing Tax (5%):**
    * Setiap transaksi transfer antar user (Non-Owner) akan dikenakan potongan 5%.
    * Potongan 5% otomatis dikirim ke `marketingWallet` (saat ini diset sama dengan Owner).
    * *Contoh:* User A kirim 100 KPNG ke User B. User B terima 95, Owner terima 5.

2.  **Owner Privilege (Tax Exemption):**
    * **Whitelist System:** Alamat Wallet Owner (`owner()`) **BEBAS PAJAK** baik saat mengirim maupun menerima.
    * *Tujuannya:* Memudahkan distribusi airdrop, gaji, atau penyediaan likuiditas (Add Liquidity) tanpa terpotong pajak sendiri.

3.  **Security:**
    * Menggunakan `Ownable` untuk manajemen akses.
    * Menggunakan `_update` override (internal function) untuk memastikan pajak tidak bisa di-bypass lewat fungsi `transferFrom`.

---

## 🧪 Laporan Pengujian (Testing Status)

### ✅ Tahap 1: Deployment & Basic Setup (SUDAH SELESAI)
* [x] **Kompilasi Kode:** Sukses tanpa error (Remix IDE).
* [x] **Deployment ke BSC Testnet:** Sukses.
* [x] **Minting Awal:** 1 Milyar token sukses masuk ke Wallet Owner (OKX).
* [x] **Verifikasi Wallet:** Token sudah berhasil di-import dan muncul di OKX Wallet.

### ⚠️ Tahap 2: Simulasi Transaksi & Logika Bisnis (BELUM DILAKUKAN / PERLU VALIDASI TIM)
*Tim Developer wajib menjalankan skenario tes berikut dan mencatat hasilnya:*

**Skenario A: Distribusi Owner (Gaji/Airdrop)**
* **Test:** Transfer 100 KPNG dari **Owner (OKX)** ke **User (Rabby)**.
* **Ekspektasi:** User menerima **FULL 100 KPNG**. (Tidak ada potongan).
* **Tujuan:** Memastikan fitur *Whitelist Owner* berjalan.

**Skenario B: Transaksi User Biasa (Pajak)**
* **Test:** Transfer 100 KPNG dari **User A (Rabby)** ke **User B (Wallet Lain)**.
* **Ekspektasi:**
    1.  User B hanya menerima **95 KPNG**.
    2.  Wallet Owner (Marketing) bertambah **5 KPNG** secara otomatis.
* **Tujuan:** Memastikan logika pajak 5% berjalan.

**Skenario C: Simulasi Jual-Beli (DEX / PancakeSwap)**
* **Test:** Owner melakukan "Add Liquidity" di PancakeSwap Testnet (Misal: 10,000 KPNG + 0.1 tBNB).
* **Test:** User (Rabby) mencoba **Swap (Beli)** KPNG menggunakan tBNB.
* **Ekspektasi:** Transaksi berhasil (Ingat set *Slippage Tolerance* minimal 6-7% karena ada pajak 5%).
* **Test:** User (Rabby) mencoba **Swap (Jual)** KPNG menjadi tBNB.
* **Ekspektasi:** Transaksi berhasil, pajak 5% terpotong saat menjual.

---

## 🚀 Langkah Selanjutnya (Next Steps for Team)

Mohon tim teknis melanjutkan pekerjaan dari titik ini:

1.  **Frontend Integration:**
    * Buat tombol "Connect Wallet" di website project.
    * Tampilkan saldo KPNG user di dashboard website (baca dari Contract Address).

2.  **Liquidity Setup (Penting):**
    * Segera buat **Liquidity Pool (V2)** di PancakeSwap Testnet menggunakan Wallet Owner.
    * Tanpa ini, token tidak memiliki harga dan tidak bisa dibeli user via DEX.

3.  **Stress Test:**
    * Coba transfer dengan angka desimal (koma-komaan) untuk memastikan tidak ada error pembulatan pada pajak.
    * Coba transfer seluruh saldo (Max Amount) dari wallet user untuk memastikan perhitungan pajak tidak menyebabkan "Insufficient Balance".

4.  **Security Audit (Internal):**
    * Cek apakah `marketingWallet` perlu dipisahkan dari `ownerWallet` di masa depan (untuk keamanan dana operasional).

---
*Dokumen ini dibuat oleh Jay pada tanggal 7 Desember 2025.*
