import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent,
} from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ChevronRight,
  Eye,
  FileImage,
  Image as ImageIcon,
  Menu,
  Palette,
  RotateCcw,
  Search,
  Type,
  Upload,
  X,
} from "lucide-react";

type FieldType = 1 | 2 | 3;
type ContentField = {
  id: string;
  label: string;
  type: FieldType;
  value: string;
};
type ContentPage = {
  name: string;
  description: string;
  fields: ContentField[];
};
type FieldStyle = {
  font: string;
  size: number;
  weight: string;
  align: "left" | "center" | "right";
  color: string;
};

const initialPages: ContentPage[] = [
  {
    name: "Home Page",
    description: "Manage the content visitors see first.",
    fields: [
      {
        id: "home-title",
        label: "Hero headline",
        type: 2,
        value: "A better way to manage your work.",
      },
      {
        id: "home-description",
        label: "Hero description",
        type: 3,
        value:
          "Bring your projects, people, and plans together in one clear workspace. Make every next step easier.",
      },
      { id: "home-image", label: "Hero image", type: 1, value: "" },
      {
        id: "home-cta",
        label: "Primary button",
        type: 2,
        value: "Explore the platform",
      },
    ],
  },
  {
    name: "About Page",
    description: "Tell visitors about your team and your story.",
    fields: [
      {
        id: "about-title",
        label: "Page title",
        type: 2,
        value: "Built for better work.",
      },
      {
        id: "about-description",
        label: "About our team",
        type: 3,
        value:
          "We help teams do their best work with tools that make planning and collaboration feel simple.",
      },
      { id: "about-image", label: "Team image", type: 1, value: "" },
    ],
  },
  {
    name: "Contact Page",
    description: "Update your contact page details.",
    fields: [
      {
        id: "contact-title",
        label: "Page title",
        type: 2,
        value: "Let’s talk.",
      },
      {
        id: "contact-description",
        label: "Contact introduction",
        type: 3,
        value:
          "Have a question or an idea? Our team would be happy to hear from you.",
      },
      {
        id: "contact-email",
        label: "Contact email",
        type: 2,
        value: "hello@example.com",
      },
    ],
  },
  {
    name: "Privacy Policy Page",
    description: "Maintain the privacy information for your website.",
    fields: [
      {
        id: "privacy-title",
        label: "Page title",
        type: 2,
        value: "Privacy policy",
      },
      {
        id: "privacy-copy",
        label: "Policy content",
        type: 3,
        value:
          "We respect your privacy. This policy explains how information is collected and used when you visit our website.",
      },
    ],
  },
];

