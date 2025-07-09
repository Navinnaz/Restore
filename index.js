const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);

  try {
    const { userId, orderAmount } = JSON.parse(req.body);

    const points = Math.floor(orderAmount / 10); // 1 point per ₹10

    // 1. Create transaction
    await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.COLLECTION_POINTS,
      'unique()',
      {
        userId,
        type: 'shopping',
        points,
        source: `order-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    );

    res.json({ message: `✅ ${points} points added.` });
  } catch (err) {
    res.json({ error: err.message });
  }
};
