// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KampungCoin
 * @dev Implementation of the Kampung Coin (KPNG) token
 * @notice This is a standard ERC-20 token with burn and ownership features
 */
contract KampungCoin is ERC20, ERC20Burnable, Ownable {
    // Maximum supply of KPNG tokens (100 million)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    /**
     * @dev Constructor that mints initial supply to the contract deployer
     * @param initialSupply The initial amount of tokens to mint (in whole tokens)
     */
    constructor(uint256 initialSupply) ERC20("Kampung Coin", "KPNG") Ownable(msg.sender) {
        require(initialSupply * 10**18 <= MAX_SUPPLY, "Initial supply exceeds maximum supply");
        _mint(msg.sender, initialSupply * 10**18);
    }
    
    /**
     * @dev Allows the owner to mint new tokens
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint (in whole tokens)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + (amount * 10**18) <= MAX_SUPPLY, "Minting would exceed maximum supply");
        _mint(to, amount * 10**18);
    }
    
    /**
     * @dev Returns the maximum supply of tokens
     * @return The maximum supply in base units
     */
    function maxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }
}
