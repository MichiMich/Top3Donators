// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Top3Donators {
    //the mapping itself holds all data which interacted and spend eth -> need to check, erc721 maybe already has this
    mapping(address => uint256) mapSpentAmount;

    struct donators {
        address donatorAddress;
        uint256 donatorValue;
    }

    event topDonatorsUpdate(donators[3] newTop3Donators);

    //defined nr of topDonators=3, contract could be adapted with constructur and pushing alements on deploying, but rank arrangement would need to be changed then
    donators[3] topDonators;

    function donate() public payable {
        require(msg.value >= 1e15, "amount to low, spend at least 0.001eth");
        uint256 lengthTopDonators = topDonators.length; //gas reducing by linking it here and not checking .length multiple times
        //check if address already exists
        if (mapSpentAmount[msg.sender] != 0) {
            //already interacted and send value, so we need to sum up
            mapSpentAmount[msg.sender] += msg.value;

            //search if already exists in top3
            uint256 foundIndexOfDonator = 0;
            for (
                foundIndexOfDonator;
                foundIndexOfDonator < lengthTopDonators;
                ++foundIndexOfDonator
            ) {
                if (
                    topDonators[foundIndexOfDonator].donatorAddress ==
                    msg.sender
                ) {
                    //found under top3
                    break;
                }
            }
            if (foundIndexOfDonator < lengthTopDonators) {
                //update existing
                topDonators[foundIndexOfDonator].donatorValue = mapSpentAmount[
                    msg.sender
                ];
                //update needs to lead to reorganizing
                if (msg.sender != topDonators[0].donatorAddress) {
                    //reorganisation only needed if updated one is not on top place
                    reorganizeDonators();
                }
                return;
            }
        } else {
            mapSpentAmount[msg.sender] = msg.value;
        }

        //check if new spend amount is in the range of the first 3
        if (
            mapSpentAmount[msg.sender] > topDonators[0].donatorValue ||
            mapSpentAmount[msg.sender] > topDonators[1].donatorValue ||
            mapSpentAmount[msg.sender] > topDonators[2].donatorValue
        ) {
            addNewHighestDonator();
        }
    }

    function reorganizeDonators() private {
        donators memory tmp;

        //find highest value
        for (uint256 j = 0; j < 2; j++) {
            //there can only be one who does not fit in the sequence, so we can archive this by if and else if
            if (topDonators[2].donatorValue > topDonators[0].donatorValue) {
                tmp = topDonators[0];
                topDonators[0] = topDonators[2];
                topDonators[2] = tmp;
            }
            if (topDonators[2].donatorValue > topDonators[1].donatorValue) {
                tmp = topDonators[1];
                topDonators[1] = topDonators[2];
                topDonators[2] = tmp;
            }
            if (topDonators[1].donatorValue > topDonators[0].donatorValue) {
                tmp = topDonators[0];
                topDonators[0] = topDonators[1];
                topDonators[1] = tmp;
            }
        }

        emit topDonatorsUpdate(topDonators);
    }

    function addNewHighestDonator() private {
        //check what rank needs to be updated, first come first serve, if you spend as much as nr1 you wont become nr1
        if (mapSpentAmount[msg.sender] > topDonators[0].donatorValue) {
            //sender not in list yet, reorder all, [2] gets kicked out
            topDonators[2].donatorValue = topDonators[1].donatorValue;
            topDonators[2].donatorAddress = topDonators[1].donatorAddress;

            topDonators[1].donatorValue = topDonators[0].donatorValue;
            topDonators[1].donatorAddress = topDonators[0].donatorAddress;

            topDonators[0].donatorValue = mapSpentAmount[msg.sender];
            topDonators[0].donatorAddress = msg.sender;
        } else if (mapSpentAmount[msg.sender] > topDonators[1].donatorValue) {
            topDonators[2].donatorValue = topDonators[1].donatorValue;
            topDonators[2].donatorAddress = topDonators[1].donatorAddress;

            topDonators[1].donatorValue = mapSpentAmount[msg.sender];
            topDonators[1].donatorAddress = msg.sender;
        } else if (mapSpentAmount[msg.sender] > topDonators[2].donatorValue) {
            topDonators[2].donatorValue = mapSpentAmount[msg.sender];
            topDonators[2].donatorAddress = msg.sender;
        }

        emit topDonatorsUpdate(topDonators);
    }

    function getHighestDonators() public view returns (donators[3] memory) {
        return (topDonators);
    }

    function getMySpendAmount() public view returns (uint256) {
        return mapSpentAmount[msg.sender];
    }

    function getSpendAmountOfGivenAddress(address _walletAddress)
        public
        view
        returns (uint256)
    {
        require(_walletAddress != address(0), "null address given");
        return (mapSpentAmount[_walletAddress]);
    }
}
