import type { Topic,IconName } from '../types/help'
import type { ReactNode } from "react";


export const TOPICS: Topic[] = [
  {
    id: "general",
    title: "General Questions",
    count: 12,
    icon: "docfill",
    items: [
      {
        q: "How do I set up automated flows for my audience?",
        a: "Create text automations and flows based on custom prebuilt audiences. Capture abandoned carts automatically, no manual setup required after the first pass.",
        tip: "You can start with prebuilt templates from the Automation section in your workspace.",
      },
      {
        q: "Can I customize the messaging used in each flow?",
        a: "Yes. Every step in a flow has its own message editor, so you can change the wording, add variables and preview the result before publishing.",
      },
      {
        q: "How are contacts grouped into audiences?",
        a: "Contacts are grouped by the rules you define, such as purchase history, location or tags. Audiences update automatically as contacts change.",
      },
      {
        q: "What happens if a customer completes their purchase mid-flow?",
        a: "The customer is removed from the flow as soon as the purchase is recorded, so they will not receive any further messages from it.",
      },
      {
        q: "Can I integrate with third-party tools?",
        a: "Yes. Connect your store, CRM and messaging tools from the Integrations section of your workspace settings.",
      },
    ],
  },
  {
    id: "support",
    title: "Support team",
    count: 8,
    icon: "users",
    items: [
      {
        q: "How do I contact the support team?",
        a: "Use the Help & Docs menu at the top right, or email support from your workspace settings. We reply within one working day.",
      },
      {
        q: "What information should I include in a support request?",
        a: "Include the project name, what you expected to happen, what happened instead and a screenshot if you can.",
      },
      {
        q: "Can I share my workspace with support?",
        a: "Yes. Add the support role to your workspace members for a limited time, then remove it once your request is closed.",
      },
    ],
  },
  {
    id: "misc",
    title: "Miscellaneous",
    count: 6,
    icon: "gear",
    items: [
      {
        q: "Which browsers are supported?",
        a: "The latest versions of Chrome, Edge, Firefox and Safari are supported.",
      },
      {
        q: "How do I switch between light and dark mode?",
        a: "Use the sun or moon icon in the top bar. Your choice applies to the whole workspace.",
      },
      {
        q: "Where can I find keyboard shortcuts?",
        a: "Press ⌘K (or Ctrl+K) to open search from any page.",
      },
    ],
  },
  {
    id: "domsectetur",
    title: "Domsectetur",
    count: 5,
    icon: "doc",
    items: [
      { q: "Sample question for this topic", a: "Replace this with the answer for your own article." },
      { q: "Another sample question", a: "Replace this with the answer for your own article." },
    ],
  },
  {
    id: "gabitasse",
    title: "Gabitasse",
    count: 7,
    icon: "book",
    items: [
      { q: "Sample question for this topic", a: "Replace this with the answer for your own article." },
      { q: "Another sample question", a: "Replace this with the answer for your own article." },
    ],
  },
];

/* ---------------------------------- Icons --------------------------------- */

export const ICON_PATHS: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevd: <path d="M6 9l6 6 6-6" />,
  chevr: <path d="M9 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  bulb: (
    <path
      d="M9 18h6M10 21h4M12 2a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V16h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0012 2z"
      fill="currentColor"
    />
  ),
  docfill: (
    <>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" fill="currentColor" />
      <path d="M9 13h6M9 17h6M9 9h2" stroke="#fff" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
      <path d="M16 4.5a3.5 3.5 0 010 7M18 14.5c2 .7 3.5 2.5 3.5 5.5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </>
  ),
  book: <path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14" />,
};