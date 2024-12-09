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
    { wallet: '4Tt8XBBwDJj9w7X7MeYcveG1QZpT6r4exRhnU92Dbm8K', balance: 485 }
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
    <div className="bg-white">
      <Navbar />
      <Skeleton holders={dummyHolders} />
      <Recent />
    </div>
  );
}
