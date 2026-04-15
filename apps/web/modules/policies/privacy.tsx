import React from "react";
import { PolicyLayout, PolicySection } from "../../components/layout/policy.layout";


const PRIVACY_SECTIONS: PolicySection[] = [
  {
    heading: "Overview",
    content: (
      <p>
        Snappin (&quot;we&quot;, &quot;our&quot;, &quot;Snappin&quot;) operates https://snappinapp.com. We respect your privacy
        and are committed to protecting your personal data. This Privacy Policy explains what
        information we collect, why we collect it, how we use it, and your rights.
        <br /><br />
        Contact: <a href="mailto:hello@snappinapp.com" className="text-link underline">hello@snappinapp.com</a>
        <br />
        Registered office: Snappin, Melakottangal, Pappapatti, Musiri, Trichy, TN, India – 621208
      </p>
    ),
  },
  {
    heading: "1. Information We Collect",
    content: (
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li><strong className="font-medium text-foreground">Account & Contact Data:</strong> name, email address, login credentials and profile details when you create an account.</li>
        <li><strong className="font-medium text-foreground">Email Integrations:</strong> when you connect Gmail/Outlook/IMAP, our service accesses data required to detect and extract invoices, receipts, and bills. Only extracted document data and metadata are retained — not raw email bodies.</li>
        <li><strong className="font-medium text-foreground">Uploaded Documents:</strong> files you upload are stored securely in our cloud.</li>
        <li><strong className="font-medium text-foreground">Usage & Analytics:</strong> we use DataFast for product analytics to understand usage patterns.</li>
        <li><strong className="font-medium text-foreground">Technical & Device Data:</strong> IP address, device/browser info, and cookies for security, performance, and analytics.</li>
      </ul>
    ),
  },
  {
    heading: "2. How We Use Your Data",
    content: (
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>Provide, operate, and maintain Snappin&apos;s document extraction features</li>
        <li>Improve accuracy of our extraction models and product experience</li>
        <li>Process payments and handle billing</li>
        <li>Communicate with you about your account and important updates</li>
        <li>Detect and prevent fraud and abuse</li>
        <li>Comply with legal obligations</li>
      </ul>
    ),
  },
  {
    heading: "3. Sharing & Third Parties",
    content: (
      <p>
        We do not sell personal data. We may share data with service providers (AWS, Google Cloud,
        DataFast, payment processors) only to the extent necessary to provide the service, with
        legal authorities when required by law, and in connection with a business transfer where
        we will notify affected users where required.
      </p>
    ),
  },
  {
    heading: "4. Storage, Security & International Transfers",
    content: (
      <p>
        Data is stored on secure cloud infrastructure (AWS and Google Cloud) with encryption at
        rest and in transit, access controls, and monitoring. Data may be transferred to and
        processed in jurisdictions outside your country of residence.
      </p>
    ),
  },
  {
    heading: "5. Data Retention & Deletion",
    content: (
      <p>
        We retain data only as long as necessary to provide the service and comply with legal
        obligations. Account deletion requests are processed within 30 days. To request deletion
        or export of your data, contact{" "}
        <a href="mailto:hello@snappinapp.com" className="text-link underline">hello@snappinapp.com</a>.
      </p>
    ),
  },
  {
    heading: "6. User Rights & Choices (GDPR / CCPA)",
    content: (
      <p>
        Where applicable, you may have rights including access, correction, deletion, portability,
        and objection to certain processing. EU/EEA and California residents may have additional
        legal rights. Contact us at{" "}
        <a href="mailto:hello@snappinapp.com" className="text-link underline">hello@snappinapp.com</a>{" "}
        to exercise your rights.
      </p>
    ),
  },
  {
    heading: "7. Cookies & Tracking",
    content: (
      <p>
        We use cookies for session management, security, and analytics (DataFast). You can control
        cookies via your browser settings — blocking cookies may affect certain functionality.
      </p>
    ),
  },
  {
    heading: "8. Children's Privacy",
    content: (
      <p>
        Snappin is not intended for children under 13. We do not knowingly collect personal
        information from children under 13. Contact us if you believe we have collected such
        information and we will delete it promptly.
      </p>
    ),
  },
  {
    heading: "9. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Material changes will be communicated
        via email or through the product prior to taking effect.
      </p>
    ),
  },
  {
    heading: "10. Contact Us",
    content: (
      <p>
        For privacy questions, data requests, or concerns:{" "}
        <a href="mailto:hello@snappinapp.com" className="text-link underline">hello@snappinapp.com</a>.
        <br /><br />
        By using Snappin, you agree to this Privacy Policy.
      </p>
    ),
  },
];
 
// ─── Page ─────────────────────────────────────────────────────────────────────
 
export const PrivacyPolicy = () => (
  <PolicyLayout
    title="Privacy Policy"
    description="How we protect your privacy, what data we collect, and your rights over your information. Your data always belongs to you, not us."
    lastUpdated="October 24, 2025"
    sections={PRIVACY_SECTIONS}
  />
)