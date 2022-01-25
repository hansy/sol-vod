class Purchase {
  constructor(publicKey, accountData) {
    this.publicKey = publicKey
    this.video = { publicKey: accountData.video }
    this.user = { publicKey: accountData.user }
  }
}

export default Purchase
