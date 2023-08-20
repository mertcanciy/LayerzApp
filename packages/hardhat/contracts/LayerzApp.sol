// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "./lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LayerzApp is NonblockingLzApp {
    using Strings for uint160;
    string public realData;
    uint16 destChainId;
    event Message(string _receivedMessage, uint16 _srcChain);

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {
        if (_lzEndpoint == 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8) destChainId = 10132;
        if (_lzEndpoint == 0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1) destChainId = 10109;
    }

    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory, uint64, bytes memory _payload) internal override {
        (string memory _receivedAddress, string memory _receivedMessage, string memory _senderAddress) = abi.decode(_payload, (string, string, string));
        realData = string(abi.encodePacked(_receivedAddress, ".", _receivedMessage, ".", _senderAddress));
        emit Message(realData, _srcChainId);
    }

    function sendtheMessage(uint16 _destChainId, address _dstAddress, string memory _message) public payable {
        string memory _destAddressString = uint160(_dstAddress).toHexString(20);
        string memory _senderAddress = uint160(msg.sender).toHexString(20);
        bytes memory payload = abi.encode(_destAddressString, _message, _senderAddress);
        _lzSend(_destChainId, payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

    function trustAddress(uint16 _destChainId, address _otherContract) public onlyOwner {
        trustedRemoteLookup[_destChainId] = abi.encodePacked(_otherContract, address(this));   
    }
}