export function ContentEditor() {
  const [pages, setPages] = useState(initialPages);
  const [savedPages, setSavedPages] = useState(initialPages);
  const [activePage, setActivePage] = useState("Home Page");
  const [activeFieldId, setActiveFieldId] = useState("home-title");
  const [pageSearch, setPageSearch] = useState("");
  const [fieldSearch, setFieldSearch] = useState("");
  const [fieldStyles, setFieldStyles] = useState<Record<string, FieldStyle>>(
    {},
  );
  const [savedFieldStyles, setSavedFieldStyles] = useState<
    Record<string, FieldStyle>
  >({});
  const [appearance, setAppearance] = useState({
    accent: "#008cd2",
    background: "#ffffff",
    padding: 30,
  });
  const [savedAppearance, setSavedAppearance] = useState(appearance);
  const [split, setSplit] = useState(58);
  const [viewport, setViewport] = useState(
    typeof window === "undefined" ? 1440 : window.innerWidth,
  );
  const [showPages, setShowPages] = useState(false);
  const [toast, setToast] = useState("");
  const workspaceRef = useRef<HTMLDivElement>(null);
  const resizing = useRef(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const page = pages.find((item) => item.name === activePage) ?? pages[0];
  const savedPage = savedPages.find((item) => item.name === activePage) ?? page;
  const dirty =
    JSON.stringify(page) !== JSON.stringify(savedPage) ||
    JSON.stringify(fieldStyles) !== JSON.stringify(savedFieldStyles) ||
    JSON.stringify(appearance) !== JSON.stringify(savedAppearance);
  const visibleFields = page.fields.filter((field) =>
    `${field.label} ${field.value}`
      .toLowerCase()
      .includes(fieldSearch.toLowerCase()),
  );
  const activeField =
    visibleFields.find((field) => field.id === activeFieldId) ??
    visibleFields[0] ??
    page.fields[0];
  const currentStyle = fieldStyles[activeField?.id ?? ""] ?? {
    font: "Outfit",
    size: activeField?.type === 2 ? 34 : 17,
    weight: activeField?.type === 2 ? "600" : "400",
    align: "left" as const,
    color: "#1b2936",
  };
  const desktop = viewport > 1320;
  const tablet = viewport > 760 && viewport <= 1320;
  const filteredPages = useMemo(
    () =>
      pages.filter((item) =>
        item.name.toLowerCase().includes(pageSearch.toLowerCase()),
      ),
    [pages, pageSearch],
  );

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  function updateField(id: string, value: string) {
    setPages((items) =>
      items.map((item) =>
        item.name === activePage
          ? {
              ...item,
              fields: item.fields.map((field) =>
                field.id === id ? { ...field, value } : field,
              ),
            }
          : item,
      ),
    );
  }
  function openPage(name: string) {
    const next = pages.find((item) => item.name === name);
    setActivePage(name);
    setActiveFieldId(
      next?.fields.find((field) => field.type !== 1)?.id ??
        next?.fields[0]?.id ??
        "",
    );
    setFieldSearch("");
    setShowPages(false);
  }
  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }
  function save() {
    setSavedPages((items) =>
      items.map((item) =>
        item.name === activePage ? structuredClone(page) : item,
      ),
    );
    setSavedFieldStyles(structuredClone(fieldStyles));
    setSavedAppearance(structuredClone(appearance));
    notify("Changes saved successfully.");
  }
  function reset() {
    setPages((items) =>
      items.map((item) =>
        item.name === activePage ? structuredClone(savedPage) : item,
      ),
    );
    setFieldStyles(structuredClone(savedFieldStyles));
    setAppearance(structuredClone(savedAppearance));
    notify("Changes reset.");
  }
  function changeStyle(key: keyof FieldStyle, value: string | number) {
    if (activeField)
      setFieldStyles((items) => ({
        ...items,
        [activeField.id]: { ...currentStyle, [key]: value } as FieldStyle,
      }));
  }
  function pickImage(file: File | undefined, id: string) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Choose an image file to continue.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateField(id, String(reader.result ?? ""));
    reader.onerror = () => notify("This image could not be opened.");
    reader.readAsDataURL(file);
  }
  function resizePanes(clientX: number) {
    const rect = workspaceRef.current?.getBoundingClientRect();
    if (!rect) return;
    const available = rect.width - 225 - 14 - 24;
    if (available > 0)
      setSplit(
        Math.max(
          38,
          Math.min(72, ((clientX - rect.left - 248) / available) * 100),
        ),
      );
  }
  function resizeKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setSplit((value) => Math.max(38, value - 3));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setSplit((value) => Math.min(72, value + 3));
    }
  }

  const gridStyle: CSSProperties = {
    gridTemplateColumns: desktop
      ? `225px minmax(380px,${split}fr) 14px minmax(360px,${100 - split}fr)`
      : tablet
        ? "215px minmax(0,1fr)"
        : "minmax(0,1fr)",
  };
  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 font-sans text-slate-800 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            Website <ChevronRight size={16} /> Content
          </div>
          <h1 className="m-0 text-[30px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[34px]">
            Website content
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Manage your website content and appearance from one place.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50"
          >
            <Eye size={17} /> Preview website
          </a>
          <button
            onClick={save}
            disabled={!dirty}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#008cd2] bg-[#008cd2] px-4 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Check size={17} /> Save changes
          </button>
        </div>
      </header>
      {dirty && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <strong>Unsaved changes</strong>
          <span className="flex-1">Your changes haven’t been saved yet.</span>
          <button
            onClick={reset}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-amber-200 bg-white px-3 text-sm font-medium"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      )}
      <div
        ref={workspaceRef}
        style={gridStyle}
        className="grid items-stretch gap-x-2 gap-y-4"
      >
        <aside
          className={`${showPages || desktop || tablet ? "flex" : "hidden"} ${!desktop && !tablet && showPages ? "fixed inset-y-3 left-3 z-50 w-[min(300px,calc(100vw-24px))] shadow-2xl" : "sticky top-4 h-full self-stretch"} min-h-[610px] flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm`}
        >
          <div className="mb-4 flex items-center">
            <div className="flex-1">
              <small className="mb-1 block text-xs font-bold tracking-widest text-slate-400">
                PAGES
              </small>
              <strong className="text-lg text-slate-900">Your website</strong>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {pages.length}
            </span>
            {showPages && (
              <button
                aria-label="Close pages"
                onClick={() => setShowPages(false)}
                className="ml-2 rounded-md p-2 text-slate-600 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400 focus-within:border-sky-400">
            <Search size={16} />
            <input
              aria-label="Search pages"
              value={pageSearch}
              onChange={(event) => setPageSearch(event.target.value)}
              placeholder="Search pages"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
          <nav className="mt-3 grid gap-1">
            {filteredPages.map((item) => (
              <button
                key={item.name}
                onClick={() => openPage(item.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition ${activePage === item.name ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-50"}`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-lg border bg-white text-sm font-semibold ${activePage === item.name ? "border-sky-100 text-[#008cd2]" : "border-slate-200 text-slate-500"}`}
                >
                  {item.name.slice(0, 1)}
                </span>
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <strong className="truncate text-sm font-semibold">
                    {item.name}
                  </strong>
                  <small className="text-xs text-slate-500">
                    {item.fields.length} editable fields
                  </small>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </nav>
          <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#008cd2] text-sm font-semibold text-white">
              A
            </span>
            <span className="grid flex-1 gap-0.5">
              <strong className="text-sm">Admin account</strong>
              <small className="text-xs text-slate-500">
                Workspace administrator
              </small>
            </span>
          </div>
        </aside>
        <main className="grid h-full min-w-0 content-start gap-4">
          {!desktop && (
            <button
              onClick={() => setShowPages(true)}
              className="inline-flex h-10 items-center gap-2 justify-self-start rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
            >
              <Menu size={17} /> Pages
            </button>
          )}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-50 text-[#008cd2]">
                <Palette size={19} />
              </span>
              <span>
                <strong className="block text-lg font-semibold">
                  Appearance & styling
                </strong>
                <small className="mt-1 block text-sm text-slate-500">
                  Styles apply to the selected preview line.
                </small>
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Font family
                <select
                  value={currentStyle.font}
                  onChange={(event) => changeStyle("font", event.target.value)}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal"
                >
                  <option>Outfit</option>
                  <option>Inter</option>
                  <option>Georgia</option>
                  <option>Arial</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Font size{" "}
                <span className="font-normal text-slate-500">
                  {currentStyle.size}px
                </span>
                <input
                  type="range"
                  min="14"
                  max="48"
                  value={currentStyle.size}
                  onChange={(event) =>
                    changeStyle("size", Number(event.target.value))
                  }
                  className="w-full accent-[#008cd2]"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Font weight
                <select
                  value={currentStyle.weight}
                  onChange={(event) =>
                    changeStyle("weight", event.target.value)
                  }
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal"
                >
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                </select>
              </label>
              <div className="grid gap-2 text-sm font-semibold text-slate-700">
                Text alignment
                <div className="flex gap-2">
                  {[
                    [AlignLeft, "left"],
                    [AlignCenter, "center"],
                    [AlignRight, "right"],
                  ].map(([Icon, value]) => {
                    const AlignIcon = Icon as typeof AlignLeft;
                    return (
                      <button
                        key={value as string}
                        aria-label={`Align ${value}`}
                        onClick={() => changeStyle("align", value as string)}
                        className={`grid h-10 w-11 place-items-center rounded-lg border ${currentStyle.align === value ? "border-sky-300 bg-sky-50 text-[#008cd2]" : "border-slate-300 bg-white text-slate-600"}`}
                      >
                        <AlignIcon size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Text color
                <input
                  type="color"
                  value={currentStyle.color}
                  onChange={(event) => changeStyle("color", event.target.value)}
                  className="h-11 w-14 rounded-md border border-slate-300 bg-white p-1"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Button color
                <input
                  type="color"
                  value={appearance.accent}
                  onChange={(event) =>
                    setAppearance({ ...appearance, accent: event.target.value })
                  }
                  className="h-11 w-14 rounded-md border border-slate-300 bg-white p-1"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Page padding{" "}
                <span className="font-normal text-slate-500">
                  {appearance.padding}px
                </span>
                <input
                  type="range"
                  min="16"
                  max="56"
                  value={appearance.padding}
                  onChange={(event) =>
                    setAppearance({
                      ...appearance,
                      padding: Number(event.target.value),
                    })
                  }
                  className="w-full accent-[#008cd2]"
                />
              </label>
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-sky-700">
                  <FileImage size={16} /> PAGE EDITOR
                </span>
                <h2 className="mb-1 mt-2 text-2xl font-semibold text-slate-900">
                  {page.name}
                </h2>
                <p className="m-0 text-sm text-slate-600">{page.description}</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${dirty ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-100 bg-emerald-50 text-emerald-800"}`}
              >
                {dirty ? "Unsaved changes" : "All changes saved"}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-2">
                <strong className="text-lg font-semibold text-slate-900">
                  Content fields
                </strong>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {page.fields.length}
                </span>
              </div>
              <label className="flex h-10 w-full max-w-[250px] items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400 focus-within:border-sky-400">
                <Search size={16} />
                <input
                  aria-label="Search content fields"
                  value={fieldSearch}
                  onChange={(event) => setFieldSearch(event.target.value)}
                  placeholder="Search fields"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none focus:outline-none focus-visible:!outline-none placeholder:text-slate-400"
                />
              </label>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {visibleFields.map((field) => (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => setActiveFieldId(field.id)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${activeField?.id === field.id ? "border-sky-200 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                >
                  {field.type === 1 ? (
                    <ImageIcon size={16} />
                  ) : (
                    <Type size={16} />
                  )}
                  {field.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3">
              {visibleFields
                .filter((field) => field.id === activeField?.id)
                .map((field) => (
                  <article
                    key={field.id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    <header className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-[#008cd2]">
                        {field.type === 1 ? (
                          <ImageIcon size={18} />
                        ) : (
                          <Type size={18} />
                        )}
                      </span>
                      <span className="grid flex-1 gap-0.5">
                        <strong className="text-base font-semibold text-slate-800">
                          {field.label}
                        </strong>
                        <small className="text-xs text-slate-500">
                          {field.type === 1
                            ? "Image"
                            : field.type === 2
                              ? "Single-line text"
                              : "Multi-line text"}
                        </small>
                      </span>
                      <button
                        onClick={() => setActiveFieldId(field.id)}
                        className={`rounded-md border px-3 py-2 text-xs font-semibold ${activeFieldId === field.id ? "border-sky-200 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-600"}`}
                      >
                        {activeFieldId === field.id
                          ? "Selected for styling"
                          : "Style this line"}
                      </button>
                    </header>
                    {field.type === 1 ? (
                      <div
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          const file = event.dataTransfer.files[0];
                          if (file) pickImage(file, field.id);
                        }}
                        className="p-4"
                      >
                        <div className="grid min-h-[190px] place-items-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                          {field.value ? (
                            <img
                              src={field.value}
                              alt={field.label}
                              className="max-h-[300px] max-w-full object-cover"
                            />
                          ) : (
                            <div className="grid justify-items-center gap-2 text-sm text-slate-500">
                              <ImageIcon size={30} className="text-[#008cd2]" />
                              <strong className="text-base text-slate-800">
                                Drop an image here
                              </strong>
                              <span>PNG, JPG or WebP</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => fileRefs.current[field.id]?.click()}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
                          >
                            <Upload size={16} /> Change image
                          </button>
                          {field.value && (
                            <button
                              onClick={() => updateField(field.id, "")}
                              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-rose-700"
                            >
                              Remove image
                            </button>
                          )}
                          <input
                            ref={(element) => {
                              fileRefs.current[field.id] = element;
                            }}
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              pickImage(event.target.files?.[0], field.id);
                              event.target.value = "";
                            }}
                          />
                          <span className="text-xs text-slate-500">
                            Or drag an image into the preview area.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <label className="grid gap-2 p-4 text-sm font-semibold text-slate-700">
                        {field.type === 2
                          ? "Text content"
                          : "Long-form content"}
                        {field.type === 2 ? (
                          <input
                            value={field.value}
                            onFocus={() => setActiveFieldId(field.id)}
                            onChange={(event) =>
                              updateField(field.id, event.target.value)
                            }
                            placeholder="Enter page text"
                            className="h-12 w-full rounded-lg border border-slate-300 px-3 text-base font-normal text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                          />
                        ) : (
                          <>
                            <textarea
                              rows={5}
                              value={field.value}
                              onFocus={() => setActiveFieldId(field.id)}
                              onChange={(event) =>
                                updateField(field.id, event.target.value)
                              }
                              placeholder="Write your page content…"
                              className="min-h-32 w-full resize-y rounded-lg border border-slate-300 p-3 text-base font-normal leading-relaxed text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                            <small className="justify-self-end text-xs font-normal text-slate-500">
                              {field.value.length} characters
                            </small>
                          </>
                        )}
                      </label>
                    )}
                  </article>
                ))}
              {visibleFields.length === 0 && (
                <div className="grid justify-items-center gap-2 rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-600">
                  <Search size={26} className="text-[#008cd2]" />
                  <strong className="text-base">
                    No fields match your search
                  </strong>
                  <span className="text-sm">Try another search phrase.</span>
                </div>
              )}
            </div>
          </section>
        </main>
        {desktop && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize editor and preview"
            aria-valuemin={38}
            aria-valuemax={72}
            aria-valuenow={Math.round(split)}
            tabIndex={0}
            onKeyDown={resizeKey}
            onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
              resizing.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              resizePanes(event.clientX);
            }}
            onPointerMove={(event) => {
              if (resizing.current) resizePanes(event.clientX);
            }}
            onPointerUp={() => {
              resizing.current = false;
            }}
            onPointerCancel={() => {
              resizing.current = false;
            }}
            className="group flex h-full min-h-[610px] cursor-col-resize touch-none items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#008cd2]"
          >
            <span className="h-16 w-1 rounded-full bg-slate-300 transition group-hover:bg-[#008cd2] group-active:bg-[#008cd2]" />
          </div>
        )}
        {(desktop || tablet) && (
          <aside className="sticky top-4 grid h-full min-w-0 self-stretch content-start gap-3 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
              <h2 className="mb-0 mt-1 text-lg p-4 font-semibold text-slate-900">
                Page preview
              </h2>
            </div>
            <div
              style={{
                backgroundColor: appearance.background,
                padding: appearance.padding,
              }}
              className="min-h-[540px]"
            >
              <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
                <strong className="text-lg font-bold tracking-tight text-slate-900">
                  YATZAR MANAGE
                </strong>
                <div className="flex gap-2">
                  <span className="h-2 w-8 rounded bg-slate-200" />
                  <span className="h-2 w-8 rounded bg-slate-200" />
                  <span className="h-2 w-8 rounded bg-slate-200" />
                </div>
              </div>
              <div className="grid gap-6">
                {page.fields
                  .filter((field) => field.type !== 1)
                  .map((field, index) => {
                    const style = fieldStyles[field.id] ?? {
                      font: "Outfit",
                      size:
                        field.type === 2 && index === 0
                          ? 38
                          : field.type === 2
                            ? 20
                            : 17,
                      weight: field.type === 2 && index === 0 ? "700" : "400",
                      align: "left" as const,
                      color: "#1b2936",
                    };
                    return (
                      <div
                        key={field.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveFieldId(field.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ")
                            setActiveFieldId(field.id);
                        }}
                        style={{
                          fontFamily: style.font,
                          fontSize: style.size,
                          fontWeight: style.weight,
                          textAlign: style.align,
                          color: style.color,
                        }}
                        className={`cursor-pointer whitespace-pre-wrap rounded-md p-2 leading-relaxed outline-none transition hover:ring-2 hover:ring-[#008cd2]/30 ${activeFieldId === field.id ? "ring-2 ring-[#008cd2]" : ""}`}
                      >
                        {field.value || (
                          <span className="text-slate-400">
                            Click to add {field.label.toLowerCase()}
                          </span>
                        )}
                      </div>
                    );
                  })}
                {page.fields
                  .filter((field) => field.type === 1)
                  .map((field) =>
                    field.value ? (
                      <img
                        key={field.id}
                        src={field.value}
                        alt={field.label}
                        className="max-h-64 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        key={field.id}
                        className="grid min-h-36 place-items-center rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 text-sm font-medium text-slate-500"
                      >
                        Your image preview will appear here
                      </div>
                    ),
                  )}
                <button
                  style={{ backgroundColor: appearance.accent }}
                  className="w-fit rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Discover more <span aria-hidden="true">→</span>
                </button>
                <div className="border-t border-slate-200 pt-4 text-sm text-slate-500">
                  ● &nbsp; Built for what’s next
                </div>
              </div>
            </div>
            {/* </div> */}
          </aside>
        )}
        {!desktop && (
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 border-b border-slate-200 pb-3">
              <span className="text-xs font-bold tracking-widest text-slate-400">
                LIVE VIEW
              </span>
              <h2 className="mb-0 mt-1 text-lg font-semibold">Page preview</h2>
            </div>
            <div
              style={{
                backgroundColor: appearance.background,
                padding: appearance.padding,
              }}
              className="grid min-h-72 gap-4"
            >
              {page.fields
                .filter((field) => field.type !== 1)
                .map((field, index) => {
                  const style = fieldStyles[field.id] ?? {
                    font: "Outfit",
                    size: field.type === 2 && index === 0 ? 32 : 17,
                    weight: field.type === 2 && index === 0 ? "700" : "400",
                    align: "left" as const,
                    color: "#1b2936",
                  };
                  return (
                    <p
                      key={field.id}
                      onClick={() => setActiveFieldId(field.id)}
                      style={{
                        fontFamily: style.font,
                        fontSize: style.size,
                        fontWeight: style.weight,
                        textAlign: style.align,
                        color: style.color,
                      }}
                      className="cursor-pointer whitespace-pre-wrap"
                    >
                      {field.value}
                    </p>
                  );
                })}
            </div>
          </section>
        )}
      </div>
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
        >
          {toast}
        </div>
      )}
      {showPages && !desktop && (
        <button
          aria-label="Close pages overlay"
          onClick={() => setShowPages(false)}
          className="fixed inset-0 z-40 bg-slate-900/30"
        />
      )}
    </div>
  );
}
