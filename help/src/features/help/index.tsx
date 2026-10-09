import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { TOPICS, ICON_PATHS } from '../../mock/helpMock'
import type { IconProps, SearchBarProps, FaqItemProps, Article, TopicCardProps, TopicGridProps, FaqSectionProps } from '../../types/help'

const FONT = `"Outfit", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
const PAGE_X = "pl-7 pr-[22px]";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A6F4]";

function Icon({ name, size = 20, strokeWidth = 1.8, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline shrink-0 align-baseline ${className}`}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ------------------------------- Components ------------------------------- */

function PageIntro() {
  return (
    <>
      <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0f172a] dark:text-[#e5e5e5] min-[901px]:text-[42px]">
        How can we help you?
      </h1>
      <p className="mt-3.5 max-w-[500px] text-base leading-[1.55] text-[#64748b] dark:text-[#99a1af]">
        Find answers to common questions, explore guides and learn how to get the most out of Yatzar
        Manage.
      </p>
    </>
  );
}


function SearchBar({ value, onChange, onSubmit, inputRef }: SearchBarProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="mt-6 flex h-[52px] w-[min(878px,100%)] items-center gap-3.5 rounded-[10px] border border-solid border-[#e3e6eb] dark:border-[#303030] bg-white dark:bg-[#171717] pl-5 pr-1 text-[#64748b] dark:text-[#99a1af] focus-within:border-[#00A6F4] dark:focus-within:border-[#00A6F4]"
    >
      <span>
        <Icon name="search" size={21} />
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for help articles, features, or keywords..."
        aria-label="Search help articles"
        autoComplete="off"
        className="min-w-0 flex-1 border-0 bg-transparent text-[15.5px] text-[#0f172a] dark:text-[#e5e5e5] outline-none placeholder:text-[#64748b] dark:placeholder:text-[#737373]"
      />
      <button
        type="submit"
        className={`inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-[7px] border-0 bg-[#00A6F4] px-[22px] text-[15px] font-semibold text-white hover:bg-[#0094db] ${FOCUS}`}
      >
        <span>
          <Icon name="search" size={22} strokeWidth={2} />
        </span>
        <span className="max-sm:hidden">Search</span>
      </button>
    </form>
  );
}

function TopicCard({ topic, active, onSelect }: TopicCardProps) {
  const cardState = active
    ? "border-[#00A6F4] bg-[#eef8ff] dark:bg-[#112836]"
    : "border-[#e3e6eb] dark:border-[#303030] bg-white dark:bg-[#171717] hover:border-[#72c6f0] dark:hover:border-[#186b92]";

  const icoState = active ? "bg-[#e3f4fe] dark:bg-[#0c3a55] text-[#00A6F4]" : "bg-[#f1f3f6] dark:bg-[#262626] text-[#0f172a] dark:text-[#e5e5e5]";

  const textState = active
     ? "text-gray-800 dark:text-white"
     : "text-[#64748b] dark:text-[#99a1af]";

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(topic.id)}
      className={`flex h-20 cursor-pointer items-center gap-4 rounded-[10px] border border-solid pl-[18px] pr-4 text-left transition-[border-color,background-color] duration-150 ease-[ease] ${cardState} ${FOCUS}`}
    >
      <span className={`mt-1 grid h-[52px] w-[52px] place-items-center rounded-[10px] ${icoState}`}>
        <Icon name={topic.icon} size={24} />
      </span>
      <span className={`mt-1 block min-w-0 flex-1 text-[13.5px] ${textState}`}>
        <b className={`block truncate text-[15px] font-semibold ${textState}`}>{topic.title}</b>
        <span className={`mt-1 block text-[13.5px] ${textState}`}>{topic.count} articles</span>
      </span>
      <span className="mt-1 block text-[#475569] dark:text-[#d1d5dc]">
        <Icon name="chevr" size={20} strokeWidth={2} />
      </span>
    </button>
  );
}

