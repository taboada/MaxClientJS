function libOSC(){
    this.KOMMA = 44;
    this.ZERO = 0;
};

/** ----- CREATE OSC MSG TO OUTPUT ----- **/

libOSC.prototype.createOSCMsg = function(address,typeArray,valueArray){
    var byteArray = [];

    byteArray = this.pushString(byteArray,address);
    byteArray.push(this.KOMMA);
    byteArray = this.pushString(byteArray,typeArray.join(""));

    for(var i = 0; i < typeArray.length; i++){
        if(typeArray[i] == "i"){
            // 32 bit int
            byteArray = this.pushInt(byteArray,valueArray[i]);
        } else if(typeArray[i] == "f"){
            // 32 bit float
            byteArray = this.pushFloat(byteArray,valueArray[i]);
        } else if(typeArray[i] == "s"){
            // string
            byteArray = this.pushString(byteArray,valueArray[i]);
        } else if(typeArray[i] == "h"){
            // BigInt
            byteArray = byteArray.concat(valueArray[i].toByteArray());
        }
    }

    return byteArray;
};

libOSC.prototype.fillToFour = function(array){
    for(var needPadding = array.length % 4;needPadding < 4; needPadding++){
        array.push(0);
    }
    return array;
};

// push a given string to a given array
libOSC.prototype.pushString = function (array,string){
    for(var i = 0; i < string.length; i++){
        array.push(string.charCodeAt(i));
    }
    return this.fillToFour(array);
};

libOSC.prototype.pushInt = function (array,value){
    var arrayLength = array.length;
    for(var j = 3; j >= 0; --j){
        temp = (value & 255);
        value = value >> 8;
        array[arrayLength + j] = temp;
    }
    return array;
};

libOSC.prototype.pushFloat = function(array,value){
    array = this.pushInt(array,this.float_to_bits(value));
    return array;
};

libOSC.prototype.float_to_bits = function(f){
    var sign_bit = (f < 0) ? 1 : 0;
    var exp_temp = 0;
    var exponent = 0;
    var mantissa = 0;
    var man_temp = 0;
    var bits_as_int = 0;
    
    f = Math.abs(f);
    
    if (f >= 1) {
        exp_temp = Math.log(f) / Math.log(2);
        exp_temp = Math.floor(exp_temp);
    } else {
        exp_temp = Math.log(1/f) / Math.log(2);
        exp_temp = - Math.floor(exp_temp);
    }
    
    exponent = exp_temp + 127;
    man_temp = f * (1 << (23 - exp_temp));
    mantissa = Math.floor(man_temp);
    
    bits_as_int = (sign_bit << 31) |(exponent << 23)| (mantissa & ((1 << 23) - 1));

    return bits_as_int;
};

/** ----- PARSE INCOMING OSC MESSAGES ----- **/

libOSC.prototype.parseOSCMsg = function(message){

    // initiliaze result & index counter
    var result = {};
    var currentIndex = 0;

    // read in address pattern
    var tempResult = this.parseAddressPattern(message, currentIndex);

    currentIndex = tempResult.index;
    currentIndex = this.align(currentIndex);
    result.address = tempResult.result;

    // read in typeflags
    tempResult = this.parseTypeFlags(message,currentIndex);

    currentIndex = tempResult.index;
    currentIndex = this.align(currentIndex);
    result.typeFlags = tempResult.typeFlags;

    // read in values
    tempResult =  this.parseValues(message,currentIndex,result.typeFlags);

    result.values = tempResult;

    return result;    
};

libOSC.prototype.align = function(index){
    return index + 4 - (index %4);
};

libOSC.prototype.parseAddressPattern = function(message, currentIndex){
    return this.stringFromBytes(message,currentIndex);

};

libOSC.prototype.parseTypeFlags = function(message, currentIndex){
    var result = new Array();
    var currentChar = -1;

    if(message[currentIndex] == this.KOMMA){
        currentIndex += 1;

        while(currentChar != this.ZERO){
            result.push(String.fromCharCode(message[currentIndex]));
            currentIndex += 1;
            currentChar = message[currentIndex];
        }
        return {"typeFlags" : result, "index" : currentIndex};
    }
};

libOSC.prototype.parseValues = function(message,currentIndex,typeFlags){
    var results =  new Array(typeFlags.length);
    var currentChar = -1;

    for(var i = 0; i < typeFlags.length; i++){
        var flag = typeFlags[i];

        if(flag == "i"){ // 32 bit int
            results[i] = (this.intFromBytes(message,currentIndex,currentIndex+4));
            currentIndex = this.align(currentIndex);

        } else if(flag == "s"){// string
            var tempStringResult = this.stringFromBytes(message,currentIndex);
            results[i] = tempStringResult.result;
            currentIndex = tempStringResult.index;
            currentIndex = this.align(currentIndex);

        } else if(flag == "f"){ // 32 bit float
            results[i] = this.floatFromBytes(message,currentIndex,currentIndex+4);
            currentIndex = this.align(currentIndex);
            
        } else if(flag == "h"){ // 64 Bit int
            var int64 =  new BigInt();
            int64.fromByteArray(message.slice(currentIndex,currentIndex + 8));
            results[i] = int64;
            currentIndex = this.align(this.align(currentIndex));

        }else{
            console.log(flag);
            //TODO 
            //rest of parsing see specifications on osc website
        }
    }
        
    return results;
};

libOSC.prototype.stringFromBytes = function(message,currentIndex){
    var result = "";
    var currentChar = -1;

    while(currentChar != this.ZERO){
        result += String.fromCharCode(message[currentIndex]);
        currentIndex += 1;
        currentChar = message[currentIndex];
    }
    return {"result" : result, "index" : currentIndex};
};

libOSC.prototype.intFromBytes = function(message,firstIndex,secondIndex){
    var result = 0;
    for (var i = firstIndex; i < secondIndex;i++){        
        result += message[i];       
        if (i < secondIndex-1) {
            result = result << 8;
        }
    }
    return result;
};

libOSC.prototype.floatFromBytes = function(array,firstIndex,secondIndex){
    var byteArray = new Array();
    for(var i = firstIndex; i < secondIndex; i++){
        byteArray.push(array[i]);
    }
    return (this.parseSign(byteArray) * this.parseExponent(byteArray) * this.parseSignificand(byteArray)).toFixed(6);
};

libOSC.prototype.parseSign = function (byteArray){
    if(byteArray[0] & 0x80){
        return -1;
    }
    return 1;
};

libOSC.prototype.parseExponent = function parseExponent(byteArray){
    var ex = (byteArray[0] & 0x7F) << 1;            
    if(0 != (byteArray[1] & 0x80)){
        ex += 0x01;
    }
    
    ex = Math.pow(2, ex-127);
    return ex;
};

libOSC.prototype.parseSignificand = function(byteArray){
    var num = 0;
    var bit;

    var mask = 0x40;
    for(var i = 1; i < 8; i++){
        if(0 != (byteArray[1] & mask)){ 
            num += 1 / Math.pow(2, i);
        }
        mask = mask >> 1;
    }

    mask = 0x80;
    for(var j = 0; j < 8; j++){
        if(0 != (byteArray[2] & mask)){
            num += 1 / Math.pow(2, j + 8);
        }
        mask = mask >> 1;
    }

    mask = 0x80;
    for(var k = 0; k < 8; k++){
        if(0 != (byteArray[2] & mask)){
            num += 1 / Math.pow(2, k + 16);
        }
        mask = mask >> 1;
    }
    return (num+1);
};
