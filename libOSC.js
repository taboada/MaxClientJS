function libOSC(bc){
    this.KOMMA = 44;
    this.ZERO = 0;
    this.byteConverter = bc;
};

/** ----- CREATE OSC MSG TO OUTPUT ----- **/

libOSC.prototype.createOSCMsg = function(address,typeArray,valueArray){
    var byteArray = [];

    byteArray = this.concatAndAlign(byteArray,this.byteConverter.stringToByte(address));
    byteArray.push(this.KOMMA);
    byteArray = this.concatAndAlign(byteArray,this.byteConverter.stringToByte(typeArray.join("")));

    for(var i = 0; i < typeArray.length; i++){
        if(typeArray[i] == "i"){
            // 32 bit int
            byteArray = byteArray.concat(this.byteConverter.int32ToByte(valueArray[i]));
        } else if(typeArray[i] == "f"){
            // 32 bit float
            byteArray = byteArray.concat(this.byteConverter.float32ToByte(valueArray[i]));
        } else if(typeArray[i] == "s"){
            // string
            byteArray = this.concatAndAlign(byteArray,this.byteConverter.stringToByte(valueArray[i]));
        } else if(typeArray[i] == "h"){
            // BigInt
            byteArray = byteArray.concat(this.byteConverter.int64ToByte(valueArray[i]));
        }
    }
    return byteArray;
};

libOSC.prototype.concatAndAlign = function(baseArray,scndArray){
    baseArray = baseArray.concat(scndArray);
    return this.fillToFour(baseArray);
}

libOSC.prototype.fillToFour = function(array){
    for(var needPadding = array.length % 4;needPadding < 4; needPadding++){
        array.push(0);
    }
    return array;
};


/** ----- PARSE INCOMING OSC MESSAGES ----- **/

libOSC.prototype.parseOSCMsg = function(message){

    // initiliaze result & index offset
    var result = {};
    var offset = 0;

    // read in address pattern
    var tempResult = this.parseAddressPattern(message, offset);

    offset = tempResult.index;
    offset = this.align(offset);
    result.address = tempResult.result;

    // read in typeflags
    tempResult = this.parseTypeFlags(message,offset);

    offset = tempResult.index;
    offset = this.align(offset);
    result.typeFlags = tempResult.typeFlags;

    // read in values
    tempResult = this.parseValues(message,offset,result.typeFlags);

    result.values = tempResult;

    return result;    
};

libOSC.prototype.align = function(index){
    return index + 4 - (index %4);
};

libOSC.prototype.parseAddressPattern = function(message, offset){
    return this.byteConverter.stringFromBytes(message,offset);

};

libOSC.prototype.parseTypeFlags = function(message, offset){
    var result = new Array();
    var currentChar = -1;

    if(message[offset] == this.KOMMA){
        offset += 1;

        while(currentChar != this.ZERO){
            result.push(String.fromCharCode(message[offset]));
            offset += 1;
            currentChar = message[offset];
        }
        return {"typeFlags" : result, "index" : offset};
    }
};

libOSC.prototype.parseValues = function(message,offset,typeFlags){
    var results =  new Array(typeFlags.length);
    var currentChar = -1;

    for(var i = 0; i < typeFlags.length; i++){
        var flag = typeFlags[i];

        if(flag == "i"){ // 32 bit int
            results[i] = this.byteConverter.int32FromBytes(message,offset);
             offset = offset + 4;

        } else if(flag == "s"){// string
            var tempStringResult = this.byteConverter.stringFromBytes(message,offset);
            results[i] = tempStringResult.result;
            offset = tempStringResult.index;
            offset = this.align(offset);

        } else if(flag == "f"){ // 32 bit float
            results[i] = this.byteConverter.float32FromBytes(message,offset);
            offset = offset + 4;
            
        } else if(flag == "h"){ // 64 Bit int
            results[i] = this.byteConverter.int64FromBytes(message,offset);
            offset = offset + 8;

        }else{
            console.log(flag);
            //TODO 
            //rest of parsing see specifications on osc website
        }
    }   
    return results;
};


