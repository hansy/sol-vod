class Video {
  constructor(publicKey, accountData) {
    this.publicKey = publicKey
    this.author = { publicKey: accountData.author }
    this.ipfsCid = accountData.ipfsCid
    this.price = accountData.price
    this.purchased = false
  }

  hasPurchased(val) {
    this.purchased = val
  }
}

export default Video
