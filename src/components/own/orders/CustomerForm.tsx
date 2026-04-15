import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, UserPlus, Check, X, Loader2,
  Building2, Mail, User, Phone, Hash,
  ChevronRight, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Customer = {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  ice?: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Alex Rivera", email: "alex@techflow.io", company: "TechFlow", phone: "+212 6 12 34 56 78" },
  { id: "2", name: "Sarah Chen", email: "sarah@studio24.design", company: "Studio 24", phone: "+212 6 98 76 54 32" },
  { id: "3", name: "Jordan Smith", email: "j.smith@globalmove.com", company: "Global Move" },
  { id: "4", name: "Daniel Marcos", email: "d.marcos@donrow.co", company: "Don Row", phone: "+212 7 00 11 22 33" },
  { id: "5", name: "Nour El Fassi", email: "nour@atlasgroup.ma", company: "Atlas Group" },
  { id: "6", name: "Yasmine Belhaj", email: "ybelhaj@maroc.net", company: "Belhaj & Co." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// Deterministic pastel hue from name
const PALETTE = [
  "bg-blue-100   text-blue-700   dark:bg-blue-950/50   dark:text-blue-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  "bg-amber-100  text-amber-700  dark:bg-amber-950/50  dark:text-amber-300",
  "bg-rose-100   text-rose-700   dark:bg-rose-950/50   dark:text-rose-300",
  "bg-teal-100   text-teal-700   dark:bg-teal-950/50   dark:text-teal-300",
];
function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % PALETTE.length;
  return PALETTE[idx];
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function CustomerForm({
  onSelect,
}: {
  onSelect?: (customer: Customer | null) => void;
}) {
  const [mode, setMode] = useState<"search" | "create">("search");
  const [selected, setSelected] = useState<Customer | null>(null);

  const handleSelect = (c: Customer) => {
    setSelected(c);
    onSelect?.(c);
  };

  const handleClear = () => {
    setSelected(null);
    onSelect?.(null);
  };

  return (
    <Card className="w-full border-border/50 shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <CardHeader className="pb-0 pt-5 px-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold tracking-wide">Customer</h3>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Select a client or register a new one
            </p>
          </div>
          {selected && (
            <SelectedPill customer={selected} onClear={handleClear} />
          )}
        </div>

        {/* ── Mode toggle ── */}
        <div className="flex h-8 rounded-lg bg-muted/40 p-0.5 gap-0.5 border border-border/30">
          {(["search", "create"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all duration-200",
                mode === m
                  ? "bg-background text-foreground shadow-sm border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "search"
                ? <><Search className="w-3 h-3" />Find client</>
                : <><UserPlus className="w-3 h-3" />New client</>
              }
            </button>
          ))}
        </div>
      </CardHeader>

      {/* ── Panel ── */}
      <CardContent className="px-5 pb-5 pt-4">
        <AnimatePresence mode="wait">
          {mode === "search" ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.15 }}
            >
              <SearchPanel
                selected={selected}
                onSelect={handleSelect}
              />
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
            >
              <CreatePanel
                onCreated={(c) => {
                  handleSelect(c);
                  setMode("search");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ─── Selected Pill ────────────────────────────────────────────────────────────

function SelectedPill({
  customer,
  onClear,
}: {
  customer: Customer;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full pl-2 pr-1 py-1">
      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
        <Check className="w-2.5 h-2.5 text-white" />
      </div>
      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 max-w-[100px] truncate">
        {customer.name}
      </span>
      <button
        onClick={onClear}
        className="w-4 h-4 rounded-full hover:bg-emerald-200/60 dark:hover:bg-emerald-800/40 flex items-center justify-center transition-colors"
      >
        <X className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
      </button>
    </div>
  );
}

// ─── Search Panel ─────────────────────────────────────────────────────────────

function SearchPanel({
  selected,
  onSelect,
}: {
  selected: Customer | null;
  onSelect: (c: Customer) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      (c.company?.toLowerCase().includes(query.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Name, email or company…"
          className="pl-9 h-9 text-sm bg-muted/20 border-border/40"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setQuery("")}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Results */}
      <ScrollArea className="h-[240px]">
        <div className="space-y-0.5 pr-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[180px] gap-2">
              <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground/60">No clients found</p>
              {query && (
                <p className="text-xs text-muted-foreground/40">
                  Try a different search term
                </p>
              )}
            </div>
          ) : (
            filtered.map((c) => (
              <CustomerRow
                key={c.id}
                customer={c}
                isSelected={selected?.id === c.id}
                onSelect={() => onSelect(c)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-[10px] text-muted-foreground/40 text-right">
          {filtered.length} client{filtered.length !== 1 ? "s" : ""}
          {query && ` matching "${query}"`}
        </p>
      )}
    </div>
  );
}

// ─── Customer Row ─────────────────────────────────────────────────────────────

function CustomerRow({
  customer,
  isSelected,
  onSelect,
}: {
  customer: Customer;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border",
        isSelected
          ? "border-primary/25 bg-primary/[0.04] dark:bg-primary/[0.08]"
          : "border-transparent hover:border-border/40 hover:bg-muted/20"
      )}
    >
      {/* Left accent bar */}
      <div className={cn(
        "w-0.5 h-7 rounded-full shrink-0 transition-all",
        isSelected ? "bg-primary" : "bg-transparent group-hover:bg-border/50"
      )} />

      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all",
        avatarColor(customer.name),
        isSelected && "ring-2 ring-primary/20"
      )}>
        {initials(customer.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate leading-none">{customer.name}</p>
          {customer.company && (
            <span className="text-[10px] text-muted-foreground/50 bg-muted/50 rounded-full px-1.5 py-0.5 shrink-0 font-medium hidden sm:inline">
              {customer.company}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5 truncate">{customer.email}</p>
      </div>

      {/* Trailing */}
      {isSelected ? (
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      ) : (
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
      )}
    </button>
  );
}

// ─── Create Panel ─────────────────────────────────────────────────────────────

function CreatePanel({ onCreated }: { onCreated: (c: Customer) => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", ice: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // simulate API
    setLoading(false);
    onCreated({
      id: String(Date.now()),
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || undefined,
      phone: form.phone.trim() || undefined,
      ice: form.ice.trim() || undefined,
    });
  };

  return (
    <div className="space-y-3">
      {/* Required fields */}
      <div className="space-y-2.5">
        <CreateField
          id="cf-name"
          label="Full Name"
          icon={User}
          placeholder="John Doe"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          required
        />
        <CreateField
          id="cf-email"
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="john@company.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          required
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 py-1">
        <div className="flex-1 h-px bg-border/30" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
          Optional
        </span>
        <div className="flex-1 h-px bg-border/30" />
      </div>

      {/* Optional fields */}
      <div className="space-y-2.5">
        <CreateField
          id="cf-company"
          label="Company"
          icon={Building2}
          placeholder="Acme Inc."
          value={form.company}
          onChange={set("company")}
        />
        <div className="grid grid-cols-2 gap-2">
          <CreateField
            id="cf-phone"
            label="Phone"
            icon={Phone}
            placeholder="+212 6 00 00 00 00"
            value={form.phone}
            onChange={set("phone")}
          />
          <CreateField
            id="cf-ice"
            label="ICE"
            icon={Hash}
            placeholder="000000000000000"
            value={form.ice}
            onChange={set("ice")}
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        className="w-full h-9 text-xs font-semibold gap-2 mt-1"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</>
          : <><UserPlus className="w-3.5 h-3.5" />Create & select client</>
        }
      </Button>
    </div>
  );
}

// ─── Create Field ─────────────────────────────────────────────────────────────

function CreateField({
  id, label, icon: Icon, type = "text",
  placeholder, value, onChange, error, required,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label
        htmlFor={id}
        className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
          error ? "text-destructive" : "text-muted-foreground/60"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <Icon className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5",
          error ? "text-destructive/60" : "text-muted-foreground/50"
        )} />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            "pl-9 h-9 text-sm bg-muted/20",
            error
              ? "border-destructive/50 focus-visible:ring-destructive/30"
              : "border-border/40"
          )}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-destructive" />
        )}
      </div>
      {error && (
        <p className="text-[10px] text-destructive flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
