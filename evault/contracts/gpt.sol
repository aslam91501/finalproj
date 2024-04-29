pragma solidity ^0.8.0;

contract LegalCaseContract {
    struct File {
        string name;
        address owner;
        mapping(address => bool) permissions;
    }
    
    struct LegalCase {
        uint id;
        address creator;
        string title;
        string description;
        mapping(address => bool) users;
        mapping(uint => File) files;
        uint fileCount;
    }
    
    mapping(uint => LegalCase) cases;
    uint public caseCount;
    
    event CaseCreated(uint indexed id, address indexed creator, string title, string description);
    event FileAdded(uint indexed caseId, uint fileId, string fileName, address indexed owner);
    event PermissionChanged(uint indexed caseId, uint fileId, address indexed user, bool hasAccess);
    event AccessGranted(uint indexed caseId, address indexed user);
    event AccessRevoked(uint indexed caseId, address indexed user);
    
    function createCase(string memory title, string memory description) public {
        caseCount++;
        cases[caseCount] = LegalCase(caseCount, msg.sender, title, description);
        emit CaseCreated(caseCount, msg.sender, title, description);
    }
    
    function addFile(uint caseId, string memory fileName) public {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        require(cases[caseId].creator == msg.sender || cases[caseId].users[msg.sender], "You are not authorized to add files to this case");
        
        cases[caseId].fileCount++;
        cases[caseId].files[cases[caseId].fileCount] = File(fileName, msg.sender);
        emit FileAdded(caseId, cases[caseId].fileCount, fileName, msg.sender);
    }
    
    function setFilePermission(uint caseId, uint fileId, address user, bool hasAccess) public {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        require(fileId <= cases[caseId].fileCount && fileId > 0, "Invalid file ID");
        require(cases[caseId].creator == msg.sender || cases[caseId].users[msg.sender], "You are not authorized to change permissions in this case");
        require(cases[caseId].files[fileId].owner == msg.sender, "You are not the owner of this file");
        
        cases[caseId].files[fileId].permissions[user] = hasAccess;
        emit PermissionChanged(caseId, fileId, user, hasAccess);
    }

    function grantAccess(uint caseId, address user) public {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        require(cases[caseId].creator == msg.sender || cases[caseId].users[msg.sender], "You are not authorized to grant access to this case");
        
        cases[caseId].users[user] = true;
        emit AccessGranted(caseId, user);
    }
    
    function revokeAccess(uint caseId, address user) public {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        require(cases[caseId].creator == msg.sender || cases[caseId].users[msg.sender], "You are not authorized to revoke access to this case");
        
        cases[caseId].users[user] = false;
        emit AccessRevoked(caseId, user);
    }

    function getCasesByCreator(address creator) public view returns (uint[] memory) {
        uint[] memory creatorCases = new uint[](caseCount);
        uint count = 0;
        
        for (uint i = 1; i <= caseCount; i++) {
            if (cases[i].creator == creator) {
                creatorCases[count] = i;
                count++;
            }
        }
        
        uint[] memory result = new uint[](count);
        for (uint j = 0; j < count; j++) {
            result[j] = creatorCases[j];
        }
        
        return result;
    }
    
    function getFilesByCase(uint caseId) public view returns (File[] memory) {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        
        File[] memory files = new File[](cases[caseId].fileCount);
        
        for (uint i = 1; i <= cases[caseId].fileCount; i++) {
            files[i - 1] = cases[caseId].files[i];
        }
        
        return files;
    }
    
    function getFilePermissions(uint caseId, uint fileId, address user) public view returns (bool) {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        require(fileId <= cases[caseId].fileCount && fileId > 0, "Invalid file ID");
        
        return cases[caseId].files[fileId].permissions[user];
    }

    function getUsersWithFileAccess(uint caseId, uint fileId) public view returns (address[] memory) {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        require(fileId <= cases[caseId].fileCount && fileId > 0, "Invalid file ID");
        
        File storage file = cases[caseId].files[fileId];
        address[] memory usersWithAccess = new address[](cases[caseId].fileCount);
        
        uint count = 0;
        for (uint i = 0; i < cases[caseId].fileCount; i++) {
            address user = address(uint160(i)); // Convert i to address
            if (file.permissions[user]) {
                usersWithAccess[count] = user;
                count++;
            }
        }
        
        address[] memory result = new address[](count);
        for (uint j = 0; j < count; j++) {
            result[j] = usersWithAccess[j];
        }
        
        return result;
    }
}
