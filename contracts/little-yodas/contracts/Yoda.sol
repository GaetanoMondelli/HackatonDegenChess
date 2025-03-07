// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@imtbl/imx-contracts/contracts/IMintable.sol';
import '@thirdweb-dev/contracts/multiwrap/Multiwrap.sol';
import '@thirdweb-dev/contracts/base/ERC721Base.sol';

contract ChessPieceWrap is IMintable, MultiWrap, ERC721Base {
  constructor(
    string memory _name,
    string memory _symbol,
    address _royaltyRecipient,
    uint128 _royaltyBps
  ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}

  function mintFor(
    address to,
    uint256 quantity,
    bytes calldata mintingBlob
  ) external override {
    _safeMint(to, quantity, mintingBlob);
  }

  // function operatorRestriction() external view override returns (bool) {}
}
