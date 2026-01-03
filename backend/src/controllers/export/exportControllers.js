import Transaction from "../../models/Transactions.js";
import { json2csv } from "json-2-csv";
import PDFDocument from "pdfkit";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const calculateAggregates = (transactions) => {
  return transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.totalIncome += t.amount;
      else if (t.type === "expense") acc.totalExpense += t.amount;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );
};

export const exportCSV = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const { startDate, endDate } = req.query;

    let query = { userId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for the selected range." });
    }

    const { totalIncome, totalExpense } = calculateAggregates(transactions);
    const netSavings = totalIncome - totalExpense;

    const data = transactions.map((t) => ({
      Date: new Date(t.createdAt).toLocaleDateString(),
      Type: t.type.toUpperCase(),
      Category: t.category,
      Amount: t.amount,
      Description: t.description || "N/A",
    }));

    // CSV with Summary Header
    const csvContent = json2csv(data);
    const summaryHeader = `FINANCIAL SUMMARY\nTotal Income,${totalIncome.toFixed(
      2
    )}\nTotal Expenses,${totalExpense.toFixed(
      2
    )}\nNet Savings,${netSavings.toFixed(2)}\n\n`;
    const finalCsv = summaryHeader + csvContent;

    const rangeText = `${startDate || "All-Time"}_to_${endDate || "Present"}`;
    const filename = `BalanceIQ_Transactions_${rangeText}.csv`;

    const emailResponse = await resend.emails.send({
      from: "BalanceIQ Reports <onboarding@resend.dev>",
      to: userEmail,
      subject: "📊 Your BalanceIQ Financial Report (CSV)",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #333;">
          <h2 style="color: #10b981;">Financial Report Ready</h2>
          <p>Hello,</p>
          <p>Your requested financial report for the period <strong>${
            startDate || "All Time"
          }</strong> to <strong>${
        endDate || "Present"
      }</strong> is attached below.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Total Income:</strong> ${totalIncome.toFixed(
              2
            )}</p>
            <p style="margin: 5px 0;"><strong>Total Expenses:</strong> ${totalExpense.toFixed(
              2
            )}</p>
            <p style="margin: 5px 0; color: ${
              netSavings >= 0 ? "#059669" : "#dc2626"
            };"><strong>Net Savings:</strong> ${netSavings.toFixed(2)}</p>
          </div>
          <p>Thank you for using BalanceIQ!</p>
        </div>
      `,
      attachments: [
        {
          filename,
          content: Buffer.from(finalCsv).toString("base64"),
        },
      ],
    });

    if (emailResponse.error) {
      throw new Error(emailResponse.error.message);
    }

    res
      .status(200)
      .json({ message: "Report has been sent to your email address." });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const exportPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const { startDate, endDate } = req.query;

    let query = { userId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for the selected range." });
    }

    const { totalIncome, totalExpense } = calculateAggregates(transactions);
    const netSavings = totalIncome - totalExpense;

    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    return new Promise((resolve, reject) => {
      doc.on("end", async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          const rangeText = `${startDate || "All-Time"}_to_${
            endDate || "Present"
          }`;
          const filename = `BalanceIQ_Statement_${rangeText}.pdf`;

          const emailResponse = await resend.emails.send({
            from: "BalanceIQ Reports <onboarding@resend.dev>",
            to: userEmail,
            subject: "📜 Your BalanceIQ Financial Statement (PDF)",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; color: #333;">
                <h2 style="color: #f59e0b;">Financial Statement Ready</h2>
                <p>Hello,</p>
                <p>Please find your professional financial statement attached. This report includes a full breakdown of your activity for the selected period.</p>
                <p>Best regards,<br/>The BalanceIQ Team</p>
              </div>
            `,
            attachments: [
              {
                filename,
                content: pdfBuffer.toString("base64"),
              },
            ],
          });

          if (emailResponse.error) throw new Error(emailResponse.error.message);

          res.status(200).json({
            message: "Statement has been sent to your email address.",
          });
          resolve();
        } catch (err) {
          console.error("PDF Email Error:", err);
          res.status(500).json({ message: "Failed to send email statement." });
          reject(err);
        }
      });

      // PDF Content Generation
      doc
        .fillColor("#444444")
        .fontSize(20)
        .text("BalanceIQ Financial Statement", { align: "center" })
        .moveDown();

      doc
        .fontSize(10)
        .text(`Generated on: ${new Date().toLocaleString()}`, {
          align: "right",
        })
        .text(`Period: ${startDate || "All Time"} to ${endDate || "Present"}`, {
          align: "right",
        })
        .moveDown();

      // Financial Snapshot Section
      doc.rect(50, 140, 500, 80).fill("#f9fafb");
      doc
        .fillColor("#111827")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Financial Snapshot", 70, 155);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Total Income: ${totalIncome.toFixed(2)}`, 70, 180);
      doc.text(`Total Expenses: ${totalExpense.toFixed(2)}`, 220, 180);
      doc
        .fillColor(netSavings >= 0 ? "#059669" : "#dc2626")
        .text(`Net Savings: ${netSavings.toFixed(2)}`, 370, 180);

      const tableTop = 240;
      doc.fillColor("#444444").fontSize(10).font("Helvetica-Bold");
      doc.text("Date", 50, tableTop);
      doc.text("Type", 130, tableTop);
      doc.text("Category", 200, tableTop);
      doc.text("Description", 300, tableTop);
      doc.text("Amount", 480, tableTop, { align: "right" });

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      let position = tableTop + 30;
      doc.font("Helvetica");

      transactions.forEach((t) => {
        if (position > 700) {
          doc.addPage();
          position = 50;
        }
        doc.text(new Date(t.createdAt).toLocaleDateString(), 50, position);
        doc.text(t.type.toUpperCase(), 130, position);
        doc.text(t.category, 200, position);
        doc.text(t.description?.substring(0, 30) || "N/A", 300, position);
        doc.text(`${t.amount.toFixed(2)}`, 480, position, { align: "right" });
        position += 20;
      });

      doc.end();
    });
  } catch (error) {
    console.error("Error exporting PDF:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
