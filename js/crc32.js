const CRC32 = {
    table: [],
    
    init() {
        if (this.table.length === 0) {
            for (let n = 0; n < 256; n++) {
                let crc = n;
                for (let k = 0; k < 8; k++) {
                    crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
                }
                this.table[n] = crc >>> 0;
            }
        }
    },
    
    calculate(str) {
        this.init();
        let crc = 0 ^ (-1);
        for (let i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ this.table[(crc ^ str.charCodeAt(i)) & 0xff];
        }
        return (crc ^ (-1)) >>> 0;
    },
    
    toHex(num) {
        return ('00000000' + num.toString(16)).slice(-8);
    }
};
