import ShoppingList from "../models/ShoppingList.js";
import PDFDocument from "pdfkit";
import { sendEmail, createEmailTemplate } from "../utils/emailService.js";

export const getAllShoppingLists = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const lists = await ShoppingList.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ShoppingList.countDocuments(query);

    res.status(200).json({
      lists,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalLists: total,
        hasMore: skip + lists.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    res.status(500).json({ message: "Failed to fetch shopping lists" });
  }
};

export const createShoppingList = async (req, res) => {
  try {
    const { name, items } = req.body;
    const userId = req.user.id;

    if (!name || !items || items.length === 0) {
      return res.status(400).json({ message: "Name and items are required" });
    }

    const shoppingList = new ShoppingList({
      userId,
      name,
      items,
    });

    await shoppingList.save();

    res.status(201).json({
      message: "Shopping list created successfully",
      list: shoppingList,
    });
  } catch (error) {
    console.error("Error creating shopping list:", error);
    res.status(500).json({ message: "Failed to create shopping list" });
  }
};

export const updateShoppingList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, items, status } = req.body;
    const userId = req.user.id;

    const shoppingList = await ShoppingList.findOne({
      _id: id,
      userId,
    });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    if (name) shoppingList.name = name;
    if (items) shoppingList.items = items;
    if (status) shoppingList.status = status;

    await shoppingList.save();

    res.status(200).json({
      message: "Shopping list updated successfully",
      list: shoppingList,
    });
  } catch (error) {
    console.error("Error updating shopping list:", error);
    res.status(500).json({ message: "Failed to update shopping list" });
  }
};

export const deleteShoppingList = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const shoppingList = await ShoppingList.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    res.status(200).json({ message: "Shopping list deleted successfully" });
  } catch (error) {
    console.error("Error deleting shopping list:", error);
    res.status(500).json({ message: "Failed to delete shopping list" });
  }
};

export const exportShoppingListPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const shoppingList = await ShoppingList.findOne({
      _id: id,
      userId,
    }).populate("userId", "email name currency");

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    const currency = shoppingList.userId.currency || "USD";

    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    doc.fontSize(20).text("Shopping List", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`List Name: ${shoppingList.name}`);
    doc
      .fontSize(10)
      .text(`Created: ${shoppingList.createdAt.toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(12).text("Items:", { underline: true });
    doc.moveDown(0.5);

    shoppingList.items.forEach((item, index) => {
      const itemTotal = item.price.toFixed(2);
      doc
        .fontSize(10)
        .text(
          `${index + 1}. ${item.name} - Qty: ${item.quantity} ${
            item.unit || ""
          } - ${currency} ${itemTotal}`,
          { indent: 20 }
        );
      if (item.category !== "other") {
        doc.fontSize(8).text(`   Category: ${item.category}`, { indent: 20 });
      }
      doc.moveDown(0.3);
    });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Total: ${currency} ${shoppingList.totalPrice.toFixed(2)}`, {
        align: "right",
      });

    doc.end();

    await new Promise((resolve) => doc.on("end", resolve));

    const pdfBuffer = Buffer.concat(chunks);

    const emailHtml = createEmailTemplate(
      `Your Shopping List: ${shoppingList.name}`,
      `
        <p>Hello ${shoppingList.userId.name || "User"},</p>
        <p>Here is your shopping list <strong>"${
          shoppingList.name
        }"</strong> exported as a PDF.</p>
        <p>This list contains <strong>${
          shoppingList.items.length
        } items</strong> with a total estimated cost of <strong>${currency} ${shoppingList.totalPrice.toFixed(
        2
      )}</strong>.</p>
        <p>Happy Shopping!</p>
      `
    );

    await sendEmail({
      to: shoppingList.userId.email,
      subject: `Shopping List: ${shoppingList.name}`,
      text: `Your shopping list "${shoppingList.name}" is attached as a PDF.`,
      html: emailHtml,
      attachments: [
        {
          filename: `shopping-list-${shoppingList.name.replace(
            /\s+/g,
            "-"
          )}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    res.status(200).json({
      message: "Shopping list PDF sent to your email successfully",
    });
  } catch (error) {
    console.error("Error exporting shopping list:", error);
    res.status(500).json({ message: "Failed to export shopping list" });
  }
};
