//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;
 
contract BlockTrustSupermarket{
    event CheckOutReceipt(address indexed buyer, string[] items, uint256 totalPrice, string homeAddress, bool discount);
    string[] public merch = ["T-Shirt", "Hoodie", "Jacket", "Short", "Trouser", "KeyHolder", "Socks", "Trainers"]; 
    uint256[] public prices = [1e17,5e17,1e18,1e17,2e17,1e15,3e15,2e17];
    
    mapping(string => uint256) public checkMerch;
    constructor() {
        uint i = 0;
        while (i <= merch.length-1){
            checkMerch[merch[i]] = prices[i];
            i++;
        }
    }

    function checkOut(string[] memory _items, uint256[] memory _quantity, string memory _homeAddress) external returns (uint256 totalPrice){
        require (_items.length >= 3, "You need to purchase at least 3 items");
        require (_items.length == _quantity.length,"Specify the amount of each of the items you need");
        bool discount;
        totalPrice = 0;
        uint i = 0;
        while (i <= _items.length-1){
            
            if (keccak256(abi.encodePacked(_items[i])) == keccak256(abi.encodePacked("Jacket")) && _quantity[i] > 1) {
                discount = true;
                uint256 price = checkMerch[_items[i]];
                uint256 quantity = (price * _quantity[i]) - (price/2);
                totalPrice += quantity;
                i++;
            }

            else{
                uint256 price = checkMerch[_items[i]];
                uint256 quantity = price * _quantity[i];
                totalPrice += quantity;
                i++;
                
            }
           
        }
        emit CheckOutReceipt(msg.sender, _items, totalPrice, _homeAddress, discount);

    }
}
