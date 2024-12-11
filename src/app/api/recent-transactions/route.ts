/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

// Cache setup
let cachedTransactions: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // Cache selama 30 detik

// Retry helper function
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.message?.includes("429")) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function GET() {
  try {
    if (!SOLANA_RPC_URL || !TOKEN_MINT_ADDRESS) {
      throw new Error("Missing required environment variables");
    }

    // Return cached data if valid
    const now = Date.now();
    if (cachedTransactions.length > 0 && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json(cachedTransactions);
    }

    const connection = new Connection(SOLANA_RPC_URL, {
      commitment: "confirmed",
      httpHeaders: {
        "Cache-Control": "max-age=30",
      },
    });
    const mintPubkey = new PublicKey(TOKEN_MINT_ADDRESS);

    // Get token accounts with retry
    const allAccounts = await retryOperation(() =>
      connection.getProgramAccounts(
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        {
          filters: [
            { dataSize: 165 },
            {
              memcmp: {
                offset: 0,
                bytes: mintPubkey.toBase58(),
              },
            },
          ],
        }
      )
    );

    console.log(`Found ${allAccounts.length} token accounts`);

    // Optimize by getting only active accounts (with balance)
    const activeAccounts = allAccounts.filter((account) => {
      const balance = Number(account.account.data.readBigUInt64LE(64));
      return balance > 0;
    });

    const BATCH_SIZE = 3; // Reduced batch size
    const SIGNATURES_PER_ACCOUNT = 1; // Only get most recent signature

    let allSignatures: any[] = [];

    // Process accounts in smaller batches with longer delays
    for (let i = 0; i < activeAccounts.length; i += BATCH_SIZE) {
      const batch = activeAccounts.slice(i, i + BATCH_SIZE);
      const batchSignatures = await Promise.all(
        batch.map((account) =>
          retryOperation(() =>
            connection.getSignaturesForAddress(account.pubkey, {
              limit: SIGNATURES_PER_ACCOUNT,
            })
          )
        )
      );

      allSignatures = [...allSignatures, ...batchSignatures.flat()];

      // Longer delay between batches
      if (i + BATCH_SIZE < activeAccounts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Get only the 5 most recent signatures
    allSignatures.sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));
    allSignatures = allSignatures.slice(0, 5);

    // Process transactions
    const transactions = [];
    for (const sig of allSignatures) {
      try {
        const tx = await retryOperation(() =>
          connection.getParsedTransaction(sig.signature)
        );

        let transferAmount = "0";
        if (tx?.meta?.postTokenBalances && tx?.meta?.preTokenBalances) {
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
        }

        if (Number(transferAmount) > 0) {
          transactions.push({
            signature: sig.signature,
            timestamp: sig.blockTime
              ? new Date(sig.blockTime * 1000).toISOString()
              : null,
            from: tx?.transaction.message.accountKeys[0].pubkey.toString(),
            amount: transferAmount,
          });
        }

        // Small delay between transaction processing
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`Failed to process transaction ${sig.signature}:`, error);
        continue;
      }
    }

    // Update cache
    cachedTransactions = transactions;
    lastFetchTime = now;

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("API Error:", error);

    // Return cached data on error if available
    if (cachedTransactions.length > 0) {
      return NextResponse.json(cachedTransactions);
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
