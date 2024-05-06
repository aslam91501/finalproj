const MyContract = artifacts.require("Evault");

module.exports = function(deployer) {
  deployer.deploy(MyContract, "Evault", "Secure storage for legal documents."); // Pass constructor arguments if required
};