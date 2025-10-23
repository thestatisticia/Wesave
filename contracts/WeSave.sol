// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title WeSave
 * @dev A comprehensive savings goals management contract with NFT rewards
 * @notice This contract allows users to create, manage savings goals and earn NFT rewards for milestones
 */
contract WeSave is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, ReentrancyGuard, Pausable {
    using Strings for uint256;

    // Events
    event GoalCreated(
        uint256 indexed goalId,
        address indexed user,
        string name,
        string description,
        uint256 targetAmount,
        uint256 deadline,
        string category,
        uint256 timestamp
    );
    
    event DepositMade(
        uint256 indexed goalId,
        address indexed user,
        uint256 amount,
        uint256 newBalance,
        uint256 timestamp
    );
    
    event GoalCompleted(
        uint256 indexed goalId,
        address indexed user,
        uint256 totalAmount,
        uint256 timestamp
    );
    
    event MilestoneReached(
        uint256 indexed goalId,
        address indexed user,
        uint256 milestoneAmount,
        uint256 nftTokenId,
        uint256 timestamp
    );
    
    event GoalDeleted(
        uint256 indexed goalId,
        address indexed user,
        uint256 refundAmount,
        uint256 timestamp
    );
    
    event WithdrawalMade(
        uint256 indexed goalId,
        address indexed user,
        uint256 amount,
        uint256 newBalance,
        uint256 timestamp
    );

    // Structs
    struct Goal {
        uint256 id;
        address owner;
        string name;
        string description;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        string category;
        GoalStatus status;
        uint256 createdAt;
        uint256 completedAt;
        bool exists;
    }

    struct Transaction {
        uint256 id;
        uint256 goalId;
        address user;
        uint256 amount;
        TransactionType transactionType;
        string description;
        uint256 timestamp;
    }

    struct Milestone {
        uint256 goalId;
        uint256 amount;
        bool reached;
        uint256 reachedAt;
        uint256 nftTokenId;
    }

    // Enums
    enum GoalStatus {
        Active,
        Completed,
        Cancelled,
        Expired
    }

    enum TransactionType {
        Deposit,
        Withdrawal
    }

    // State variables
    uint256 private _goalIds;
    uint256 private _transactionIds;
    uint256 private _tokenIds;

    mapping(uint256 => Goal) public goals;
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => Milestone[]) public goalMilestones;
    mapping(address => uint256[]) public userGoals;
    mapping(uint256 => uint256[]) public goalTransactions;
    mapping(address => uint256) public totalDeposited;
    mapping(address => uint256) public totalWithdrawn;
    mapping(address => uint256) public completedGoalsCount;

    // Constants
    uint256 public constant MIN_GOAL_AMOUNT = 0.001 ether;
    uint256 public constant MAX_GOAL_AMOUNT = 100 ether;
    uint256 public constant MIN_DEPOSIT_AMOUNT = 0.001 ether;
    uint256 public constant MAX_DEPOSIT_AMOUNT = 10 ether;
    uint256 public constant MAX_GOALS_PER_USER = 20;
    uint256 public constant MILESTONE_PERCENTAGES = 25; // 25%, 50%, 75%, 100%
    
    // Fee structure (in basis points, 100 = 1%)
    uint256 public constant DEPOSIT_FEE = 0; // No deposit fee
    uint256 public constant WITHDRAWAL_FEE = 50; // 0.5% withdrawal fee
    uint256 public constant COMPLETION_REWARD_FEE = 100; // 1% of goal amount as reward

    // Modifiers
    modifier onlyGoalOwner(uint256 goalId) {
        require(goals[goalId].owner == msg.sender, "Not goal owner");
        require(goals[goalId].exists, "Goal does not exist");
        _;
    }

    modifier validGoalId(uint256 goalId) {
        require(goals[goalId].exists, "Goal does not exist");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        _;
    }

    modifier notExpired(uint256 goalId) {
        require(block.timestamp <= goals[goalId].deadline, "Goal has expired");
        _;
    }

    modifier canWithdraw(uint256 goalId) {
        require(
            goals[goalId].status == GoalStatus.Active || 
            goals[goalId].status == GoalStatus.Cancelled,
            "Cannot withdraw from this goal"
        );
        _;
    }

    constructor() ERC721("WeSave Milestone", "WSM") Ownable(msg.sender) {}

    /**
     * @dev Create a new savings goal
     * @param name Goal name
     * @param description Goal description
     * @param targetAmount Target amount in wei
     * @param deadline Goal deadline timestamp
     * @param category Goal category
     */
    function createGoal(
        string memory name,
        string memory description,
        uint256 targetAmount,
        uint256 deadline,
        string memory category
    ) external whenNotPaused nonReentrant {
        require(bytes(name).length > 0 && bytes(name).length <= 100, "Invalid name length");
        require(bytes(description).length <= 500, "Description too long");
        require(bytes(category).length > 0 && bytes(category).length <= 50, "Invalid category");
        require(targetAmount >= MIN_GOAL_AMOUNT && targetAmount <= MAX_GOAL_AMOUNT, "Invalid target amount");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(userGoals[msg.sender].length < MAX_GOALS_PER_USER, "Too many goals");

        _goalIds += 1;
        uint256 goalId = _goalIds;

        goals[goalId] = Goal({
            id: goalId,
            owner: msg.sender,
            name: name,
            description: description,
            targetAmount: targetAmount,
            currentAmount: 0,
            deadline: deadline,
            category: category,
            status: GoalStatus.Active,
            createdAt: block.timestamp,
            completedAt: 0,
            exists: true
        });

        userGoals[msg.sender].push(goalId);

        // Set up milestones
        _setupMilestones(goalId, targetAmount);

        emit GoalCreated(goalId, msg.sender, name, description, targetAmount, deadline, category, block.timestamp);
    }

    /**
     * @dev Make a                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               to a goal
     * @param goalId Goal ID
     * @param description Transaction description
     */
    function deposit(uint256 goalId, string memory description) 
        external 
        payable 
        validGoalId(goalId) 
        onlyGoalOwner(goalId) 
        notExpired(goalId)
        whenNotPaused 
        nonReentrant 
    {
        require(msg.value >= MIN_DEPOSIT_AMOUNT && msg.value <= MAX_DEPOSIT_AMOUNT, "Invalid deposit amount");
        require(goals[goalId].status == GoalStatus.Active, "Goal not active");
        require(bytes(description).length <= 200, "Description too long");
        
        // Check if deposit would exceed target
        require(
            goals[goalId].currentAmount + msg.value <= goals[goalId].targetAmount,
            "Deposit would exceed target amount"
        );

        // Update goal
        goals[goalId].currentAmount += msg.value;
        totalDeposited[msg.sender] += msg.value;

        // Create transaction record
        _transactionIds += 1;
        uint256 transactionId = _transactionIds;

        transactions[transactionId] = Transaction({
            id: transactionId,
            goalId: goalId,
            user: msg.sender,
            amount: msg.value,
            transactionType: TransactionType.Deposit,
            description: description,
            timestamp: block.timestamp
        });

        goalTransactions[goalId].push(transactionId);

        emit DepositMade(goalId, msg.sender, msg.value, goals[goalId].currentAmount, block.timestamp);

        // Check for milestones and goal completion
        _checkMilestonesAndCompletion(goalId);
    }

    /**
     * @dev Withdraw from a goal (with penalty)
     * @param goalId Goal ID
     * @param amount Amount to withdraw
     * @param description Withdrawal description
     */
    function withdraw(
        uint256 goalId,
        uint256 amount,
        string memory description
    ) 
        external 
        validGoalId(goalId) 
        onlyGoalOwner(goalId) 
        canWithdraw(goalId)
        validAmount(amount)
        whenNotPaused 
        nonReentrant 
    {
        require(amount <= goals[goalId].currentAmount, "Insufficient balance");
        require(bytes(description).length <= 200, "Description too long");

        // Calculate withdrawal fee
        uint256 fee = (amount * WITHDRAWAL_FEE) / 10000;
        uint256 netAmount = amount - fee;

        // Update goal
        goals[goalId].currentAmount -= amount;
        totalWithdrawn[msg.sender] += amount;

        // Create transaction record
        _transactionIds += 1;
        uint256 transactionId = _transactionIds;

        transactions[transactionId] = Transaction({
            id: transactionId,
            goalId: goalId,
            user: msg.sender,
            amount: amount,
            transactionType: TransactionType.Withdrawal,
            description: description,
            timestamp: block.timestamp
        });

        goalTransactions[goalId].push(transactionId);

        // Transfer funds
        payable(msg.sender).transfer(netAmount);
        
        // Transfer fee to owner (optional: can be sent to treasury)
        if (fee > 0) {
            payable(owner()).transfer(fee);
        }

        emit WithdrawalMade(goalId, msg.sender, amount, goals[goalId].currentAmount, block.timestamp);
    }

    /**
     * @dev Complete a goal manually (if reached target)
     * @param goalId Goal ID
     */
    function completeGoal(uint256 goalId) 
        external 
        validGoalId(goalId) 
        onlyGoalOwner(goalId) 
        whenNotPaused 
    {
        require(goals[goalId].status == GoalStatus.Active, "Goal not active");
        require(goals[goalId].currentAmount >= goals[goalId].targetAmount, "Goal not reached");

        uint256 completionAmount = goals[goalId].currentAmount;
        
        goals[goalId].status = GoalStatus.Completed;
        goals[goalId].completedAt = block.timestamp;
        completedGoalsCount[msg.sender]++;

        // Automatically transfer funds back to user upon completion
        if (completionAmount > 0) {
            goals[goalId].currentAmount = 0; // Reset current amount
            payable(msg.sender).transfer(completionAmount);
        }

        // Mint completion NFT
        _tokenIds += 1;
        uint256 tokenId = _tokenIds;
        _safeMint(msg.sender, tokenId);
        
        string memory uri = string(abi.encodePacked(
            "https://wesave.app/api/nft/",
            goalId.toString(),
            "/completion"
        ));
        _setTokenURI(tokenId, uri);

        emit GoalCompleted(goalId, msg.sender, completionAmount, block.timestamp);
    }

    /**
     * @dev Delete a goal and withdraw remaining balance
     * @param goalId Goal ID
     */
    function deleteGoal(uint256 goalId) 
        external 
        validGoalId(goalId) 
        onlyGoalOwner(goalId) 
        whenNotPaused 
        nonReentrant 
    {
        require(
            goals[goalId].status == GoalStatus.Active || 
            goals[goalId].status == GoalStatus.Cancelled,
            "Cannot delete this goal"
        );

        uint256 refundAmount = goals[goalId].currentAmount;
        
        // Update goal status
        goals[goalId].status = GoalStatus.Cancelled;
        
        // Remove from user's goals list
        _removeGoalFromUserList(msg.sender, goalId);

        // Refund remaining balance
        if (refundAmount > 0) {
            payable(msg.sender).transfer(refundAmount);
        }

        emit GoalDeleted(goalId, msg.sender, refundAmount, block.timestamp);
    }

    /**
     * @dev Check and update expired goals
     * @param goalId Goal ID
     */
    function checkExpiredGoal(uint256 goalId) 
        external 
        validGoalId(goalId) 
        onlyGoalOwner(goalId) 
    {
        require(goals[goalId].status == GoalStatus.Active, "Goal not active");
        require(block.timestamp > goals[goalId].deadline, "Goal not expired");

        goals[goalId].status = GoalStatus.Expired;
    }

    // View functions
    function getGoal(uint256 goalId) external view returns (Goal memory) {
        require(goals[goalId].exists, "Goal does not exist");
        return goals[goalId];
    }

    function getUserGoals(address user) external view returns (uint256[] memory) {
        return userGoals[user];
    }

    function getGoalTransactions(uint256 goalId) external view returns (uint256[] memory) {
        return goalTransactions[goalId];
    }

    function getTransaction(uint256 transactionId) external view returns (Transaction memory) {
        require(transactions[transactionId].id != 0, "Transaction does not exist");
        return transactions[transactionId];
    }

    function getGoalMilestones(uint256 goalId) external view returns (Milestone[] memory) {
        return goalMilestones[goalId];
    }

    function getUserStats(address user) external view returns (
        uint256 totalGoals,
        uint256 completedGoals,
        uint256 totalDeposits,
        uint256 totalWithdrawals,
        uint256 activeGoals
    ) {
        totalGoals = userGoals[user].length;
        completedGoals = completedGoalsCount[user];
        totalDeposits = totalDeposited[user];
        totalWithdrawals = totalWithdrawn[user];
        
        // Count active goals
        for (uint256 i = 0; i < userGoals[user].length; i++) {
            if (goals[userGoals[user][i]].status == GoalStatus.Active) {
                activeGoals++;
            }
        }
    }

    function getContractStats() external view returns (
        uint256 totalGoals,
        uint256 totalUsers,
        uint256 totalVolume,
        uint256 totalNFTsMinted
    ) {
        totalGoals = _goalIds;
        totalVolume = address(this).balance;
        totalNFTsMinted = _tokenIds;
        
        // Note: totalUsers would require additional tracking
        totalUsers = 0; // Placeholder
    }

    // Internal functions
    function _setupMilestones(uint256 goalId, uint256 targetAmount) internal {
        uint256 milestoneAmount = targetAmount / 4; // 25%, 50%, 75%, 100%
        
        for (uint256 i = 0; i < 4; i++) {
            goalMilestones[goalId].push(Milestone({
                goalId: goalId,
                amount: milestoneAmount * (i + 1),
                reached: false,
                reachedAt: 0,
                nftTokenId: 0
            }));
        }
    }

    function _checkMilestonesAndCompletion(uint256 goalId) internal {
        Milestone[] storage milestones = goalMilestones[goalId];
        uint256 currentAmount = goals[goalId].currentAmount;
        
        // Check milestones
        for (uint256 i = 0; i < milestones.length; i++) {
            if (!milestones[i].reached && currentAmount >= milestones[i].amount) {
                milestones[i].reached = true;
                milestones[i].reachedAt = block.timestamp;
                
                // Mint milestone NFT
                _tokenIds += 1;
                uint256 tokenId = _tokenIds;
                _safeMint(goals[goalId].owner, tokenId);
                
                string memory uri = string(abi.encodePacked(
                    "https://wesave.app/api/nft/",
                    goalId.toString(),
                    "/milestone/",
                    (i + 1).toString()
                ));
                _setTokenURI(tokenId, uri);
                
                milestones[i].nftTokenId = tokenId;
                
                emit MilestoneReached(goalId, goals[goalId].owner, milestones[i].amount, tokenId, block.timestamp);
            }
        }
        
        // Check goal completion
        if (currentAmount >= goals[goalId].targetAmount && goals[goalId].status == GoalStatus.Active) {
            goals[goalId].status = GoalStatus.Completed;
            goals[goalId].completedAt = block.timestamp;
            completedGoalsCount[goals[goalId].owner]++;
            
            // Automatically transfer funds back to user upon completion
            if (currentAmount > 0) {
                goals[goalId].currentAmount = 0; // Reset current amount
                payable(goals[goalId].owner).transfer(currentAmount);
            }
            
            emit GoalCompleted(goalId, goals[goalId].owner, currentAmount, block.timestamp);
        }
    }

    function _removeGoalFromUserList(address user, uint256 goalId) internal {
        uint256[] storage userGoalList = userGoals[user];
        for (uint256 i = 0; i < userGoalList.length; i++) {
            if (userGoalList[i] == goalId) {
                userGoalList[i] = userGoalList[userGoalList.length - 1];
                userGoalList.pop();
                break;
            }
        }
    }

    // Required disambiguation overrides for multiple inheritance
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Emergency functions (only owner)
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    // Receive function to accept ETH
    receive() external payable {
        // Allow contract to receive ETH for deposits
    }
}
