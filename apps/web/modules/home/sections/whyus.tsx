import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "../../../components/layout/sectionLayout";

const steps = [
  {
    number: "01",
    title: "Email receipts handled",
    description:
      "Connect your Gmail or Outlook. Snappin automatically finds and captures receipts from your inbox in real time, so nothing gets missed.",
    span: "md:col-span-2",
  },
  {
    number: "02",
    title: "Physical receipts handled",
    description:
      "Send a receipt photo via WhatsApp or upload it on the web. Snappin reads and extracts key details like merchant, amount, and date instantly.",
    span: "md:col-span-1",
  },
  {
    number: "03",
    title: "Synced to your tools",
    description:
      "Your receipts are automatically organized and sent to tools like QuickBooks, Xero, or Google Drive without any extra steps.",
    span: "md:col-span-1",
  },
  {
    number: "04",
    title: "Export",
    description:
      "Download all your receipts anytime as Excel or CSV, with clean data and attachments ready to use.",
    span: "md:col-span-2",
  },
];

export const WhyUs = () => {
  return (
    <Section>
      <SectionHeader>
        <SectionLabel>How does it work?</SectionLabel>
        <SectionTitle>Goodbye to <span className="bg-yellow-a3 px-2 text-yellow-600">losing receipts</span></SectionTitle>
        <SectionDescription>
          Switching between email and accounting tools leads to mistakes, delays,
          losing receipts and frustration.
        </SectionDescription>
      </SectionHeader>

      <SectionContent>
        <div className="grid z-10 p-1 grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`
                group relative flex flex-col gap-4 rounded-2xl
                bg-card border border-gray-1 p-6 cursor-default
                transition-all duration-300 ease-out
                ${step.span}
              `}
            >
              <span className="text-xs font-medium text-fg-4 tracking-widest uppercase">
                {step.number}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-fg-4">
                  {step.title}
                </h3>
                <p className="text-sm text-fg-3 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionContent>
    </Section>
  );
};