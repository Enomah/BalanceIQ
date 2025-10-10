import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "BalanceIQ API",
      version: "1.0.0",
      description: "API documentation for BalanceIQ backend services.",
      contact: {
        name: "BalanceIQ Support",
        email: "enomahog@gmail.com",
        url: "https://balanceiq.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local development server",
      },
      {
        url: "https://api.balanceiq.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    path.resolve("src/docs/*.js"),
    path.resolve("src/docs/**/*.js"),
  ],
};

/**
 * Dark Theme Swagger UI styling using BalanceIQ color variables
 */
const customCss = `
  :root {
    --swagger-bg-primary: #111827;
    --swagger-bg-secondary: #1f2937;
    --swagger-bg-tertiary: #374151;
    --swagger-text-primary: #f9fafb;
    --swagger-text-secondary: #e5e7eb;
    --swagger-text-tertiary: #9ca3af;
    --swagger-border: #374151;
    --swagger-primary: #0d8af1;
    --swagger-primary-light: #7cc2ff;
    --swagger-primary-dark: #0353a6;
    --swagger-success: #22c55e;
    --swagger-warning: #f59e0b;
    --swagger-error: #ef4444;
    --swagger-get: #0d8af1;
    --swagger-post: #22c55e;
    --swagger-put: #f59e0b;
    --swagger-delete: #ef4444;
    --swagger-patch: #8b5cf6;
    --swagger-head: #06b6d4;
    --swagger-options: #6b7280;
  }

  /* Base styling */
  .swagger-ui {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--swagger-bg-primary);
    color: var(--swagger-text-primary);
  }

  /* Topbar */
  .swagger-ui .topbar {
    background: linear-gradient(135deg, var(--swagger-bg-secondary) 0%, var(--swagger-primary-dark) 100%);
    border-bottom: 1px solid var(--swagger-border);
    padding: 15px 0;
    box-shadow: var(--shadow-md);
  }

  .swagger-ui .topbar .wrapper {
    max-width: 1460px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .swagger-ui .topbar .topbar-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .swagger-ui .topbar .topbar-wrapper a {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: var(--swagger-text-primary);
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: -0.025em;
  }

  .swagger-ui .topbar .topbar-wrapper img {
    height: 40px;
    width: auto;
  }

  /* Info section */
  .swagger-ui .info {
    margin: 40px 0;
    background: var(--swagger-bg-secondary);
    border: 1px solid var(--swagger-border);
    border-radius: 12px;
    padding: 30px;
    box-shadow: var(--shadow-lg);
  }

  .swagger-ui .info .title {
    color: var(--swagger-primary-light);
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 10px;
    letter-spacing: -0.025em;
  }

  .swagger-ui .info .description p {
    color: var(--swagger-text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .swagger-ui .info .contact,
  .swagger-ui .info .license {
    margin-top: 25px;
    padding-top: 25px;
    border-top: 1px solid var(--swagger-border);
  }

  .swagger-ui .info .contact a,
  .swagger-ui .info .license a {
    color: var(--swagger-primary-light);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .swagger-ui .info .contact a:hover,
  .swagger-ui .info .license a:hover {
    color: var(--swagger-primary);
  }

  /* Scheme container */
  .swagger-ui .scheme-container {
    background: var(--swagger-bg-secondary);
    border: 1px solid var(--swagger-border);
    border-radius: 12px;
    margin: 30px 0;
    padding: 20px;
    box-shadow: var(--shadow-md);
  }

  /* Operation blocks */
  .swagger-ui .opblock {
    background: var(--swagger-bg-secondary);
    border: 1px solid var(--swagger-border);
    border-radius: 12px;
    margin: 20px 0;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
  }

  .swagger-ui .opblock:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .swagger-ui .opblock.is-open {
    border-color: var(--swagger-primary);
  }

  /* Operation method badges */
  .swagger-ui .opblock .opblock-summary-method {
    background: var(--swagger-get);
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    padding: 6px 12px;
    border-radius: 8px;
    min-width: 80px;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: linear-gradient(135deg, var(--swagger-get) 0%, var(--swagger-primary-dark) 100%);
  }

  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: linear-gradient(135deg, var(--swagger-post) 0%, var(--success-700) 100%);
  }

  .swagger-ui .opblock.opblock-put .opblock-summary-method {
    background: linear-gradient(135deg, var(--swagger-put) 0%, var(--warning-700) 100%);
  }

  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background: linear-gradient(135deg, var(--swagger-error) 0%, var(--error-700) 100%);
  }

  .swagger-ui .opblock.opblock-patch .opblock-summary-method {
    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  }

  .swagger-ui .opblock.opblock-head .opblock-summary-method {
    background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%);
  }

  .swagger-ui .opblock.opblock-options .opblock-summary-method {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  }

  /* Operation summary */
  .swagger-ui .opblock .opblock-summary-path {
    color: var(--swagger-text-primary);
    font-weight: 600;
    font-size: 1.1rem;
  }

  .swagger-ui .opblock .opblock-summary-description {
    color: var(--swagger-text-tertiary);
    font-size: 0.95rem;
  }

  /* Operation content */
  .swagger-ui .opblock .opblock-section {
    background: var(--swagger-bg-tertiary);
    border-top: 1px solid var(--swagger-border);
  }

  .swagger-ui .opblock .opblock-section-header {
    background: var(--swagger-bg-secondary);
    border-bottom: 1px solid var(--swagger-border);
  }

  /* Parameters and responses */
  .swagger-ui .parameters-container,
  .swagger-ui .responses-container {
    background: var(--swagger-bg-tertiary);
  }

  .swagger-ui .parameter__name {
    color: var(--swagger-text-primary);
    font-weight: 600;
  }

  .swagger-ui .parameter__type {
    color: var(--swagger-primary-light);
    font-weight: 500;
  }

  .swagger-ui .parameter__in {
    color: var(--swagger-text-tertiary);
    font-style: italic;
  }

  .swagger-ui .response-col_status {
    color: var(--swagger-text-primary);
    font-weight: 600;
  }

  .swagger-ui .response-col_description {
    color: var(--swagger-text-secondary);
  }

  /* Tables */
  .swagger-ui table {
    background: var(--swagger-bg-tertiary);
    border: 1px solid var(--swagger-border);
  }

  .swagger-ui table thead tr {
    background: var(--swagger-bg-secondary);
  }

  .swagger-ui table thead tr th {
    color: var(--swagger-text-primary);
    font-weight: 600;
    border-bottom: 1px solid var(--swagger-border);
  }

  .swagger-ui table tbody tr td {
    color: var(--swagger-text-secondary);
    border-bottom: 1px solid var(--swagger-border);
  }

  .swagger-ui table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Buttons */
  .swagger-ui .btn {
    background: linear-gradient(135deg, var(--swagger-primary) 0%, var(--swagger-primary-dark) 100%);
    border: 1px solid var(--swagger-primary);
    color: white;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .swagger-ui .btn:hover {
    background: linear-gradient(135deg, var(--swagger-primary-dark) 0%, var(--swagger-primary) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(13, 138, 241, 0.3);
  }

  .swagger-ui .btn.execute {
    background: linear-gradient(135deg, var(--swagger-success) 0%, var(--success-700) 100%);
    border-color: var(--swagger-success);
  }

  .swagger-ui .btn.execute:hover {
    background: linear-gradient(135deg, var(--success-600) 0%, var(--swagger-success) 100%);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }

  .swagger-ui .btn.cancel {
    background: linear-gradient(135deg, var(--swagger-error) 0%, var(--error-700) 100%);
    border-color: var(--swagger-error);
  }

  .swagger-ui .btn.cancel:hover {
    background: linear-gradient(135deg, var(--error-600) 0%, var(--swagger-error) 100%);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  /* Try-out section */
  .swagger-ui .try-out {
    background: var(--swagger-bg-secondary);
    border-bottom: 1px solid var(--swagger-border);
    padding: 15px;
  }

  .swagger-ui .try-out__btn {
    background: linear-gradient(135deg, var(--swagger-primary) 0%, var(--swagger-primary-dark) 100%);
    border: 1px solid var(--swagger-primary);
    color: white;
  }

  .swagger-ui .try-out__btn:hover {
    background: linear-gradient(135deg, var(--swagger-primary-dark) 0%, var(--swagger-primary) 100%);
  }

  /* Models and schemas */
  .swagger-ui .model-box {
    background: var(--swagger-bg-secondary);
    border: 1px solid var(--swagger-border);
    border-radius: 8px;
    padding: 15px;
    margin: 10px 0;
  }

  .swagger-ui .model-title {
    color: var(--swagger-primary-light);
    font-weight: 600;
  }

  .swagger-ui .property {
    color: var(--swagger-text-secondary);
  }

  .swagger-ui .model {
    color: var(--swagger-text-secondary);
  }

  /* Code samples */
  .swagger-ui .microlight {
    background: var(--swagger-bg-primary);
    border: 1px solid var(--swagger-border);
    border-radius: 8px;
    color: var(--swagger-text-primary);
  }

  /* Server selection */
  .swagger-ui .servers {
    background: var(--swagger-bg-secondary);
    border: 1px solid var(--swagger-border);
    border-radius: 8px;
    margin: 20px 0;
  }

  .swagger-ui .servers-title {
    color: var(--swagger-text-primary);
    font-weight: 600;
  }

  .swagger-ui .server-url {
    color: var(--swagger-text-secondary);
  }

  /* Authorization */
  .swagger-ui .auth-container {
    background: var(--swagger-bg-secondary);
    border: 1px solid var(--swagger-border);
    border-radius: 8px;
    margin: 20px 0;
    padding: 20px;
  }

  .swagger-ui .auth-btn-wrapper {
    margin-top: 15px;
  }

  /* Loading animation */
  .swagger-ui .loading-container {
    background: var(--swagger-bg-primary);
  }

  .swagger-ui .loading:after {
    color: var(--swagger-primary);
  }

  /* Scrollbar styling */
  .swagger-ui ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .swagger-ui ::-webkit-scrollbar-track {
    background: var(--swagger-bg-secondary);
  }

  .swagger-ui ::-webkit-scrollbar-thumb {
    background: var(--swagger-border);
    border-radius: 4px;
  }

  .swagger-ui ::-webkit-scrollbar-thumb:hover {
    background: var(--swagger-text-tertiary);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .swagger-ui .info {
      margin: 20px 0;
      padding: 20px;
    }
    
    .swagger-ui .info .title {
      font-size: 2rem;
    }
    
    .swagger-ui .topbar .topbar-wrapper a {
      font-size: 1.25rem;
    }
  }
`;

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiOptions = {
  customCss,
  customSiteTitle: "BalanceIQ API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};