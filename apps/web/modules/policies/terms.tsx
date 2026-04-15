import React from "react";
import { PolicyLayout } from "../../components/layout/policy.layout";

const TERMS_SECTIONS = [
  {
    heading: "Overview",
    content: (
      <p>
        Welcome to Snappin. These Terms &amp; Conditions govern your use of{" "}
        https://snappinapp.com and any related products, applications, or services. By accessing
        or using our services, you agree to be bound by these Terms. If you do not agree, please
        discontinue using Snappin.
      </p>
    ),
  },
  {
    heading: "1. About Snappin",
    content: (
      <p>
        Snappin is an AI-powered automation platform that helps users extract, organize, and
        manage invoices, bills, and receipts from email accounts and uploads. Our goal is to save
        time and improve financial management accuracy for freelancers, small businesses, and
        finance teams.
      </p>
    ),
  },
  {
    heading: "2. Eligibility",
    content: (
      <p>
        You must be at least 13 years old to use Snappin. By using the service, you represent
        that you have the legal capacity to enter into this agreement and comply with these Terms.
      </p>
    ),
  },
  {
    heading: "3. Accounts & Access",
    content: (
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>To access certain features, you must create an account using email/password or supported OAuth providers (e.g., Google).</li>
        <li>You are responsible for maintaining the confidentiality of your login credentials and all activities under your account.</li>
        <li>You agree to provide accurate information during registration and keep it up to date.</li>
        <li>We reserve the right to suspend or terminate accounts that violate our policies or engage in unauthorized activity.</li>
      </ul>
    ),
  },
  {
    heading: "4. Email Access & Document Processing",
    content: (
      <p>
        When you connect your email (Gmail, Outlook, IMAP), Snappin reads necessary email content
        and attachments to extract invoice and receipt data using AI. Email bodies are analyzed
        for accuracy but are not permanently stored. Extracted data and uploaded files are stored
        securely in our cloud infrastructure.
      </p>
    ),
  },
  {
    heading: "5. Acceptable Use",
    content: (
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>You may not use Snappin for illegal, fraudulent, or harmful purposes.</li>
        <li>You may not attempt to hack, disrupt, or reverse engineer any part of the platform.</li>
        <li>You may not upload or process content that violates intellectual property or data protection laws.</li>
        <li>We reserve the right to investigate and act upon any misuse, including suspension or legal action.</li>
      </ul>
    ),
  },
  {
    heading: "6. Data & Privacy",
    content: (
      <p>
        Your use of Snappin is also governed by our{" "}
        <a href="/privacy" className="text-link underline">Privacy Policy</a>, which explains
        how we collect, use, and protect your data. By using Snappin, you consent to the data
        practices described there.
      </p>
    ),
  },
  {
    heading: "7. Intellectual Property",
    content: (
      <p>
        All trademarks, software, logos, design elements, and content within Snappin are the
        property of Snappin or its licensors. You are granted a limited, non-transferable license
        to use Snappin for personal or business purposes. This license does not permit copying,
        modification, resale, or derivative works of our platform or content.
      </p>
    ),
  },
  {
    heading: "8. Subscription, Billing & Termination",
    content: (
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>Snappin may offer free and paid subscription plans. By subscribing, you agree to pay applicable fees as described at checkout.</li>
        <li>You can cancel your subscription anytime. Paid features continue until the end of the billing cycle.</li>
        <li>We reserve the right to terminate or suspend access if payment is overdue or in case of policy violations.</li>
      </ul>
    ),
  },
  {
    heading: "9. Disclaimer of Warranties",
    content: (
      <p>
        Snappin is provided &quot;as is&quot; and &quot;as available.&quot; While we strive for
        accuracy, we do not guarantee uninterrupted service, error-free data extraction, or
        absolute accuracy of results. Your use of Snappin is at your own risk.
      </p>
    ),
  },
  {
    heading: "10. Limitation of Liability",
    content: (
      <p>
        To the maximum extent permitted by law, Snappin and its affiliates are not liable for any
        indirect, incidental, or consequential damages arising from your use or inability to use
        our services. Our total liability for any claim will not exceed the amount you paid for
        the service during the last 12 months.
      </p>
    ),
  },
  {
    heading: "11. Indemnification",
    content: (
      <p>
        You agree to indemnify and hold Snappin, its officers, and employees harmless from any
        claims, damages, or losses resulting from your violation of these Terms or misuse of the
        platform.
      </p>
    ),
  },
  {
    heading: "12. Modifications to Terms",
    content: (
      <p>
        We may update or modify these Terms from time to time. Updated Terms will be posted on
        this page, and continued use of Snappin after changes constitutes acceptance of the new
        Terms.
      </p>
    ),
  },
  {
    heading: "13. Governing Law",
    content: (
      <p>
        These Terms are governed by the laws of India. Any disputes shall be subject to the
        exclusive jurisdiction of the courts in Trichy, Tamil Nadu, India.
      </p>
    ),
  },
  {
    heading: "14. Contact",
    content: (
      <p>
        Snappin, Melakottangal, Pappapatti, Musiri, Trichy, TN, India – 621208
        <br />
        Email:{" "}
        <a href="mailto:hello@snappinapp.com" className="text-link underline">
          hello@snappinapp.com
        </a>
        <br /><br />
        By using Snappin, you agree to these Terms &amp; Conditions.
      </p>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export const TermsAndConditions = () => (
  <PolicyLayout
    title="Terms & Conditions"
    description="Rules and guidelines governing your use of Snappin. Please read carefully before using our services."
    lastUpdated="October 24, 2025"
    sections={TERMS_SECTIONS}
  />
);