const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} = require("@solana/spl-token");
const fs = require("fs");

// Setup connection to devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Your token mint from the notes
const MINT_ADDRESS = "6uV1MoEC29aQ3ev8DTcfx8z64QTNNzJSDu1CW8s6o5AD";
const TOTAL_HOLDERS = 20;
const TOKENS_TO_DISTRIBUTE = 34;

async function createWallets(count: number): Promise<(typeof Keypair)[]> {
  const wallets: (typeof Keypair)[] = [];
  for (let i = 0; i < count; i++) {
    wallets.push(Keypair.generate());
  }
  return wallets;
}

// Helper function untuk delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function distributeTokens() {
  try {
    const KEYPAIR_PATH = "/Users/najatulmuslimdinatra/.config/solana/id.json";
    const authorityKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8")))
    );

    console.log("Using wallet:", authorityKeypair.publicKey.toString());

    // Get authority token account and check balance
    const authorityTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      authorityKeypair,
      new PublicKey(MINT_ADDRESS),
      authorityKeypair.publicKey
    );

    const currentBalance = Number(authorityTokenAccount.amount) / 1e9;
    console.log(`Current balance: ${currentBalance} tokens`);

    if (currentBalance < 44) {
      throw new Error(
        `Insufficient balance. Need 44 tokens but only have ${currentBalance}`
      );
    }

    // Generate wallets and random distributions
    console.log("Generating wallets and distributions...");
    const wallets = await createWallets(TOTAL_HOLDERS);
    const distributions: { wallet: typeof Keypair; amount: number }[] = [];

    let remainingTokens = TOKENS_TO_DISTRIBUTE;
    const minAmount = 0.1; // Minimum 0.1 tokens per distribution

    // Distribute random amounts including decimals
    for (let i = 0; i < wallets.length && remainingTokens > 0; i++) {
      // For the last distribution, use all remaining tokens
      const amount =
        i === wallets.length - 1
          ? Number(remainingTokens.toFixed(3))
          : Number((Math.random() * 2 + minAmount).toFixed(3)); // Random amount between 0.1 and 2.1

      if (amount > remainingTokens) continue;

      distributions.push({
        wallet: wallets[i],
        amount: amount,
      });
      remainingTokens = Number((remainingTokens - amount).toFixed(3));

      if (remainingTokens < minAmount) break;
    }

    console.log(
      `Created ${distributions.length} distributions, remaining tokens: ${remainingTokens}`
    );

    // Process distributions
    for (const dist of distributions) {
      try {
        const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          authorityKeypair,
          new PublicKey(MINT_ADDRESS),
          dist.wallet.publicKey
        );

        await transfer(
          connection,
          authorityKeypair,
          authorityTokenAccount.address,
          recipientTokenAccount.address,
          authorityKeypair,
          Math.floor(dist.amount * 1e9) // Convert to lamports
        );

        console.log(
          `Transferred ${
            dist.amount
          } tokens to ${dist.wallet.publicKey.toString()}`
        );

        await sleep(1000); // Delay between transfers
      } catch (error) {
        console.error(
          `Error processing wallet ${dist.wallet.publicKey.toString()}:`,
          error
        );
        continue;
      }
    }

    // Save wallet information
    const walletInfo = distributions.map((dist) => ({
      publicKey: dist.wallet.publicKey.toString(),
      amount: dist.amount,
      privateKey: Array.from(dist.wallet.secretKey),
    }));

    fs.writeFileSync(
      "distributed-wallets-remainder.json",
      JSON.stringify(walletInfo, null, 2)
    );

    console.log(
      "Distribution complete! Wallet info saved to distributed-wallets-remainder.json"
    );

    // Log final balance
    const finalBalance = Number(
      (await connection.getTokenAccountBalance(authorityTokenAccount.address))
        .value.uiAmount
    );
    console.log(`Final balance: ${finalBalance} tokens`);
  } catch (error: any) {
    console.error("Error distributing tokens:", error);
    if (error.logs) {
      console.error("Transaction logs:", error.logs);
    }
  }
}

distributeTokens();
