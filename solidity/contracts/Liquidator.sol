// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";

contract Liquidator {
    IPool private aavePool;

    constructor(
        address poolAddress
        ) {
        aavePool = IPool(poolAddress);
    }

    function liquidateUser(address userAddress, uint256 debtToCover, address collateralAsset, address debtAsset) external {
        address user = userAddress;
        bool receiveAToken = true;
        aavePool.liquidationCall(
            collateralAsset,
            debtAsset,
            user,
            debtToCover,
            receiveAToken
        );
    }

    function getUserAccountData(address user) external view returns (
        uint256 totalCollateralBase,
        uint256 totalDebtBase,
        uint256 availableBorrowsBase,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
    ) {
        return aavePool.getUserAccountData(user);
    }
}