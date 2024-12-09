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
    const mintAddress = new PublicKey(TOKEN_MINT_ADDRESS);

    const largestAccounts = await connection.getTokenLargestAccounts(
      mintAddress
    );
    const accountAddresses = largestAccounts.value.map(
      (account) => account.address
    );

    const accountsInfo = await Promise.all(
      accountAddresses.map((address) =>
        connection.getParsedAccountInfo(address)
      )
    );

    const holders = accountsInfo.map(({ value }: any) => {
      const { owner, tokenAmount } = value.data.parsed.info;
      return {
        wallet: owner,
        balance: tokenAmount.uiAmount,
      };
    });

    return NextResponse.json(holders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
