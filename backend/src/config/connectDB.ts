const mongoUri = () => {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DBNAME } = process.env;
  if (!MONGO_USERNAME || !MONGO_PASSWORD || !MONGO_DBNAME) {
    throw new Error("必要な環境変数が設定されていません");
  }
  const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@atlascluster.jsju1.mongodb.net/${MONGO_DBNAME}?retryWrites=true&w=majority&appName=AtlasCluster`;

  return uri;
};

export default mongoUri;