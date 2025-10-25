import Transaction from "../../models/Transactions.js";

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
    const limit = parseInt(req.query.limit) || 20; // Number of items per page (default: 20)
    
    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Get total count of transactions for this user (for pagination info)
    const totalCount = await Transaction.countDocuments({ userId: userId });

    // Get transactions with pagination
    const transactions = await Transaction.find({ userId: userId })
      .sort({ createdAt: -1 }) // Sort by newest first (optional)
      .skip(skip) // Skip documents for previous pages
      .limit(limit); // Limit to 20 documents per page

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Construct base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    
    // Build pagination response
    const response = {
      count: totalCount, // Total number of transactions
      next: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
      content: transactions // The actual transaction data for current page
    };

    // console.log(`Fetched ${transactions.length} transactions for page ${page}`);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
}