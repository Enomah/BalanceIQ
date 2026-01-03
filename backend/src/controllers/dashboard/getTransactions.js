import Transaction from "../../models/Transactions.js";

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query object
    const query = { userId };

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.description = { $regex: req.query.search, $options: "i" };
    }

    // Get total count of transactions for this user (for pagination info)
    const totalCount = await Transaction.countDocuments(query);

    // Get transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip) // Skip documents for previous pages
      .limit(limit); // Limit to items per page

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Build extra query string
    let extraQuery = "";
    if (req.query.type) extraQuery += `&type=${req.query.type}`;
    if (req.query.category) extraQuery += `&category=${req.query.category}`;
    if (req.query.search)
      extraQuery += `&search=${encodeURIComponent(req.query.search)}`;

    // Construct base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
      req.path
    }`;

    // Build pagination response
    const response = {
      count: totalCount, // Total number of transactions
      next:
        page < totalPages
          ? `${baseUrl}?page=${page + 1}&limit=${limit}${extraQuery}`
          : null,
      prev:
        page > 1
          ? `${baseUrl}?page=${page - 1}&limit=${limit}${extraQuery}`
          : null,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
      content: transactions, // The actual transaction data for current page
    };

    // console.log(`Fetched ${transactions.length} transactions for page ${page}`);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};
