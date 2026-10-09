import type { RefObject } from 'react';

export type IconName =
  | "search"
  | "arrow"
  | "chevd"
  | "chevr"
  | "plus"
  | "minus"
  | "bulb"
  | "docfill"
  | "doc"
  | "users"
  | "gear"
  | "book";

export interface Article {
  q: string;
  a: string;
  tip?: string;
}

export interface Topic {
  id: string;
  title: string;
  count: number;
  icon: IconName;
  items: Article[];
}

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export interface FaqItemProps {
  item: Article;
  query: string;
  open: boolean;
  onToggle: () => void;
}

export interface TopicCardProps {
  topic: Topic;
  active: boolean;
  onSelect: (id: string) => void;
}

export interface TopicGridProps {
  activeId: string;
  searching: boolean;
  onSelect: (id: string) => void;
  gridRef: RefObject<HTMLDivElement | null>;
}

export interface FaqSectionProps {
  title: string;
  badge: string;
  query: string;
  items: Article[];
  open: Set<number>;
  onToggle: (index: number) => void;
  onToggleAll: () => void;
}