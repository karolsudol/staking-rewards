# Staking Rewards Contracts

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
npx hardhat coverage
REPORT_GAS=true npx hardhat test
npx hardhat run --network goerli scripts/WETH-deploy.ts
npx hardhat verify --network goerli 0x4Eec8A8176414b347d2c7a8E7254C2dAF259D70D
npx hardhat verify --network goerli 0xa883d9C6F7FC4baB52AcD2E42E51c4c528d7F7D3 "TokenERC20" "TKN"
npx hardhat deposit --network goerli --amount 0.08
npx hardhat MINT --amount 10000 --account 0x741e0608906B74B8754a99413A7374FdE7B9779a --network goerli
npx hardhat run --network goerli scripts/staking-deploy.ts
npx hardhat verify --network goerli 0x5D9360AD6455c2Fcad0670e0491B3609D016e339 "0x416BcFAb431ffe9E73c70e5031045A735DE8F501" "0xa883d9C6F7FC4baB52AcD2E42E51c4c528d7F7D3"
```
