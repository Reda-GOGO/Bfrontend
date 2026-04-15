import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Camera, Lock, Mail, Globe, User, Shield,
  Bell, ChevronRight, Check, Settings2, KeyRound,
  Languages, UserCog, Loader2,
} from "lucide-react";
import { TitleLayout } from "@/components/shared/title-layout";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

const user = {
  name: "Elena Rodriguez",
  role: "Head of Engineering",
  email: "elena@nova.io",
  avatar: "https://github.com/shadcn.png",
  language: "en",
  initials: "ER",
  joined: "March 2022",
  lastSeen: "Today at 09:41",
};

// ─── Nav sections ─────────────────────────────────────────────────────────────

const NAV = [
  { id: "profile", label: "Profile", icon: UserCog, description: "Identity & contact info" },
  { id: "security", label: "Security", icon: Shield, description: "Password & access" },
  { id: "preferences", label: "Preferences", icon: Languages, description: "Language & display" },
  { id: "notifications", label: "Alerts", icon: Bell, description: "Notification preferences" },
] as const;

type SectionId = typeof NAV[number]["id"];

// ─── Motion presets ───────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 200, damping: 24, delay: i * 0.05 },
  }),
};

const panelAnim = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 240, damping: 26 } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Setting() {
  const [active, setActive] = useState<SectionId>("profile");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="flex w-full flex-col min-h-screen">
      <div className="px-0 py-1">
        <TitleLayout title="Settings" icon={<Settings2 />} />
      </div>

      {/* Identity strip */}
      <IdentityStrip />

      {/* Body: nav + panel */}
      <div className="flex flex-col lg:flex-row flex-1 gap-0 mt-6">
        {/* Left nav */}
        <aside className="lg:w-56 shrink-0">
          <nav className="space-y-0.5 lg:sticky lg:top-6">
            {NAV.map((n, i) => {
              const Icon = n.icon;
              const isActive = active === n.id;
              return (
                <motion.button
                  key={n.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  onClick={() => setActive(n.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
                    isActive
                      ? "bg-primary/8 dark:bg-primary/12 text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                  )}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm leading-none mb-0.5",
                      isActive ? "font-semibold" : "font-medium"
                    )}>
                      {n.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 truncate">{n.description}</p>
                  </div>
                  {isActive && (
                    <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </aside>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-border/30 mx-6" />

        {/* Panel */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={active} {...panelAnim}>
              {active === "profile" && <ProfilePanel />}
              {active === "security" && <SecurityPanel />}
              {active === "preferences" && <PreferencesPanel />}
              {active === "notifications" && <NotificationsPanel />}
            </motion.div>
          </AnimatePresence>

          {/* Save bar */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center justify-between mt-8 pt-5 border-t border-border/30"
          >
            <p className="text-xs text-muted-foreground/50">
              Changes are saved to your account immediately.
            </p>
            <Button
              size="sm"
              className="h-9 px-5 gap-2 text-xs font-semibold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saved && <Check className="w-3.5 h-3.5" />}
              {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// ─── Identity Strip ───────────────────────────────────────────────────────────

function IdentityStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
      className="relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm mt-4"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_50%,hsl(var(--primary)/0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,hsl(var(--primary)/0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="p-0.5 rounded-full bg-gradient-to-br from-border/60 to-border/20">
            <Avatar className="h-20 w-20 ring-2 ring-background">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <button className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1">
              <Camera className="h-4 w-4 text-white" />
              <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Change</span>
            </div>
          </button>
          {/* Online dot */}
          <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h2 className="text-xl font-black tracking-tight leading-none mb-1">
              {user.name}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">{user.role}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 rounded-full px-2.5 py-1">
              <Mail className="w-3 h-3" />
              {user.email}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 rounded-full px-2.5 py-1">
              <Globe className="w-3 h-3" />
              English
            </div>
          </div>
        </div>

        {/* Meta (desktop) */}
        <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 self-start">
          <Badge variant="secondary" className="text-[10px] font-semibold gap-1 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </Badge>
          <div className="text-right space-y-1">
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">Joined</p>
            <p className="text-xs font-semibold">{user.joined}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">Last seen</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{user.lastSeen}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
  locked,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  locked?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          {label}
        </Label>
        {locked && (
          <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" /> read-only
          </span>
        )}
      </div>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/50 leading-relaxed">{hint}</p>}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
  i = 0,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  i?: number;
}) {
  return (
    <motion.div custom={i} variants={fadeUp} initial="hidden" animate="show" className="space-y-5">
      <div>
        <h3 className="text-sm font-bold">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground/60 mt-0.5">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

// ─── Panels ───────────────────────────────────────────────────────────────────

function ProfilePanel() {
  return (
    <div className="space-y-8">
      <Section
        title="Personal information"
        description="Your public-facing identity across the workspace."
        i={0}
      >
        <Field label="Full name">
          <Input defaultValue={user.name} className="h-9 text-sm" />
        </Field>
        <Field label="Job title" hint="Shown next to your name in comments and assignments.">
          <Input defaultValue={user.role} className="h-9 text-sm" />
        </Field>
        <Field label="Email address" locked>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input disabled defaultValue={user.email} className="pl-9 h-9 text-sm bg-muted/30" />
          </div>
        </Field>
      </Section>

      <Separator className="bg-border/30" />

      <Section
        title="Avatar"
        description="A square image works best. Max 4 MB."
        i={1}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border border-border/40">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              Upload image
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
              Remove
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="space-y-8">
      <Section
        title="Change password"
        description="Use a strong password with at least 12 characters."
        i={0}
      >
        <Field label="Current password">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input type="password" className="pl-9 h-9 text-sm" placeholder="••••••••" />
          </div>
        </Field>
        <Field label="New password">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input type="password" className="pl-9 h-9 text-sm" placeholder="••••••••" />
          </div>
        </Field>
        <Field label="Confirm new password">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input type="password" className="pl-9 h-9 text-sm" placeholder="••••••••" />
          </div>
        </Field>
      </Section>

      <Separator className="bg-border/30" />

      <Section
        title="Active sessions"
        description="Devices currently logged into your account."
        i={1}
      >
        {[
          { device: "MacBook Pro 16″", location: "Casablanca, MA", time: "Now", current: true },
          { device: "iPhone 15 Pro", location: "Casablanca, MA", time: "2h ago", current: false },
        ].map((s) => (
          <div
            key={s.device}
            className="flex items-center justify-between rounded-xl border border-border/30 bg-muted/10 px-4 py-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{s.device}</p>
                {s.current && (
                  <Badge variant="secondary" className="text-[9px] px-1.5 h-4 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50">
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">{s.location} · {s.time}</p>
            </div>
            {!s.current && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                Revoke
              </Button>
            )}
          </div>
        ))}
      </Section>
    </div>
  );
}

function PreferencesPanel() {
  const [lang, setLang] = useState(user.language);

  return (
    <div className="space-y-8">
      <Section
        title="Language & region"
        description="Controls dates, numbers, and UI language."
        i={0}
      >
        <Field label="Display language">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="h-9 text-sm">
              <Globe className="mr-2 h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="fr">🇫🇷 Français</SelectItem>
              <SelectItem value="ar">🇲🇦 العربية</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <Separator className="bg-border/30" />

      <Section
        title="Appearance"
        description="Visual theme and density."
        i={1}
      >
        <Field label="Theme">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "system", label: "System" },
              { id: "light", label: "Light" },
              { id: "dark", label: "Dark" },
            ].map((t) => (
              <ThemeOption key={t.id} {...t} />
            ))}
          </div>
        </Field>
      </Section>
    </div>
  );
}

function ThemeOption({ id, label }: { id: string; label: string }) {
  const [active, setActive] = useState(id === "system");
  return (
    <button
      onClick={() => setActive(true)}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold transition-all",
        active
          ? "border-primary/40 bg-primary/5 text-primary dark:bg-primary/10"
          : "border-border/30 bg-muted/10 text-muted-foreground hover:bg-muted/25 hover:text-foreground"
      )}
    >
      {/* Mini preview */}
      <div className={cn(
        "w-full h-8 rounded-md border overflow-hidden flex",
        id === "dark" ? "bg-zinc-900 border-zinc-700" :
          id === "light" ? "bg-white border-zinc-200" :
            "bg-gradient-to-r from-white to-zinc-900 border-border/30"
      )}>
        <div className={cn("w-1/3 h-full", id === "dark" ? "bg-zinc-800" : id === "light" ? "bg-zinc-100" : "bg-zinc-100/50")} />
      </div>
      {label}
      {active && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}

function NotificationsPanel() {
  const prefs = [
    { id: "orders", label: "New orders", hint: "When a customer places an order", default: true },
    { id: "stock", label: "Low stock alerts", hint: "When stock drops below threshold", default: true },
    { id: "payments", label: "Payment updates", hint: "Paid, failed, or refunded invoices", default: false },
    { id: "reports", label: "Weekly digest", hint: "Summary of sales every Monday", default: false },
  ];

  return (
    <div className="space-y-8">
      <Section
        title="Notification preferences"
        description="Choose what you want to be notified about."
        i={0}
      >
        <div className="divide-y divide-border/20 rounded-xl border border-border/30 overflow-hidden">
          {prefs.map((p) => (
            <NotifRow key={p.id} {...p} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function NotifRow({
  label, hint, default: defaultOn,
}: {
  label: string; hint: string; default: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between px-4 py-3.5 bg-card hover:bg-muted/10 transition-colors">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{hint}</p>
      </div>
      {/* Minimal toggle */}
      <button
        onClick={() => setOn(!on)}
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0",
          on ? "bg-primary" : "bg-muted-foreground/20"
        )}
      >
        <span className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          on && "translate-x-4"
        )} />
      </button>
    </div>
  );
}
