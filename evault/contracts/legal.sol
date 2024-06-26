pragma solidity 0.8.14;

contract Evault{
    string public name;
    string public description;

    constructor(
        string memory _name,
        string memory _description
    ){
        name = _name;
        description = _description;
    }

    struct User{
        address userAddress;
        string name;
        string email;
        bool isLawyer;
    }

    mapping(address => bool) registered;

    event UserRegistered(address indexed userAddress, string name, string email, bool isLawyer);

    function registerUser(string memory _name, string memory _email, bool _isLawyer) public{
        require(!registered[msg.sender], "User already registered");
        registered[msg.sender] = true;
        users[msg.sender] = User(msg.sender, _name, _email, _isLawyer);

        emit UserRegistered(msg.sender, _name, _email, _isLawyer);
    }

    function getIsRegistered(address addr) public view returns(bool){
        return registered[addr];
    }

    mapping(address => User) users;   

    function getUser(address addr) public view returns(User memory){
        return users[addr];
    }

    struct Case{
        string caseId;
        string name;
        string description;
        address lawyer;

        address[] access;
    }

    struct ApprovalRequest{
        string caseId;
        address lawyer;
        address client;
        bool approved;
    }

    Case[] public allCases;

    mapping(string => Case) cases;
    mapping(string => ApprovalRequest[]) approvalRequests;

    event CaseCreated(string caseId, string name, string description, address lawyer);

    function createCase(string memory _caseId, string memory _name, string memory _description) public{
        require(registered[msg.sender], "User not registered");
        require(users[msg.sender].isLawyer, "User not a lawyer");

        cases[_caseId] = Case(_caseId, _name, _description, msg.sender, new address[](0));
        allCases.push(cases[_caseId]);

        emit CaseCreated(_caseId, _name, _description, msg.sender);
    }

    function getCase(string memory _caseId) public view returns(Case memory){
        return cases[_caseId];
    }

    function getAllCases() public view returns(Case[] memory){
        return allCases;
    }

    function getCaseAccess(string memory _caseId) public view returns(address[] memory){
        return cases[_caseId].access;
    }

    event ApprovalRequested(string caseId, address lawyer, address client);

    function requestAccess(string memory _caseId) public{
        require(registered[msg.sender], "User not registered");

        approvalRequests[_caseId].push(ApprovalRequest(_caseId, cases[_caseId].lawyer, msg.sender, false));

        emit ApprovalRequested(_caseId, cases[_caseId].lawyer, msg.sender);
    }

    event ApprovalAccepted(string caseId, address lawyer, address client);

    function approveAccess(string memory _caseId, address _client) public{
        require(cases[_caseId].lawyer == msg.sender, "User not the lawyer of the case");

        for(uint i = 0; i < approvalRequests[_caseId].length; i++){
            if(approvalRequests[_caseId][i].client == _client){
                approvalRequests[_caseId][i].approved = true;
                cases[_caseId].access.push(_client);
                break;
            }
        }

        emit ApprovalAccepted(_caseId, msg.sender, _client);
    }

    function getApprovalRequests(string memory _caseId) public view returns(ApprovalRequest[] memory){
        return approvalRequests[_caseId];
    }

    event AccessRevoked(string caseId, address lawyer, address client);

    function revokeAccess(string memory _caseId, address _client) public{
        require(cases[_caseId].lawyer == msg.sender, "User not the lawyer of the case");

        for(uint i = 0; i < cases[_caseId].access.length; i++){
            if(cases[_caseId].access[i] == _client){
                cases[_caseId].access[i] = cases[_caseId].access[cases[_caseId].access.length - 1];
                cases[_caseId].access.pop();
                break;
            }
        }

        emit AccessRevoked(_caseId, msg.sender, _client);
    }
}