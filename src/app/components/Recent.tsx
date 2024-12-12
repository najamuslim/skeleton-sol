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
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/recent-transactions");
        const data = await response.json();

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("Invalid data format:", data);
          setTransactions([]);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 60000);
    return () => clearInterval(interval);
  }, []);

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

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-36 right-20 text-black">
      <div className="flex flex-col">
        <div className="bg-white shadow-lg">
          <button 
            onClick={() => setActive(!isActive)}
            className="px-3 py-1 hover:bg-gray-100 w-full text-left"
          >
            <span className={`
              inline-block transition-transform duration-300
              ${isActive ? 'rotate-180' : ''}
            `}>
              {`>>>`}
            </span>
          </button>
          <div className="px-4 pb-2">
            <p className="font-bold text-xl">Recent Input</p>
          </div>
        </div>

        <div 
          className={`
            bg-white shadow-lg
            transform transition-all duration-300 ease-in-out
            ${isActive 
              ? 'translate-x-0 opacity-100 h-auto' 
              : 'translate-x-[24rem] opacity-0 h-0'
            }
            overflow-hidden
          `}
        >
          <div className="w-[24rem] px-4 pb-4">
            <hr className="border border-black my-4" />
            <div className="flex justify-between font-bold">
              <p>Time</p>
              <p>From</p>
              <p>Amount</p>
            </div>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex justify-between font-bold my-2"
                >
                  <p>{getTimeAgo(tx.timestamp)}</p>
                  <p className="w-1/3 truncate">{tx.from}</p>
                  <p>{Number(tx.amount).toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-center my-4">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent;
