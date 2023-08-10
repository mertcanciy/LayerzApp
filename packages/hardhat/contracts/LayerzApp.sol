// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "./lzApp/NonblockingLzApp.sol";

/// @title A LayerZero example sending a cross chain message from a source chain to a destination chain to increment a counter
contract LayerzApp is NonblockingLzApp {
    string public realData;
    uint16 destChainId;
    event Message(string _receivedMessage);

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {
        if (_lzEndpoint == 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8) destChainId = 10132;
        if (_lzEndpoint == 0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1) destChainId = 10109;
    }

    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _payload) internal override {
        realData = abi.decode(_payload, (string));
        emit Message(realData);
    }

    function sendtheMessage(bytes memory _message) public payable {
        // string memory destAddrDelimeter = string(abi.encodePacked(_dstAddress, "|"));
        bytes memory payload = abi.encode(_message);
        _lzSend(destChainId, payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

    function trustAddress(address _otherContract) public onlyOwner {
    trustedRemoteLookup[destChainId] = abi.encodePacked(_otherContract, address(this));   
    }
}