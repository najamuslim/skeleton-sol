export function getFingers(walletAddress: string, startRange: number, endRange: number) {
  const keySegment = walletAddress.substring(startRange, endRange); 

  // Hitung hash sederhana berdasarkan kode ASCII
  const hashValue = keySegment.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  // Map hash ke appearance
  const appearances = ["1", "2", "3", "4", "5", "6", "7"];
  return appearances[hashValue % appearances.length];
}

export function getDynamicAppearance(walletAddress: string, startRange: number, endRange: number) {
  const keySegment = walletAddress.substring(startRange, endRange); // 23 karena 0-based index

  // Hitung hash sederhana berdasarkan kode ASCII
  const hashValue = keySegment.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  // Map hash ke appearance
  const appearances = ["1", "2", "3", "4", "5"];
  return appearances[hashValue % appearances.length];
}


// Helper function to convert a hex string into a color
export const addressToColor = (
  address: string,
  startRange: number,
  endRange: number
): string => {
  // Slice the address and use part of it as the hex value
  const hex = address.slice(startRange, endRange); // Taking first 6 characters of address
  return `#${stringToHexColor(hex)}`;
};

export function stringToHexColor(str: string): string {
  let hash = 0;

  // Generate a hash from the string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a hex color
  let color = "";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff; // Extract 8 bits
    color += value.toString(16).padStart(2, "0"); // Convert to hex and pad if necessary
  }

  return color;
}

// Helper function to convert a part of the address into a number for x and y
// utils/addressToPosition.ts
export function getGridPosition(
  address: string,
  gridSize: number,
  maxColumns: number
): { x: number; y: number } {
  // Gunakan 8 karakter pertama wallet address sebagai seed
  const seed = parseInt(address.slice(0, 8), 16);

  // Tentukan posisi berdasarkan seed
  const position = seed % (gridSize * gridSize);
  const column = position % maxColumns;
  const row = Math.floor(position / maxColumns);

  // Base size untuk spacing
  const baseSize = 100;

  return {
    x: column * baseSize,
    y: row * baseSize,
  };
}

export function addressToPosition(
  address: string,
  start: number,
  end: number,
  dimension: "width" | "height"
): number {
  const gridPos = getGridPosition(address, 50, 8); // 50 grid size, 8 columns
  return dimension === "width" ? gridPos.x : gridPos.y;
}

// Helper function to convert the address into a size (e.g., within a certain range)
export const addressToSize = (
  address: string,
  minSize: number,
  maxSize: number
): number => {
  const size =
    (parseInt(address.slice(16, 24), 16) % (maxSize - minSize)) + minSize;
  return size;
};

