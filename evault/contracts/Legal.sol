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
        mapping(address => bool) users;
        mapping(uint => File) files;
        uint fileCount;
    }
    
    mapping(uint => LegalCase) cases;
    uint public caseCount;
    
    event CaseCreated(uint indexed id, address indexed creator);
    event FileAdded(uint indexed caseId, uint fileId, string fileName, address indexed owner);
    event PermissionChanged(uint indexed caseId, uint fileId, address indexed user, bool canRead, bool canWrite);
    
    function createCase() public {
        caseCount++;
        cases[caseCount] = LegalCase(caseCount, msg.sender, 0);
        emit CaseCreated(caseCount, msg.sender);
    }
    
    function addFile(uint caseId, string memory fileName) public {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        require(cases[caseId].creator == msg.sender || cases[caseId].users[msg.sender], "You are not authorized to add files to this case");
        
        cases[caseId].fileCount++;
        cases[caseId].files[cases[caseId].fileCount] = File(fileName, msg.sender);
        emit FileAdded(caseId, cases[caseId].fileCount, fileName, msg.sender);
    }
    
    function setFilePermission(uint caseId, uint fileId, address user, bool canRead, bool canWrite) public {
        require(caseId <= caseCount && caseId > 0, "Invalid case ID");
        require(fileId <= cases[caseId].fileCount && fileId > 0, "Invalid file ID");
        require(cases[caseId].creator == msg.sender || cases[caseId].users[msg.sender], "You are not authorized to change permissions in this case");
        require(cases[caseId].files[fileId].owner == msg.sender, "You are not the owner of this file");
        
        cases[caseId].files[fileId].permissions[user] = canRead || canWrite;
        emit PermissionChanged(caseId, fileId, user, canRead, canWrite);
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
