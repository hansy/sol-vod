import { inject, provide, computed } from "vue";
import { useAnchorWallet } from "@solana/wallet-adapter-vue";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Provider, Program } from "@project-serum/anchor";
import idl from "../../../target/idl/sol_vod.json";

const programId = new PublicKey(idl.metadata.address);
const workspaceSymbol = Symbol();

export const useWorkspace = () => inject(workspaceSymbol);

export const initWorkspace = () => {
  const wallet = useAnchorWallet();
  // const router = useRouter()
  // const route = useRoute()

  // watchEffect(() => {
  //   console.log(router.query)
  //   if (wallet.value) {
  //     router.replace({ query: { ref: wallet.value.publicKey }})
  //   } else {
  //     delete route.query.ref
  //   }
  // })

  const network = clusterApiUrl("devnet");
  const opts = {
    preflightCommitment: "processed",
    commitment: "processed",
  };
  const connection = new Connection(network, opts.commitment);
  const provider = computed(() => new Provider(connection, wallet.value, opts));
  const program = computed(() => new Program(idl, programId, provider.value));

  provide(workspaceSymbol, {
    wallet,
    connection,
    provider,
    program,
  });
};