// const dummyHolders = [
//   { wallet: "5Q54YBBx7STWXAAUHjAE8CCXHXWNZD4wJctSexZ1dYga", balance: 0.8 },
//   { wallet: "F7z9vP6dxVNjMbZmVv8Zf6sPtZBR9CVpi7DprqTT2u9k", balance: 765 },
//   { wallet: "FHMx5kbD12HpL6yZG9msEzH88bwnySh6zULuRPR8zdg6", balance: 150 },
//   { wallet: "4Tt8XBBwDJj9w7X7MeYcveG1QZpT6r4exRhnU92Dbm8K", balance: 485 },
//   { wallet: "3GFy9W3LX5NjX7qRrCZ6X2PDy4TD3p98RqFwQTLcJ2vX", balance: 920 },
//   { wallet: "2JfP9K1dWxY8z7cV5R7hTM9qLZRT6nFJ8XLV8mXz3QB9", balance: 600 },
//   { wallet: "9VZX5LRqWY3T7pXZ7MLQY8R3Nj9CcVXJ3TMY5d2RxP8T", balance: 430 },
//   { wallet: "7XT5R2Q9LYZJ3cPL8V6KqX5T9R3WpCQ7NL8dM6ZRVTQ3", balance: 300 },
//   { wallet: "8M5TL3V2RXNq9ZP7YCQXJ5dL9R7T8V5KCW3NZX6LYT8M", balance: 0.7 },
//   { wallet: "F7czWJk2z3NqV2G7dc5gXNU7d2sJmcLnvwJ5jxzzH2rQ", balance: 310 },
//   { wallet: "6XY3JN8L5TZRWPC9MVD2Q7YBXKRQJ5NWC7ZXVQL29TY6", balance: 11 },
//   { wallet: "P2RX8QLN7Z3YWK5CVMTLX95ZN8RWXTJLYM6PC94TYBX3", balance: 250 },
//   { wallet: "RX8P2JLNWCTLY3K5Z9MVZBT8QL72XYRWCX9TYM6LP3V8", balance: 13 },
//   { wallet: "T9YZ5CWLXQ8BRJ3V6NM2PLYRX87ZKTWC2MVQNY5JXLBT", balance: 1000 },
//   { wallet: "K7ZNTX8Y5LRC9VWQPLMNZ32JXB8TYV6CZ9RT2MYX5WPL", balance: 580 },
//   { wallet: "8MWTP7XYC2RZ5VLNJ93QZXPL6RT9YJWCVKXLY2NTZ58R", balance: 320 },
//   { wallet: "Q9WZJLY7XTCM25RVN8PBLXY6L92TX5YMCZ9V7RQBLTPK3", balance: 770 },
//   { wallet: "2XYCV5ZTMLN8JPQBRW96TL9VKXYMWZ3RC78QJLNT5Y2RP", balance: 630 },
//   { wallet: "TPX6LM9RV2YLQ83CNWZ5JXBRZT7VKNTYCWXPLNRZ2ML85", balance: 410 },
//   { wallet: "J7W9CZ8TLR5NYQX2PMVYL8ZRWCNXMTVK5TPLYZ392RWJB", balance: 1 },
//   { wallet: "ZXR3TYMC9N2LYJVTW58QBL7XPLT8YNMVYZ6CL9R2PQLKB", balance: 810 },
//   { wallet: "5MBQ6PLWJ9ZXYRT2C8V3LYK7NYRXL5QZTY7CT82R9VLMC", balance: 2 },
//   { wallet: "7TWRLYXZ58CVZ3NLY2PQL96TYBMLVT8R9JXCYPLT2R7ZN", balance: 360 },
//   { wallet: "9YCWX3LYR58ZNTLQVM2JKPWZR7XC5YBLNTVRQ8LYJM2RZ", balance: 10 },
//   { wallet: "LMW9Y2R7VCJPLQ58NTZBRXY8TYCMZX6LWPT9NYRQ2ML8J", balance: 670 },
//   { wallet: "Q58LZCNLYT8JRV6MBPYT9XLZR7QNT2LYW3V9KMCXPL92R", balance: 730 },
//   { wallet: "TBY9ZNRQ8LMVJ32RW9CPL6XTY7QML58CNZXYLR7VTYLZP", balance: 10 },
//   { wallet: "W9YZ5JLRXCM82TLYKV7NQT8PLCYB9MRXZ6TQNTYLWR2JL", balance: 400 },
//   { wallet: "Z3NLRXW9TY7VP2BML58CYTLQJ9CYXZ6LR5NTMVY2RXTBY", balance: 3 },
//   { wallet: "N5QTY8WMCZL2RV9YPJ9R3LXT7NT58LYCZY6MRQTBLNXYW", balance: 720 },
//   { wallet: "J9RWZLYXCVN3PLYT58MYRTZL8XQ2BNT9C6QMVLY5TYPZR", balance: 10 },
//   {
//     wallet: "D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1",
//     balance: Math.random() * 50000, // Enormous balance
//   },
//   { wallet: "CVQ8JNT9YW5ZPLX2RMCZT8BMLRQ37YNTX9CZLY6R5VTBY", balance: 500 },
//   { wallet: "T9PQRXYCV6LY8BWLZ3NR7VYMCZ5JNT8QZBLX2MVYC9PLT", balance: 310 },
//   { wallet: "Q7MRZ5TLY8WRY2NXBL9JPYTQMV3LYWT9XCYZR6NTBLMQR", balance: 20 },
//   { wallet: "T58CZRXL9YMNTWRQP7BLZ2VYXTNT5JM2W9CVLYRY3LRZN", balance: 420 },
//   { wallet: "YRM9TLZBLX2V3QJ8CWNTYLY7ZRPT5QLXCNT8RWRYB9YM2", balance: 30 },
//   { wallet: "NRW8YLXTZJMLP9CYZQ5RY27C8BYMLXWRQM92TZ3BNT5YL", balance: 520 },
//   { wallet: "Z6NT7LY8MR5QWPYCLZR3BNTXY9YLVTYQLXC9T58LY2RWM", balance: 810 },
//   { wallet: "T7CYZRNT58MVLY9W2LRBYXTQJ9QNCYLZR5TYMWCXT8NRQ", balance: 30 },
//   { wallet: "5LYXRQT8NCM7BWR9ZLT2YL9QNCZ3T58PLYM6VYBXLYMR2", balance: 760 },
//   { wallet: "CVXLT2MRQ9PY7LY9ZLRBYM5T8NCYZ3LW8RQ2VTYLZBYXR", balance: 0.11 },
//   { wallet: "9T5QLMYR7BLX8YZ2CNTZR3RWTQYCZ8VLYPM9YLXRC5TL7", balance: 820 },
//   { wallet: "LT9CVQ2NYM7Z5TLY8WRXQ3RNCBLZ8YT5R9WRQXY2LYTNC", balance: 3 },
//   { wallet: "N9X5LYZR8Q7TWBYL6RQM3PLYT58NZYMCWLRY2ZNCYT9T5", balance: 460 },
//   { wallet: "LMX5ZYLRBT9CWYL8ZRQ27TYNTLZYPMCW9R8V3RYBYT6ZQP", balance: 20 },
//   {
//     wallet: "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9",
//     balance: Math.random() * 30000, // Huge balance
//   },
//   {
//     wallet: "D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1",
//     balance: Math.random() * 1000,
//   },
//   {
//     wallet: "U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2",
//     balance: Math.random() * 10000,
//   },
//   ,
//   {
//     wallet: "V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3",
//     balance: Math.random() * 15000, // Larger balance
//   },
//   {
//     wallet: "W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4",
//     balance: Math.random() * 0.1, // Very small balance
//   },
//   {
//     wallet: "X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5",
//     balance: Math.random() * 20000, // Even larger balance
//   },
//   {
//     wallet: "Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6",
//     balance: Math.random() * 0.01, // Tiny balance
//   },
//   {
//     wallet: "Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7",
//     balance: Math.random() * 25000, // Massive balance
//   },
//   {
//     wallet: "A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8",
//     balance: Math.random() * 0.001, // Microscopic balance
//   },
//   {
//     wallet: "C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0",
//     balance: Math.random() * 0.005, // Very tiny balance
//   },
//   {
//     wallet: "E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2",
//     balance: Math.random() * 0.0001, // Minuscule balance
//   },
// ].filter((holder) => holder !== undefined);
