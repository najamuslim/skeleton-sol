/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

// Cache setup
let cachedTransactions: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds cache
const RECENT_TRANSACTIONS_LIMIT = 7;

export async function GET() {
  try {
    if (!SOLANA_RPC_URL || !TOKEN_MINT_ADDRESS) {
      throw new Error("Missing environment variables");
    }

    // Return cached data if valid
    const now = Date.now();
    if (cachedTransactions.length > 0 && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json(cachedTransactions);
    }

    const connection = new Connection(SOLANA_RPC_URL);
    const mintPubkey = new PublicKey(TOKEN_MINT_ADDRESS);

    const signatures = await connection.getSignaturesForAddress(
      mintPubkey,
      { limit: RECENT_TRANSACTIONS_LIMIT },
      "confirmed"
    );

    const transactions = [];

    for (const sig of signatures.slice(0, RECENT_TRANSACTIONS_LIMIT)) {
      try {
        // Tambahkan parameter maxSupportedTransactionVersion
        const tx = await connection.getParsedTransaction(sig.signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        if (!tx?.meta?.postTokenBalances || !tx?.meta?.preTokenBalances)
          continue;

        let transferAmount = "0";
        for (const postBalance of tx.meta.postTokenBalances) {
          if (postBalance.mint === TOKEN_MINT_ADDRESS) {
            const preBalance = tx.meta.preTokenBalances.find(
              (pre) => pre.accountIndex === postBalance.accountIndex
            );

            const preAmount = preBalance
              ? Number(preBalance.uiTokenAmount.amount)
              : 0;
            const postAmount = Number(postBalance.uiTokenAmount.amount);

            if (postAmount > preAmount) {
              transferAmount = ((postAmount - preAmount) / 1e9).toString();
              break;
            }
          }
        }

        if (Number(transferAmount) > 0) {
          transactions.push({
            signature: sig.signature,
            timestamp: sig.blockTime
              ? new Date(sig.blockTime * 1000).toISOString()
              : null,
            from: tx.transaction.message.accountKeys[0].pubkey.toString(),
            amount: transferAmount,
          });
        }
      } catch (error) {
        console.warn(`Failed to process transaction ${sig.signature}:`, error);
        continue;
      }
    }

    cachedTransactions = transactions;
    lastFetchTime = now;

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("API Error:", error);

    if (cachedTransactions.length > 0) {
      return NextResponse.json(cachedTransactions);
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}