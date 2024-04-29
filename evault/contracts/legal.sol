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
}