---
'@cypherock/sdk-app-evm': minor
---

Fix EIP-712 typed data signing for dapps like Hyperliquid: support non-identifier struct type names, ignore undeclared message keys, and encode struct fields in declaration order. Removes the unused `setEip712Lib`/`getEip712Lib` exports; the `eip-712` package is no longer needed
