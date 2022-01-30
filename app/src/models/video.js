const getMetadata = async (url) => {
  try {
    const response = await fetch(url);

    return await response.json();
  } catch (e) {
    console.log(e);
    return {};
  }
};

class Video {
  constructor(publicKey, accountData) {
    this.publicKey = publicKey;
    this.author = { publicKey: accountData.author };
    this.ipfsCid = accountData.ipfsCid;
    this.price = accountData.price;
    this.purchased = false;
    this.metadata = {};
  }

  hasPurchased(val) {
    this.purchased = val;
  }

  async getMetadata() {
    this.metadata = await getMetadata(
      `https://gateway.pinata.cloud/ipfs/${this.ipfsCid}/metadata.json`
    );
  }
}

export default Video;
