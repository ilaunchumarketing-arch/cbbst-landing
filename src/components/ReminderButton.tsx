"use client";

import { trackEvent } from "@/components/MetaPixel";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  contentName?: string;
};

export default function ReminderButton({ href, className, children, contentName }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        void trackEvent({
          name: "Lead",
          contentName: contentName ?? "Exquisite Corpses #12",
          contentCategory: "whatnot-drop",
        });
      }}
    >
      {children}
    </a>
  );
}
