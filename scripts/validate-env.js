#!/usr/bin/env node

/**
 * BalanceIQ Environment Variable Validator
 * This script ensures all required variables are present before deployment.
 */

const requiredEnvVars = {
  frontend: ["NEXT_PUBLIC_API_URL"],
  backend: ["MONGO_URI", "JWT_SECRET", "RESEND_API_KEY", "CLIENT_URL"],
};

console.log("🔍 Validating Environment Variables...");

let hasMissing = false;

// Check Backend
console.log("\n--- Backend Check ---");
requiredEnvVars.backend.forEach((v) => {
  if (!process.env[v]) {
    console.warn(`⚠️  Missing Backend Var: ${v}`);
    hasMissing = true;
  } else {
    console.log(`✅ ${v}`);
  }
});

// Check Frontend
console.log("\n--- Frontend Check ---");
requiredEnvVars.frontend.forEach((v) => {
  if (!process.env[v]) {
    console.warn(`⚠️  Missing Frontend Var: ${v}`);
    hasMissing = true;
  } else {
    console.log(`✅ ${v}`);
  }
});

if (hasMissing) {
  console.log("\n❌ Validation Failed! Some variables are missing.");
  console.log(
    "Please ensure these are set in your deployment platform (Render, Vercel, etc.)."
  );
} else {
  console.log(
    "\n🚀 All local environment variables are present and accounted for!"
  );
}
