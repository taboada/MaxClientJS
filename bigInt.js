var fill = ["","0","00","000","0000","00000","0000000","0000000"];

function BigInt(){
	this.highWord = 0;
	this.lowWord = 0;
}

BigInt.prototype.toString = function(){
	var string = this.highWord + ":" + this.lowWord;
	return string;
};

BigInt.prototype.toHex = function(){
	var highHex = this.highWord.toString(16);
	var lowHex = this.lowWord.toString(16);

	return "0x" + fill[8 - highHex.length] + highHex + fill[8 - lowHex.length] + lowHex;
};

BigInt.prototype.fromByteArray = function(array){
	this.highWord = this.int32FromBytes(array,0,4);
	this.lowWord =  this.int32FromBytes(array,5,8);
};

BigInt.prototype.int32FromBytes = function(array,firstIndex,secondIndex){
	var result = 0;
    for (var i = firstIndex; i < secondIndex;i++){        
        result += array[i];       
        if (i < secondIndex-1) {
            result = result << 8;
        }
    }
    return result;
};

BigInt.prototype.toByteArray = function(){
	var result = new Array(4);
	var value = this.highWord;
	var temp = 0;

	for(var j = 3; j >= 0; --j){
        temp = (value & 255);
        value = value >> 8;
        result[j] = temp;
    }

    value = this.lowWord;
    for(var j = 7; j >= 4; --j){
    	temp = value & 255;
    	value = value >> 8;
    	result[j] = temp;
    }
    return result;
};

BigInt.prototype.isEqual = function(number){
	if(number.highWord == this.highWord && number.lowWord == this.lowWord){
		return true;
	}
	return false;
};

