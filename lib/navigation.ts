export interface NavPage {
  title: string;
  slug: string;
  children?: NavPage[];
}

export interface NavSection {
  title: string;
  pages: NavPage[];
}

export const navigation: NavSection[] = [
  {
    title: "Getting Started",
    pages: [
      { title: "Welcome to Yellow Card", slug: "getting-started" },
      { title: "Onboard with us", slug: "getting-started-api" },
      { title: "Getting Started", slug: "getting-started-1" },
      { title: "Going Live", slug: "go-live-api" },
    ],
  },
  {
    title: "THE BASICS",
    pages: [
      { title: "Making a Receive", slug: "making-a-collection" },
      { title: "Making a Send", slug: "disbursement-user-journey" },
    ],
  },
  {
    title: "Use Cases",
    pages: [
      { title: "Send Cross-Border Remittances", slug: "send-cross-border-remittances" },
      { title: "Pay Global Suppliers & Invoices", slug: "pay-global-suppliers-invoices" },
      { title: "Accept Stablecoin payments", slug: "accept-stablecoin-payments" },
      { title: "Accept Local Currency Payments", slug: "accept-local-currency-payments" },
      { title: "Enable Customers To Buy & Sell Digital Assets", slug: "buy-sell-digital-assets" },
      { title: "Enable Full Digital Asset Wallet Functionality", slug: "digital-asset-wallet-functionality" },
      { title: "Access to USD/EUR (Coming soon)", slug: "access-to-usdeur" },
    ],
  },
  {
    title: "Supporting Documentation",
    pages: [
      { title: "Authentication", slug: "authentication-api" },
      { title: "Environments", slug: "environments-api" },
      { title: "Sandbox Testing", slug: "sandbox-testing-api" },
      {
        title: "Coverage Map \ud83c\udf0d",
        slug: "coverage-api",
        children: [
          { title: "Africa", slug: "africa" },
          { title: "Latin America", slug: "latin-america" },
          { title: "Asia", slug: "asia" },
          { title: "Europe", slug: "europe" },
        ],
      },
      { title: "Transaction Limits", slug: "api-transaction-limits" },
      { title: "Channels", slug: "channels-api" },
      { title: "Networks", slug: "networks" },
      { title: "Using Rates Data", slug: "using-rates-data" },
      { title: "KYC Metadata", slug: "kyc-metadata" },
      { title: "Webhooks", slug: "webhooks-api" },
      { title: "Events", slug: "events-api" },
      { title: "Errors", slug: "errors-api" },
      { title: "List Receive", slug: "list-collections-guide-api" },
      { title: "Payment Reasons", slug: "payment-reasons-api" },
      { title: "Send and Receive Error Codes", slug: "error-codes" },
      { title: "Cancellation & Refunds: Receive Requests", slug: "cancellation-refunds-collection-requests" },
    ],
  },
  {
    title: "Features",
    pages: [
      { title: "Request for Quote (RFQ)", slug: "request-for-quote" },
      { title: "Convert Currencies", slug: "direct-settlement" },
      { title: "Wallet Infrastructure Guide", slug: "wallet-infrastructure-guide" },
      {
        title: "Virtual Accounts",
        slug: "virtual-accounts",
        children: [
          { title: "Create Virtual Accounts", slug: "creating-a-virtual-account" },
          { title: "Initiate Sends", slug: "initiating-sends" },
          { title: "Webhooks", slug: "webhooks" },
        ],
      },
    ],
  },
  {
    title: "SECURITY",
    pages: [
      { title: "Integration Security Guide", slug: "integration-security-guide" },
    ],
  },
  {
    title: "Dashboard",
    pages: [
      { title: "Balance Top up and Pay out", slug: "settlement-api" },
      { title: "SSO", slug: "sso" },
    ],
  },
  {
    title: "GLOSSARY",
    pages: [
      { title: "API Glossary", slug: "api-glossary" },
    ],
  },
  {
    title: "MCP Server",
    pages: [
      { title: "MCP", slug: "mcp" },
    ],
  },
];

export function findPageBySlug(slug: string): { page: NavPage; section: NavSection } | null {
  for (const section of navigation) {
    for (const page of section.pages) {
      if (page.slug === slug) return { page, section };
      if (page.children) {
        for (const child of page.children) {
          if (child.slug === slug) return { page: child, section };
        }
      }
    }
  }
  return null;
}

export function getAdjacentPages(slug: string): { prev: NavPage | null; next: NavPage | null } {
  const allPages: NavPage[] = [];
  for (const section of navigation) {
    for (const page of section.pages) {
      allPages.push(page);
      if (page.children) {
        allPages.push(...page.children);
      }
    }
  }

  const idx = allPages.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? allPages[idx - 1] : null,
    next: idx < allPages.length - 1 ? allPages[idx + 1] : null,
  };
}

