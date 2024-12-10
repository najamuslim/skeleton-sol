"use client";
import { useState, useEffect } from "react";
import Flower from "./components/Skeleton";
import CanvasSkeletons from "./components/CanvasSkeletons";
import Skeleton from "./components/Skeleton";
import Navbar from "./components/Navbar";
import Recent from "./components/Recent";

export default function Home() {
  const [holders, setHolders] = useState<
    Array<{ wallet: string; balance: number }>
  >([]);
  const dummyHolders = [
    { wallet: '5Q54YBBx7STWXAAUHjAE8CCXHXWNZD4wJctSexZ1dYga', balance: 850 },
    { wallet: 'F7z9vP6dxVNjMbZmVv8Zf6sPtZBR9CVpi7DprqTT2u9k', balance: 765 },
    { wallet: 'FHMx5kbD12HpL6yZG9msEzH88bwnySh6zULuRPR8zdg6', balance: 150 },
    { wallet: 'F7czWJk2z3NqV2G7dc5gXNU7d2sJmcLnvwJ5jxzzH2rQ', balance: 310 },
    { wallet: '4Tt8XBBwDJj9w7X7MeYcveG1QZpT6r4exRhnU92Dbm8K', balance: 485 },
    { wallet: '3GFy9W3LX5NjX7qRrCZ6X2PDy4TD3p98RqFwQTLcJ2vX', balance: 920 },
    { wallet: '2JfP9K1dWxY8z7cV5R7hTM9qLZRT6nFJ8XLV8mXz3QB9', balance: 600 },
    { wallet: '9VZX5LRqWY3T7pXZ7MLQY8R3Nj9CcVXJ3TMY5d2RxP8T', balance: 430 },
    { wallet: '7XT5R2Q9LYZJ3cPL8V6KqX5T9R3WpCQ7NL8dM6ZRVTQ3', balance: 300 },
    { wallet: '8M5TL3V2RXNq9ZP7YCQXJ5dL9R7T8V5KCW3NZX6LYT8M', balance: 720 },
    { wallet: '6XY3JN8L5TZRWPC9MVD2Q7YBXKRQJ5NWC7ZXVQL29TY6', balance: 820 },
    { wallet: 'P2RX8QLN7Z3YWK5CVMTLX95ZN8RWXTJLYM6PC94TYBX3', balance: 250 },
    { wallet: 'RX8P2JLNWCTLY3K5Z9MVZBT8QL72XYRWCX9TYM6LP3V8', balance: 910 },
    { wallet: 'T9YZ5CWLXQ8BRJ3V6NM2PLYRX87ZKTWC2MVQNY5JXLBT', balance: 480 },
    { wallet: 'K7ZNTX8Y5LRC9VWQPLMNZ32JXB8TYV6CZ9RT2MYX5WPL', balance: 580 },
    { wallet: '8MWTP7XYC2RZ5VLNJ93QZXPL6RT9YJWCVKXLY2NTZ58R', balance: 320 },
    { wallet: 'Q9WZJLY7XTCM25RVN8PBLXY6L92TX5YMCZ9V7RQBLTPK3', balance: 770 },
    { wallet: '2XYCV5ZTMLN8JPQBRW96TL9VKXYMWZ3RC78QJLNT5Y2RP', balance: 630 },
    { wallet: 'TPX6LM9RV2YLQ83CNWZ5JXBRZT7VKNTYCWXPLNRZ2ML85', balance: 410 },
    { wallet: 'J7W9CZ8TLR5NYQX2PMVYL8ZRWCNXMTVK5TPLYZ392RWJB', balance: 690 },
    { wallet: 'ZXR3TYMC9N2LYJVTW58QBL7XPLT8YNMVYZ6CL9R2PQLKB', balance: 810 },
    { wallet: '5MBQ6PLWJ9ZXYRT2C8V3LYK7NYRXL5QZTY7CT82R9VLMC', balance: 550 },
    { wallet: '7TWRLYXZ58CVZ3NLY2PQL96TYBMLVT8R9JXCYPLT2R7ZN', balance: 360 },
    { wallet: '9YCWX3LYR58ZNTLQVM2JKPWZR7XC5YBLNTVRQ8LYJM2RZ', balance: 920 },
    { wallet: 'LMW9Y2R7VCJPLQ58NTZBRXY8TYCMZX6LWPT9NYRQ2ML8J', balance: 670 },
    { wallet: 'Q58LZCNLYT8JRV6MBPYT9XLZR7QNT2LYW3V9KMCXPL92R', balance: 730 },
    { wallet: 'TBY9ZNRQ8LMVJ32RW9CPL6XTY7QML58CNZXYLR7VTYLZP', balance: 510 },
    { wallet: 'W9YZ5JLRXCM82TLYKV7NQT8PLCYB9MRXZ6TQNTYLWR2JL', balance: 400 },
    { wallet: 'Z3NLRXW9TY7VP2BML58CYTLQJ9CYXZ6LR5NTMVY2RXTBY', balance: 850 },
    { wallet: 'N5QTY8WMCZL2RV9YPJ9R3LXT7NT58LYCZY6MRQTBLNXYW', balance: 720 },
    { wallet: 'J9RWZLYXCVN3PLYT58MYRTZL8XQ2BNT9C6QMVLY5TYPZR', balance: 640 },
    { wallet: 'CVQ8JNT9YW5ZPLX2RMCZT8BMLRQ37YNTX9CZLY6R5VTBY', balance: 500 },
    { wallet: 'T9PQRXYCV6LY8BWLZ3NR7VYMCZ5JNT8QZBLX2MVYC9PLT', balance: 310 },
    { wallet: 'Q7MRZ5TLY8WRY2NXBL9JPYTQMV3LYWT9XCYZR6NTBLMQR', balance: 780 },
    { wallet: 'T58CZRXL9YMNTWRQP7BLZ2VYXTNT5JM2W9CVLYRY3LRZN', balance: 420 },
    { wallet: 'YRM9TLZBLX2V3QJ8CWNTYLY7ZRPT5QLXCNT8RWRYB9YM2', balance: 650 },
    { wallet: 'NRW8YLXTZJMLP9CYZQ5RY27C8BYMLXWRQM92TZ3BNT5YL', balance: 520 },
    { wallet: 'Z6NT7LY8MR5QWPYCLZR3BNTXY9YLVTYQLXC9T58LY2RWM', balance: 810 },
    { wallet: 'T7CYZRNT58MVLY9W2LRBYXTQJ9QNCYLZR5TYMWCXT8NRQ', balance: 910 },
    { wallet: '5LYXRQT8NCM7BWR9ZLT2YL9QNCZ3T58PLYM6VYBXLYMR2', balance: 760 },
    { wallet: 'CVXLT2MRQ9PY7LY9ZLRBYM5T8NCYZ3LW8RQ2VTYLZBYXR', balance: 670 },
    { wallet: '9T5QLMYR7BLX8YZ2CNTZR3RWTQYCZ8VLYPM9YLXRC5TL7', balance: 820 },
    { wallet: 'LT9CVQ2NYM7Z5TLY8WRXQ3RNCBLZ8YT5R9WRQXY2LYTNC', balance: 570 },
    { wallet: 'N9X5LYZR8Q7TWBYL6RQM3PLYT58NZYMCWLRY2ZNCYT9T5', balance: 460 },
    { wallet: 'LMX5ZYLRBT9CWYL8ZRQ27TYNTLZYPMCW9R8V3RYBYT6ZQP', balance: 750 },
  ];
  


  useEffect(() => {
    async function fetchHolders() {
      try {
        const response = await fetch("/api/holders");
        console.log(response);
        const data = await response.json();
        console.log(data);
        setHolders(data);
      } catch (error) {
        console.error("Failed to fetch holders:", error);
      }
    }

    fetchHolders();
  }, []);

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     flexWrap: "wrap",
    //     gap: "20px",
    //     padding: "20px",
    //   }}
    // >
    //   {holders.map(({ wallet, balance }) => (
    //     <div key={wallet} style={{ textAlign: "center" }}>
    //       <Flower wallet={wallet} size={50 + Math.sqrt(balance) * 10} />
    //       <p>
    //         {wallet.slice(0, 6)}...{wallet.slice(-4)}
    //       </p>
    //       <p>{balance.toFixed(2)} $FLOWER</p>
    //     </div>
    //   ))}
    // </div>
    <div>
      <Navbar />
      <Skeleton holders={dummyHolders} />
      <Recent />
    </div>
  );
}
