import React from "react";

export type PolicySection = {
  heading: string;
  content: React.ReactNode;
};
 
// ─── Reusable Layout ──────────────────────────────────────────────────────────
 
export const PolicyLayout = ({
  title,
  description,
  lastUpdated,
  sections,
}: {
  title: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
}) => (
  <div className="max-w-xl mx-auto flex flex-col py-14 px-4">
 
    {/* Header */}
    <div className="text-center mb-10 flex flex-col items-center gap-3">
      <h1 className="text-4xl font-medium tracking-tight text-foreground">{title}</h1>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{description}</p>
      <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
        Last updated {lastUpdated}
      </span>
    </div>
 
    {/* Sections */}
    <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground">
      {sections.map((s) => (
        <div key={s.heading}>
          <h2 className="text-base font-medium mb-2">{s.heading}</h2>
          <div className="text-muted-foreground font-normal">{s.content}</div>
        </div>
      ))}
    </div>
  </div>
);