function TopicGrid({ activeId, searching, onSelect, gridRef }: TopicGridProps) {
  return (
    <>
      <div className="mt-11 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-[-0.01em] text-[#0f172a] dark:text-[#e5e5e5]">Browse by topic</h2>
      </div>

      <div
        ref={gridRef}
        className="mt-[18px] grid grid-cols-5 gap-[17px] max-[1200px]:grid-cols-3 max-[640px]:grid-cols-1"
      >
        {TOPICS.map((t) => (
          <TopicCard key={t.id} topic={t} active={!searching && activeId === t.id} onSelect={onSelect} />
        ))}
      </div>
    </>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-[#00A6F4]/25 text-inherit">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
}

function FaqItem({ item, query, open, onToggle }: FaqItemProps) {
  return (
    <div className="border-b border-solid border-[#e3e6eb] dark:border-[#303030] last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 py-2.5 pl-[33px] pr-7 text-left text-base ${
          open
            ? "min-h-[47px] bg-[#eef8ff] dark:bg-[#112836] font-medium text-[#00A6F4]"
            : "min-h-[42px] bg-transparent font-normal text-[#0f172a] dark:text-[#e5e5e5] hover:bg-[#f1f3f6] dark:hover:bg-[#262626]"
        } ${FOCUS}`}
      >
        <span>
          <Highlight text={item.q} query={query} />
        </span>
        <span className={`grid place-items-center ${open ? "text-[#00A6F4]" : "text-[#475569] dark:text-[#d1d5dc]"}`}>
          <span className="block">
            <Icon name={open ? "minus" : "plus"} size={20} />
          </span>
        </span>
      </button>

      {open && (
        <div className="px-[33px] pb-3.5 pt-0.5">
          <p className="max-w-[780px] text-[15.5px] leading-[1.55] text-[#64748b] dark:text-[#99a1af]">{item.a}</p>
          {item.tip && (
            <div className="mt-3 flex items-center gap-3.5 rounded-lg bg-[#eef8ff] dark:bg-[#112836] px-[18px] py-3 text-sm text-[#475569] dark:text-[#d1d5dc]">
              <Icon name="bulb" size={22} className="text-[#00A6F4]" />
              <span>
                <b className="font-semibold text-[#00A6F4]">Tip:</b> {item.tip}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FaqSection({ title, badge, query, items, open, onToggle, onToggleAll }: FaqSectionProps) {
  const allOpen = items.length > 0 && open.size >= items.length;

  return (
    <>
      <div className="mt-[38px] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <h2 className="text-2xl font-semibold tracking-[-0.01em] text-[#0f172a] dark:text-[#e5e5e5]">{title}</h2>
          <span className="rounded-full bg-[#e3f4fe] dark:bg-[#0c3a55] px-3.5 py-[5px] text-sm font-medium text-[#0a86c9] dark:text-[#4cc3ff]">
            {badge}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleAll}
          className={`inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full border border-solid border-[#e3e6eb] dark:border-[#303030] bg-white dark:bg-[#171717] px-[22px] text-[15px] font-medium text-[#0f172a] dark:text-[#e5e5e5] hover:bg-[#f1f3f6] dark:hover:bg-[#262626] ${FOCUS}`}
        >
          <span>
            <Icon
              name="chevd"
              size={18}
              strokeWidth={2}
              className={`transition-transform duration-150 ease-[ease] ${allOpen ? "rotate-180" : ""}`}
            />
          </span>
          <span>{allOpen ? "Collapse all" : "Expand all"}</span>
        </button>
      </div>

      <div className="mt-[18px] overflow-hidden rounded-lg border border-solid border-[#e3e6eb] dark:border-[#303030] bg-white dark:bg-[#171717]">
        {items.length === 0 ? (
          <div className="p-10 text-center text-[#64748b] dark:text-[#99a1af]">
            No articles match “{query}”. Try a different keyword.
          </div>
        ) : (
          items.map((item, i) => (
            <FaqItem key={item.q + i} item={item} query={query} open={open.has(i)} onToggle={() => onToggle(i)} />
          ))
        )}
      </div>
    </>
  );
}

function PageHeader() {
  return (
    <div className={`flex h-[77px] items-center justify-between gap-4 ${PAGE_X}`}>
      <p className="text-xl font-semibold text-gray-800 dark:text-white/90">Help</p>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-[13px] leading-none">
          <li>
            <a href="/" className="text-[#6a7282] dark:text-[#99a1af] hover:text-[#1e2939] dark:hover:text-[#e7e6e7]">
              Home
            </a>
          </li>
          <li aria-hidden="true" className="flex text-[#6a7282] dark:text-[#99a1af]">
            <Icon name="chevr" size={16} strokeWidth={2} />
          </li>
          <li aria-current="page" className="text-[#1e2939] dark:text-[#e7e6e7]">
            Help
          </li>
        </ol>
      </nav>
    </div>
  );
}

/* ---------------------------------- Page ---------------------------------- */

export function Help() {
  const [topicId, setTopicId] = useState<string>("general");
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const [input, setInput] = useState("");
  const [query, setQuery] = useState(""); // applied (lower-cased) query

  const inputRef = useRef<HTMLInputElement>(null);
  const topicsRef = useRef<HTMLDivElement>(null);

  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];

  const items = useMemo<Article[]>(() => {
    if (!query) return topic.items;
    return TOPICS.flatMap((t) => t.items).filter((it) => `${it.q} ${it.a}`.toLowerCase().includes(query));
  }, [query, topic]);

  const title = query ? "Search results" : topic.title;
  const badge = query
    ? `${items.length} ${items.length === 1 ? "article" : "articles"}`
    : `${topic.count} articles`;

  // Ctrl/⌘ + K focuses the search field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const resetSearch = () => {
    setInput("");
    setQuery("");
  };

  const handleSelectTopic = (id: string) => {
    setTopicId(id);
    resetSearch();
    setOpen(new Set([0]));
  };

  const handleSubmit = () => {
    setQuery(input.trim().toLowerCase());
    setOpen(new Set([0]));
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (!value.trim() && query) {
      setQuery("");
      setOpen(new Set([0]));
    }
  };

  const handleToggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const handleToggleAll = () =>
    setOpen(open.size >= items.length ? new Set() : new Set(items.map((_, i) => i)));

  return (
    <div
      className="min-h-full leading-[normal] text-[#0f172a] dark:text-[#e5e5e5] antialiased"
      style={{ fontFamily: FONT }}
    >
      <PageHeader />

      <div className={`pb-14 pt-4 min-[901px]:pb-[72px] ${PAGE_X}`}>
        <PageIntro />

        <SearchBar value={input} onChange={handleInputChange} onSubmit={handleSubmit} inputRef={inputRef} />

        <TopicGrid
          activeId={topicId}
          searching={!!query}
          onSelect={handleSelectTopic}
          gridRef={topicsRef}
        />

        <FaqSection
          title={title}
          badge={badge}
          query={query}
          items={items}
          open={open}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
        />
      </div>
    </div>
  );
}