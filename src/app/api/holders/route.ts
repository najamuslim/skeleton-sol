/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

export async function GET() {
  try {
    if (!SOLANA_RPC_URL || !TOKEN_MINT_ADDRESS) {
      throw new Error("Missing required environment variables");
    }

    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const mintAddress = new PublicKey(TOKEN_MINT_ADDRESS);

    // Ambil semua token accounts untuk mint ini
    const tokenAccounts = await connection.getProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        commitment: "confirmed",
        filters: [
          {
            dataSize: 165, // Ukuran SPL Token Account
          },
          {
            memcmp: {
              offset: 0, // Mint Address selalu di offset 0
              bytes: mintAddress.toBase58(),
            },
          },
        ],
      }
    );

    console.log(`Found ${tokenAccounts.length} token accounts`);

    // Decode dan filter data token accounts
    const holders = tokenAccounts
      .map((account) => {
        const data = account.account.data;

        // Decode owner (32-64 bytes)
        const owner = new PublicKey(data.slice(32, 64)).toBase58();

        // Decode token balance (64-72 bytes, uint64 LE)
        const balance = Number(data.readBigUInt64LE(64));

        return {
          wallet: owner,
          balance,
        };
      })
      .filter((holder) => holder.balance > 0) // Hanya holders dengan saldo > 0

    console.log(`Found ${holders.length} valid holders`);
    return NextResponse.json(holders);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
