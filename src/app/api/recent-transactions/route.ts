/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

export async function GET() {
  try {
    if (!SOLANA_RPC_URL || !TOKEN_MINT_ADDRESS) {
      throw new Error("Missing required environment variables");
    }

    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const mintPubkey = new PublicKey(TOKEN_MINT_ADDRESS);

    // Dapatkan semua token accounts untuk Skeleton token
    const allAccounts = await connection.getProgramAccounts(
      new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      {
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: 0,
              bytes: mintPubkey.toBase58(),
            },
          },
        ],
      }
    );

    console.log(`Found ${allAccounts.length} token accounts`);

    // Dapatkan signatures terbaru
    let allSignatures: any[] = [];
    for (const account of allAccounts) {
      const accountSignatures = await connection.getSignaturesForAddress(
        account.pubkey,
        { limit: 5 }
      );
      allSignatures = [...allSignatures, ...accountSignatures];
    }

    // Sort dan ambil 10 transaksi terbaru
    allSignatures.sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));
    allSignatures = allSignatures.slice(0, 10);

    const transactions = await Promise.all(
      allSignatures.map(async (sig) => {
        const tx = await connection.getParsedTransaction(sig.signature);

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
                transferAmount = ((postAmount - preAmount) / 1e9).toString(); // Convert to decimal
                break;
              }
            }
          }
        }

        return {
          signature: sig.signature,
          timestamp: sig.blockTime
            ? new Date(sig.blockTime * 1000).toISOString()
            : null,
          from: tx?.transaction.message.accountKeys[0].pubkey.toString(),
          amount: transferAmount,
        };
      })
    );

    // Filter transaksi dengan amount > 0
    const validTransactions = transactions.filter(
      (tx) => Number(tx.amount) > 0
    );

    return NextResponse.json(validTransactions);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
