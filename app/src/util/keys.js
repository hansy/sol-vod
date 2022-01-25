export const equal = (key1, key2) => {
  return key1.toBase58() === key2.toBase58()
}
