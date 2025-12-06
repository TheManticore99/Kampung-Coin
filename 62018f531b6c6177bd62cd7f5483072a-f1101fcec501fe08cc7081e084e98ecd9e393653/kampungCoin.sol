// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KampungCoin is ERC20, Ownable {
    
    address public marketingWallet;

    // ERROR FIX: Constructor sekarang butuh input 'initialOwner' (sesuai aturan OpenZeppelin V5)
    constructor(address initialOwner) ERC20("Kampung Coin", "KPNG") Ownable(initialOwner) {
        marketingWallet = initialOwner;
        // Mencetak 1 Milyar koin ke alamat Owner
        _mint(initialOwner, 1000000000 * 10 ** decimals());
    }

    // SECURITY FIX: Menggunakan fungsi internal '_update'
    // Fungsi ini otomatis menangani 'transfer' DAN 'transferFrom' sekaligus.
    // Jadi tidak ada celah bagi user untuk menghindari pajak.
    function _update(address from, address to, uint256 value) internal override {
        // Jika sedang Minting (cetak baru) atau Burning (bakar), biarkan normal
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        // LOGIKA PAJAK:
        // Cek apakah yang kirim atau terima adalah Owner?
        // Jika iya, BEBAS PAJAK (biar Bapak transfer gaji karyawan gak kena potong sendiri)
        bool isTaxFree = (from == owner() || to == owner());

        if (isTaxFree) {
            super._update(from, to, value);
        } else {
            // Hitung Pajak 5%
            uint256 taxAmount = (value * 5) / 100;
            uint256 sendAmount = value - taxAmount;

            // 1. Kirim Pajak ke Marketing Wallet (Saldo Pengirim dikurangi taxAmount)
            super._update(from, marketingWallet, taxAmount);

            // 2. Kirim Sisanya ke Penerima (Saldo Pengirim dikurangi sendAmount)
            // Total pengurangan = tax + send = value (Pas, tidak double charge)
            super._update(from, to, sendAmount);
        }
    }
}