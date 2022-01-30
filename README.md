# Web3 VOD on Solana

This is an experiment in "gating" online videos with a Solana paywall. Users can unlock videos by paying the fee set by the video's creator.

The repo is broken up into two parts:

1. Vue frontend in the `/app` directory
2. Solana program in the `/programs` directory

## Requirements

- [Anchor Framework](https://project-serum.github.io/anchor/getting-started/installation.html) (instructions include installing Solana and Rust)
- NodeJS + Yarn/Npm

## Building + Deplying program

### Switch network

Right now this program can only be deployed on devnet because it uses a chainlink oracle that's on devnet.

```bash
$: solana config set --url https://api.devnet.solana.com
```

### Generate CLI wallet

```bash
$: solana-keygen new
```

After generating a wallet, update `Anchor.toml` with the path to the generated wallet

### Airdrop SOL to wallet

```bash
$: solana address // outputs wallet pubkey
$: solana airdrop 2 <SOLANA pubkey> // airdrop 2 SOL to address
```

### Build program

```bash
$: anchor build
```

After building the program, run `solana address -k target/deploy/sol_vod-keypair.json`. This will generate the Program ID. Replace the above Program Id in these two files:

- `Anchor.toml` (under programs.localnet)
- `/programs/sol-vod/src/lib.rs` (inside declare_id!())

Building the program should also generate an IDL file in `target/idl/sol_vod.json`. It should have a `metadata.address` key with the value of the Program ID above. If not, add that key. E.g.:

```json
// sol_vod.json
{
  ...
  "metadata": {
      "address": <PROGRAM ID>
  }
}
```

### Deploy program

```bash
$: anchor deploy

// alternatively, to build + test + deploy in one command
$: anchor test
```

## Running client

In a seperate terminal:

```bash
$: cd app/

// install dependencies
$ yarn

// run app
$ yarn serve
```
