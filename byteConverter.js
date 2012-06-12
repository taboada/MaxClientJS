function ByteConverter(){	
    this.ZERO = 0;
}

ByteConverter.prototype.stringToByte = function (string){
    var array = [];
    for(var i = 0; i < string.length; i++){
        array.push(string.charCodeAt(i));
    }
    return array;
};

ByteConverter.prototype.int32ToByte = function (value){
    var array = [];
    for(var j = 3; j >= 0; --j){
        temp = (value & 255);
        value = value >> 8;
        array[j] = temp;
    }
    return array;
};

ByteConverter.prototype.int64ToByte = function(number){
	var result = this.int32ToByte(number.highWord);
	result = result.concat(this.int32ToByte(number.lowWord));

    return result;
};

ByteConverter.prototype.float32ToByte = function(value){
    return this.int32ToByte(this.float_to_bits(value));
};

ByteConverter.prototype.float_to_bits = function(f){
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


ByteConverter.prototype.stringFromBytes = function(message,offset){
    var result = "";
    var currentChar = -1;

    while(currentChar != this.ZERO){
        result += String.fromCharCode(message[offset]);
        offset += 1;
        currentChar = message[offset];
    }
    return {"result" : result, "index" : offset};
};

ByteConverter.prototype.int32FromBytes = function(message,offset){
    var result = 0;
    for (var i = offset; i < offset + 4;i++){        
        result += message[i];       
        if (i < offset + 3) {
            result = result << 8;
        }
    }
    return result;
};

ByteConverter.prototype.int64FromBytes = function(message,offset){
    if(offset == undefined){
        offset = 0;
    }
	var result = new BigInt();

	result.highWord = this.int32FromBytes(message,offset);
	result.lowWord =  this.int32FromBytes(message,offset + 4); // CHECK INDEX!

	return result;
};

ByteConverter.prototype.float32FromBytes = function(array,offset){
    var byteArray = new Array();
    for(var i = offset; i < offset + 3; i++){
        byteArray.push(array[i]);
    }
    return (this.parseSign(byteArray) * this.parseExponent(byteArray) * this.parseSignificand(byteArray)).toFixed(6);
};

ByteConverter.prototype.parseSign = function (byteArray){
    if(byteArray[0] & 0x80){
        return -1;
    }
    return 1;
};

ByteConverter.prototype.parseExponent = function parseExponent(byteArray){
    var ex = (byteArray[0] & 0x7F) << 1;            
    if(0 != (byteArray[1] & 0x80)){
        ex += 0x01;
    }
    
    ex = Math.pow(2, ex-127);
    return ex;
};

ByteConverter.prototype.parseSignificand = function(byteArray){
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