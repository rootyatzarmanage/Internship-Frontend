import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  Bold,
  Heading1,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Plus,
  Quote,
  Strikethrough,
  Underline,
  Upload,
  X,
} from "lucide-react";

type PolicyKey = "privacy" | "terms" | "refund";
type MailKey =
  | "manageError"
  | "userRegister"
  | "trialStorage"
  | "workspaceNotification"
  | "paymentNotification"
  | "projectNotification"
  | "ticketNotification";
type SettingsData = {
  prefixes: string[];
  images: Record<string, string>;
  mail: Record<MailKey, string[]>;
  policies: Record<PolicyKey, string>;
};

const prefixNames = [
  "Workspace",
  "Project",
  "Registered User",
  "Invoice",
  "Offering",
  "Ticket",
  "Contact Information",
  "Book a Demo",
];
const mailFields: {
  key: MailKey;
  label: string;
  placeholder: string;
  canAdd: boolean;
}[] = [
  {
    key: "manageError",
    label: "Manage Error Mail",
    placeholder: "name@example.com",
    canAdd: true,
  },
  {
    key: "userRegister",
    label: "User Register Mail",
    placeholder: "name@example.com",
    canAdd: true,
  },
  {
    key: "trialStorage",
    label: "Trial Project Storage",
    placeholder: "Enter value",
    canAdd: false,
  },
  {
    key: "workspaceNotification",
    label: "Workspace Notification Mail",
    placeholder: "name@example.com",
    canAdd: true,
  },
  {
    key: "paymentNotification",
    label: "Payment Notification",
    placeholder: "name@example.com",
    canAdd: true,
  },
  {
    key: "projectNotification",
    label: "Project Notification",
    placeholder: "name@example.com",
    canAdd: true,
  },
  {
    key: "ticketNotification",
    label: "Ticket Notification",
    placeholder: "name@example.com",
    canAdd: true,
  },
];
const policyItems: { key: PolicyKey; label: string; title: string }[] = [
  {
    key: "privacy",
    label: "Privacy Policy",
    title: "Yatzar Manage - Privacy Policy",
  },
  {
    key: "terms",
    label: "Terms & Service",
    title: "Yatzar Manage - Terms of Service",
  },
  {
    key: "refund",
    label: "Refund Policy",
    title: "Yatzar Manage - Refund Policy",
  },
];
const initialSettings: SettingsData = {
  prefixes: prefixNames.map(() => ""),
  images: { siteLogo: "", invoiceLogo: "", invoiceSign: "" },
  mail: {
    manageError: [""],
    userRegister: [""],
    trialStorage: [""],
    workspaceNotification: [""],
    paymentNotification: [""],
    projectNotification: [""],
    ticketNotification: [""],
  },
  policies: {
    privacy:
      '<h2 style="text-align:center">Yatzar Manage - Privacy Policy</h2><p><strong>Last Updated:</strong> 15-02-2024</p><p><strong>1. Content</strong><br />Write about privacy policies</p>',
    terms:
      '<h2 style="text-align:center">Yatzar Manage - Terms of Service</h2><p><strong>Last Updated:</strong> 01-10-2024</p><p><strong>1. Introduction</strong><br />About terms and service</p>',
    refund:
      '<h2 style="text-align:center">Yatzar Manage - Refund Policy</h2><p><strong>Last Updated:</strong> 03-01-2025</p><p><strong>1. Introduction</strong><br />Refund policy appears here</p>',
  },
};
const imageItems = [
  { key: "siteLogo", label: "Site Logo" },
  { key: "invoiceLogo", label: "Invoice Logo" },
  { key: "invoiceSign", label: "Invoice Sign" },
] as const;

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <h2 className="m-0 border-b border-slate-200 px-5 py-4 text-lg font-semibold text-slate-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ContentEditor() {
  const [settings, setSettings] = useState<SettingsData>(() =>
    structuredClone(initialSettings),
  );
  const [savedSettings, setSavedSettings] = useState<SettingsData>(() =>
    structuredClone(initialSettings),
  );
  const [toast, setToast] = useState("");
  const [fontSizeInput, setFontSizeInput] = useState("14");
  const [dragOverImage, setDragOverImage] = useState<string | null>(null);
  const [dragOverPolicy, setDragOverPolicy] = useState<PolicyKey | null>(null);
  const [linkDialog, setLinkDialog] = useState<{
    key: PolicyKey;
    url: string;
    text: string;
  } | null>(null);
  const imageRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const policyImageRefs = useRef<Record<PolicyKey, HTMLInputElement | null>>({
    privacy: null,
    terms: null,
    refund: null,
  });
  const policyRefs = useRef<Record<PolicyKey, HTMLDivElement | null>>({
    privacy: null,
    terms: null,
    refund: null,
  });
  const policySelections = useRef<Record<PolicyKey, Range | null>>({
    privacy: null,
    terms: null,
    refund: null,
  });
  const dirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  useEffect(() => {
    policyItems.forEach(({ key }) => {
      const editor = policyRefs.current[key];
      if (editor && editor.innerHTML !== settings.policies[key]) {
        editor.innerHTML = settings.policies[key];
      }
    });
  }, [settings.policies]);

  useEffect(() => {
    setSettings((current) => ({
      ...current,
      policies: structuredClone(initialSettings.policies),
    }));
    setSavedSettings((current) => ({
      ...current,
      policies: structuredClone(initialSettings.policies),
    }));
  }, [initialSettings]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }
  function save() {
    setSavedSettings(structuredClone(settings));
    notify("Control panel settings saved.");
  }
  function cancel() {
    setSettings(structuredClone(savedSettings));
    policyItems.forEach(({ key }) => {
      const editor = policyRefs.current[key];
      if (editor) editor.innerHTML = savedSettings.policies[key];
    });
    notify("Unsaved changes discarded.");
  }
  function updatePrefix(index: number, value: string) {
    setSettings((current) => ({
      ...current,
      prefixes: current.prefixes.map((prefix, i) =>
        i === index ? value : prefix,
      ),
    }));
  }
  function updateMail(key: MailKey, index: number, value: string) {
    setSettings((current) => ({
      ...current,
      mail: {
        ...current.mail,
        [key]: current.mail[key].map((item, i) => (i === index ? value : item)),
      },
    }));
  }
  function addMail(key: MailKey) {
    setSettings((current) => ({
      ...current,
      mail: { ...current.mail, [key]: [...current.mail[key], ""] },
    }));
  }
  function removeMail(key: MailKey, index: number) {
    setSettings((current) => ({
      ...current,
      mail: {
        ...current.mail,
        [key]: current.mail[key].filter((_, i) => i !== index),
      },
    }));
  }
  function readImage(key: string, file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Choose an image file to upload.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setSettings((current) => ({
        ...current,
        images: { ...current.images, [key]: String(reader.result ?? "") },
      }));
    reader.readAsDataURL(file);
  }
  function onImageDrop(event: DragEvent<HTMLButtonElement>, key: string) {
    event.preventDefault();
    setDragOverImage(null);
    readImage(key, event.dataTransfer.files[0]);
  }
  function updatePolicy(key: PolicyKey, html: string) {
    setSettings((current) => ({
      ...current,
      policies: { ...current.policies, [key]: html },
    }));
  }
  function rememberPolicySelection(key: PolicyKey) {
    const selection = window.getSelection();
    const editor = policyRefs.current[key];
    const range =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    policySelections.current[key] =
      editor &&
      range &&
      editor.contains(range.startContainer) &&
      editor.contains(range.endContainer)
        ? range.cloneRange()
        : null;
  }
  function restorePolicySelection(key: PolicyKey) {
    const editor = policyRefs.current[key];
    const range = policySelections.current[key];
    if (!editor || !range || !editor.contains(range.startContainer)) {
      editor?.focus();
      return;
    }
    editor.focus();
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  function formatPolicy(key: PolicyKey, command: string, value?: string) {
    restorePolicySelection(key);
    document.execCommand(command, false, value);
    const editor = policyRefs.current[key];
    if (editor) {
      updatePolicy(key, editor.innerHTML);
      rememberPolicySelection(key);
    }
  }
  function applyPolicyFontSize(key: PolicyKey, size: number) {
    if (!Number.isFinite(size)) return;
    const normalizedSize = Math.min(96, Math.max(8, size));
    setFontSizeInput(String(normalizedSize));
    restorePolicySelection(key);
    const editor = policyRefs.current[key];
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = normalizedSize + "px";
    if (range.collapsed) {
      const text = document.createTextNode("\u200b");
      span.appendChild(text);
      range.insertNode(span);
      range.setStart(text, 1);
      range.collapse(true);
    } else {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    updatePolicy(key, editor.innerHTML);
    rememberPolicySelection(key);
  }
  function openLinkDialog(key: PolicyKey) {
    rememberPolicySelection(key);
    const selectedRange = policySelections.current[key];
    setLinkDialog({
      key,
      url: "https://",
      text: selectedRange?.toString() ?? "",
    });
  }
  function insertPolicyLink() {
    if (!linkDialog) return;
    const url = linkDialog.url.trim();
    const isWebUrl = (() => {
      try {
        const parsedUrl = new URL(url);
        return (
          parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
        );
      } catch {
        return false;
      }
    })();
    const isContactUrl = /^(mailto:|tel:)\S+$/i.test(url);
    if (!isWebUrl && !isContactUrl) {
      notify("Enter a link starting with https://, mailto:, or tel:.");
      return;
    }
    const editor = policyRefs.current[linkDialog.key];
    const selection = window.getSelection();
    if (!editor || !selection) return;
    const savedRange = policySelections.current[linkDialog.key];
    const range =
      savedRange &&
      editor.contains(savedRange.startContainer) &&
      editor.contains(savedRange.endContainer)
        ? savedRange.cloneRange()
        : document.createRange();
    if (
      !savedRange ||
      !editor.contains(savedRange.startContainer) ||
      !editor.contains(savedRange.endContainer)
    ) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    editor.focus();
    selection.removeAllRanges();
    selection.addRange(range);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.style.color = "#008cd2";
    anchor.style.textDecoration = "underline";
    anchor.style.cursor = "pointer";
    if (range.collapsed) {
      anchor.textContent = linkDialog.text.trim() || url;
    } else {
      anchor.appendChild(range.extractContents());
      if (!anchor.textContent?.trim())
        anchor.textContent = linkDialog.text.trim() || url;
    }
    range.deleteContents();
    range.insertNode(anchor);
    range.setStartAfter(anchor);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    updatePolicy(linkDialog.key, editor.innerHTML);
    rememberPolicySelection(linkDialog.key);
    setLinkDialog(null);
  }
  function insertPolicyImage(key: PolicyKey, file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Choose an image file to insert.");
      return;
    }
    const editor = policyRefs.current[key];
    if (!editor) return;
    restorePolicySelection(key);
    const reader = new FileReader();
    reader.onload = () => {
      restorePolicySelection(key);
      document.execCommand("insertImage", false, String(reader.result ?? ""));
      updatePolicy(key, editor.innerHTML);
      rememberPolicySelection(key);
    };
    reader.readAsDataURL(file);
  }
  function onPolicyImageDrop(event: DragEvent<HTMLDivElement>, key: PolicyKey) {
    event.preventDefault();
    setDragOverPolicy(null);
    const editor = policyRefs.current[key];
    if (!editor) return;
    const caret = document.caretPositionFromPoint?.(
      event.clientX,
      event.clientY,
    );
    const range = document.createRange();
    if (caret && editor.contains(caret.offsetNode)) {
      range.setStart(caret.offsetNode, caret.offset);
    } else {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    rememberPolicySelection(key);
    insertPolicyImage(key, event.dataTransfer.files[0]);
  }

  return (
    <div className="min-h-full bg-slate-50 px-5 py-7 text-slate-900 sm:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="m-0 text-xl font-semibold">Control Panel</h1>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Home</span>
          <span className="text-slate-400">›</span>
          <span className="text-slate-900">Control Panel</span>
        </div>
      </header>

      <div className="grid gap-5">
        <SectionCard title="ID Configurations">
          <div className="grid grid-cols-[56px_minmax(180px,1fr)_minmax(240px,1.1fr)] border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 max-sm:grid-cols-[38px_minmax(115px,1fr)_minmax(150px,1.2fr)]">
            <span>S.No</span>
            <span>Name</span>
            <span>Name Prefix</span>
          </div>
          {prefixNames.map((name, index) => (
            <div
              key={name}
              className="grid min-h-[50px] grid-cols-[56px_minmax(180px,1fr)_minmax(240px,1.1fr)] items-center border-b border-slate-100 px-5 py-2 last:border-b-0 max-sm:grid-cols-[38px_minmax(115px,1fr)_minmax(150px,1.2fr)]"
            >
              <span className="text-sm">{index + 1}</span>
              <span className="pr-5 text-sm font-medium text-slate-700">
                {name}
              </span>
              <input
                value={settings.prefixes[index]}
                onChange={(event) => updatePrefix(index, event.target.value)}
                placeholder="Enter value"
                aria-label={name + " prefix"}
                className="placeholder:text-sm h-9 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#008cd2] focus-visible:!outline-none"
              />
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Images">
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
            {imageItems.map(({ key, label }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  {label}
                </label>
                <button
                  type="button"
                  onClick={() => imageRefs.current[key]?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setDragOverImage(key);
                  }}
                  onDragLeave={(event) => {
                    if (
                      !event.currentTarget.contains(event.relatedTarget as Node)
                    ) {
                      setDragOverImage(null);
                    }
                  }}
                  onDrop={(event) => onImageDrop(event, key)}
                  className={`group grid h-32 w-full place-items-center overflow-hidden rounded-md border border-dashed text-sm text-slate-500 transition hover:border-[#008cd2] hover:bg-sky-50/40 ${dragOverImage === key ? "border-[#008cd2] bg-sky-50 ring-2 ring-sky-100" : "border-slate-300 bg-slate-50/60"}`}
                >
                  {settings.images[key] ? (
                    <img
                      src={settings.images[key]}
                      alt={label}
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <span className="grid justify-items-center gap-2 px-3 text-center text-sm">
                      <Upload
                        size={19}
                        className="text-slate-500 group-hover:text-[#008cd2]"
                      />
                      {dragOverImage === key
                        ? "Drop image to upload"
                        : "Drag and drop an image here, or click to upload"}
                      <span className="text-xs text-slate-400">
                        PNG, JPG, GIF, or WebP
                      </span>
                    </span>
                  )}
                </button>
                <input
                  ref={(element) => {
                    imageRefs.current[key] = element;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    readImage(key, event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Mail & Settings">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 md:grid-cols-2">
            {mailFields.map(({ key, label, placeholder, canAdd }) => (
              <div key={key} className="min-w-0">
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  {label}
                </label>
                <div className="grid gap-2">
                  {settings.mail[key].map((value, index) => (
                    <div
                      key={key + "-" + index}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={value}
                        onChange={(event) =>
                          updateMail(key, index, event.target.value)
                        }
                        placeholder={index === 0 ? placeholder : "CC mail id"}
                        aria-label={label + " " + (index + 1)}
                        className="placeholder:text-sm h-9 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#008cd2] focus-visible:!outline-none"
                      />
                      {canAdd && index === 0 && (
                        <button
                          type="button"
                          onClick={() => addMail(key)}
                          aria-label={"Add " + label}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[#008cd2] bg-sky-50 text-[#008cd2] hover:bg-sky-100"
                        >
                          <Plus size={17} />
                        </button>
                      )}
                      {canAdd && index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeMail(key, index)}
                          aria-label="Remove email"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Policies">
          <div className="grid gap-5 p-5">
            {policyItems.map(({ key, label }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  {label}
                </label>
                <div className="overflow-hidden rounded-md border border-slate-200 focus-within:border-[#008cd2]">
                  <div
                    onMouseDown={() => rememberPolicySelection(key)}
                    className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2"
                  >
                    <select
                      aria-label="Font size"
                      title="Choose a font size"
                      value={fontSizeInput}
                      onChange={(event) =>
                        applyPolicyFontSize(key, Number(event.target.value))
                      }
                      className="h-8 w-20 rounded border-0 bg-transparent px-2 text-sm outline-none"
                    >
                      {[
                        8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26,
                        28, 32, 36, 40, 48, 56, 64, 72, 96,
                      ].map((size) => (
                        <option key={size} value={size}>
                          {size}px
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Font family"
                      onChange={(event) =>
                        formatPolicy(key, "fontName", event.target.value)
                      }
                      className="h-8 rounded border-0 bg-transparent px-2 text-sm outline-none"
                    >
                      <option>Outfit</option>
                      <option>Arial</option>
                      <option>Georgia</option>
                      <option>Inter</option>
                    </select>
                    <select
                      aria-label="Text style"
                      onChange={(event) =>
                        formatPolicy(key, "formatBlock", event.target.value)
                      }
                      className="h-8 w-24 rounded border-0 bg-transparent px-2 text-sm outline-none"
                    >
                      <option value="P">Normal</option>
                      <option value="H1">H1</option>
                      <option value="H2">H2</option>
                      <option value="H3">H3</option>
                    </select>
                    <ToolbarButton
                      label="Bold"
                      onClick={() => formatPolicy(key, "bold")}
                    >
                      <Bold size={15} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Italic"
                      onClick={() => formatPolicy(key, "italic")}
                    >
                      <Italic size={15} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Underline"
                      onClick={() => formatPolicy(key, "underline")}
                    >
                      <Underline size={15} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Strikethrough"
                      onClick={() => formatPolicy(key, "strikeThrough")}
                    >
                      <Strikethrough size={15} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Heading"
                      onClick={() => formatPolicy(key, "formatBlock", "H1")}
                    >
                      <Heading1 size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Bullet list"
                      onClick={() => formatPolicy(key, "insertUnorderedList")}
                    >
                      <List size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Numbered list"
                      onClick={() => formatPolicy(key, "insertOrderedList")}
                    >
                      <ListOrdered size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Quote"
                      onClick={() =>
                        formatPolicy(key, "formatBlock", "BLOCKQUOTE")
                      }
                    >
                      <Quote size={15} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Link"
                      onClick={() => openLinkDialog(key)}
                    >
                      <Link size={15} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Insert image"
                      onClick={() => {
                        rememberPolicySelection(key);
                        policyImageRefs.current[key]?.click();
                      }}
                    >
                      <ImageIcon size={15} />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Clear formatting"
                      onClick={() => formatPolicy(key, "removeFormat")}
                    >
                      <span className="text-xs font-semibold">Tx</span>
                    </ToolbarButton>
                  </div>
                  <input
                    ref={(element) => {
                      policyImageRefs.current[key] = element;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      insertPolicyImage(key, event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                  <div
                    ref={(element) => {
                      policyRefs.current[key] = element;
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    onDragOver={(event) => event.preventDefault()}
                    onDragEnter={(event) => {
                      event.preventDefault();
                      setDragOverPolicy(key);
                    }}
                    onDragLeave={(event) => {
                      if (
                        !event.currentTarget.contains(
                          event.relatedTarget as Node,
                        )
                      ) {
                        setDragOverPolicy(null);
                      }
                    }}
                    onDrop={(event) => onPolicyImageDrop(event, key)}
                    onInput={(event) =>
                      updatePolicy(key, event.currentTarget.innerHTML)
                    }
                    role="textbox"
                    aria-label={label + " content"}
                    aria-multiline="true"
                    spellCheck
                    className={`min-h-[220px] px-4 py-3 text-sm leading-7 outline-none focus-visible:!outline-none [&_h1]:my-3 [&_h1]:text-2xl [&_h2]:my-3 [&_h2]:text-xl [&_p]:my-3 ${dragOverPolicy === key ? "bg-sky-50 ring-2 ring-inset ring-[#008cd2]" : ""}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="flex justify-center gap-3 py-6">
        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={!dirty}
          className="rounded-md bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      {linkDialog && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLinkDialog(null);
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-link-title"
            onSubmit={(event) => {
              event.preventDefault();
              insertPolicyLink();
            }}
            className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h2
              id="policy-link-title"
              className="mb-5 mt-0 text-lg font-semibold text-slate-900"
            >
              Add link
            </h2>
            <label className="mb-4 grid gap-2 text-sm font-medium text-slate-700">
              Link URL
              <input
                autoFocus
                type="text"
                inputMode="url"
                value={linkDialog.url}
                onChange={(event) =>
                  setLinkDialog({ ...linkDialog, url: event.target.value })
                }
                placeholder="https://example.com"
                className="h-10 rounded-md border border-slate-300 px-3 font-normal outline-none focus:border-[#008cd2] focus:ring-2 focus:ring-sky-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Link text
              <input
                value={linkDialog.text}
                onChange={(event) =>
                  setLinkDialog({ ...linkDialog, text: event.target.value })
                }
                placeholder="Select text in the policy or enter link text"
                className="h-10 rounded-md border border-slate-300 px-3 font-normal outline-none focus:border-[#008cd2] focus:ring-2 focus:ring-sky-100"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLinkDialog(null)}
                className="h-10 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-md bg-[#008cd2] px-4 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Add link
              </button>
            </div>
          </form>
        </div>
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="grid h-8 min-w-8 place-items-center rounded px-1.5 text-slate-700 hover:bg-sky-100 hover:text-[#008cd2]"
    >
      {children}
    </button>
  );
}
