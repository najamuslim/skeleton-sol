// components/Skeleton.tsx
import React, { useEffect, useState } from "react";

interface Transaction {
  signature: string;
  timestamp: string | null;
  from: string;
  amount: string;
}

interface SkeletonProps {
  style?: React.CSSProperties;
}

const Recent: React.FC<SkeletonProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/recent-transactions");
        const data = await response.json();
        console.log(data);
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || transactions.length === 0) {
    return null;
  }

  const getTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return "Unknown";
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1m ago";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1h ago";
    return `${hours}h ago`;
  };

  return (
    <div className="absolute top-36 right-20 text-black">
      <div className="bg-[#FFFFFF] py-3 px-3 w-[24rem]">
        <span>{`>>>>>`}</span>
        <p className="font-bold text-xl">Recent Input</p>
        <hr className="border border-black my-4" />
        <div className="flex justify-between font-bold">
          <p>Time</p>
          <p>From</p>
          <p>Amount</p>
        </div>
        {transactions.map((tx, index) => (
          <div key={index} className="flex justify-between font-bold my-2">
            <p>{getTimeAgo(tx.timestamp)}</p>
            <p className="w-1/3 truncate">{tx.from}</p>
            <p>{Number(tx.amount).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent;
