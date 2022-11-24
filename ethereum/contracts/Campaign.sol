// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract CampaignFactory {
    Campaign[] public deployedCampigns;

    function createCampaign(uint minimum) public payable {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    uint numApprovers;
    mapping(address => bool) public approvers;
    Request[] public requests;
    

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    modifier anybodyButManger() {
        require(msg.sender != manager);
        _;
    }

    modifier approversOnly() {
        require(approvers[msg.sender]);
        _;
    }

    constructor(uint minimum, address managerAddress) {
        manager = managerAddress;
        minimumContribution = minimum;
    }

    function contribute() public anybodyButManger payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        numApprovers++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public managerOnly {        
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public approversOnly {
        Request storage request = requests[index];
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public managerOnly payable {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (numApprovers / 2));
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}