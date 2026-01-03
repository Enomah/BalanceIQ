import { Book, Shield, DollarSign, CreditCard, Target } from "lucide-react";

export interface DocArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  icon: React.ElementType;
}

export const articles: DocArticle[] = [
  {
    id: "getting-started-setup",
    title: "Account Setup & Profile",
    category: "Getting Started",
    summary: "Complete your profile to unlock all financial tracking features.",
    content: `## Setting Up Your Account
Your BalanceIQ profile is the core of your experience. Completing it ensures your dashboard is accurate.

1.  **Identity**: Go to **Settings** and ensure your full name and nickname are correct. This personalizes your experience.
2.  **Currency**: Set your preferred currency in **Settings > Preferences**. This will be used for all totals on your dashboard.
3.  **Income Source**: Define your primary income source to help our insights engine categorize your earnings.
4.  **Verification**: Ensure your email is verified to enable security features like password resets.
`,
    icon: Book,
  },
  {
    id: "budgeting-create",
    title: "Creating a Monthly Budget",
    category: "Budgeting",
    summary:
      "Set limits on your spending to reach your financial goals faster.",
    content: `## How to Create a Budget
A budget helps you plan your spending and avoid overdrawing.

1.  **Define Limit**: Navigate to **Budgeting** and click **Create Monthly Budget**.
2.  **Total Amount**: Enter the maximum amount you want to spend this month.
3.  **Category Allocation**: Divide your total budget into categories like **Food**, **Transport**, and **Utilities**.
4.  **Real-Time Tracking**: As you add expenses, the progress bars on the Budgeting page will update automatically.
5.  **Refinement**: You can edit your budget at any time by clicking the three dots on the category cards.
`,
    icon: DollarSign,
  },
  {
    id: "transactions-track",
    title: "Tracking Transactions",
    category: "Transactions",
    summary:
      "Keep a record of every dollar that enters or leaves your account.",
    content: `## Managing Your Money Flow
Tracking every transaction is the key to financial awareness.

1.  **Add Income**: Use the **Add Income** button on the dashboard or transactions page for any earnings.
2.  **Add Expense**: Use the **Add Expense** button when you spend money.
3.  **Categorization**: Select the correct category for each transaction to ensure your **Insights** and **Budget** are accurate.
4.  **Filtering**: Use the filters on the **Transactions** page to find specific records by date, type, or category.
5.  **Edit/Delete**: If you make a mistake, simply click on the transaction in the list to modify it.
`,
    icon: CreditCard,
  },
  {
    id: "goals-manage",
    title: "Setting Financial Goals",
    category: "Goals",
    summary:
      "Save for the future by creating and tracking specific objectives.",
    content: `## Achieving Your Ambitions
Goals allow you to put money aside for specific future needs.

1.  **Create Goal**: Go to **Financial Goals** and click **Add New Goal**.
2.  **Goal Details**: Give your goal a name (e.g., "New Laptop"), a target amount, and a deadline.
3.  **Tracking Progress**: The app calculates how much you've saved based on your current balance and manual contributions.
4.  **Badges**: Reach milestones to earn achievements and stay motivated!
`,
    icon: Target,
  },
  {
    id: "security-protection",
    title: "Data Protection & Security",
    category: "Security",
    summary: "Learn how we keep your financial information safe.",
    content: `## Your Security is Our Priority
We use industry-standard measures to protect your account and data.

1.  **Secure Hashing**: We use **BCrypt** with high salt rounds to hash your passwords. We never store or see your plain-text password.
2.  **Encrypted Transit**: All data sent between your browser and our servers is encrypted using **SSL/TLS (HTTPS)** to prevent interception.
3.  **OTP Verification**: Multi-step verification using One-Time Passwords (OTP) ensures that only you can access or modify critical account settings.
4.  **Data Isolation**: Your financial transactions are isolated at the database level and are never shared with third parties.
`,
    icon: Shield,
  },
];
