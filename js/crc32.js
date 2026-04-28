// Simple CRC32 implementation for data integrity checking
const CRC32 = (() => {
  const table = new Uint32Array(256);

  // Initialize CRC32 table
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }

  return {
    calculate: (str) => {
      let crc = 0 ^ (-1);
      for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
      }
      return (crc ^ (-1)) >>> 0;
    },

    verify: (str, checksum) => {
      return CRC32.calculate(str) === checksum;
    }
  };
})();
