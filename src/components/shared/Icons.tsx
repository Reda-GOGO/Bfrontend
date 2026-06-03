
import {
  FileText,        // Facture
  ClipboardList,   // Bon de commande
  ArrowRightFromLine, // Bon de livraison
  FileEdit,        // Devis
  Minus,           // empty / no type
  Clock,           // pending
  CircleCheckBig,  // paid
  CircleX,         // cancelled
  CircleDot,       // partially paid
  type LucideIcon,
} from "lucide-react";

// ─── Type config ────────────────────────────────────────────────
type OrderTypeCfg = {
  icon: LucideIcon;
  label: string;
  bg: string;
  text: string;
  border: string;
};

const ORDER_TYPE_CONFIG: Record<string, OrderTypeCfg> = {
  all: {
    icon: undefined,
    label: "All",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border/40",
  },
  facture: {
    icon: FileText,
    label: "Facture",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-800",
  },
  bon_de_commande: {
    icon: ClipboardList,
    label: "Bon de commande",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
  },
  bon_de_livraison: {
    icon: ArrowRightFromLine,
    label: "Bon de livraison",
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-200",
  },
  devis: {
    icon: FileEdit,
    label: "Devis",
    bg: "bg-violet-50",
    text: "text-violet-800",
    border: "border-violet-200",
  },
  notSpecified: {
    icon: Minus,
    label: "Not Specified",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border/40",
  },
};

const ORDER_TYPE_FALLBACK: OrderTypeCfg = {
  icon: Minus,
  label: "—",
  bg: "bg-muted",
  text: "text-muted-foreground",
  border: "border-border/40",
};

// ─── Status config ───────────────────────────────────────────────
type OrderStatusCfg = {
  icon: LucideIcon;
  label: string;
  bg: string;
  text: string;
  border: string;
};

const ORDER_STATUS_CONFIG: Record<string, OrderStatusCfg> = {
  all: {
    icon: undefined,
    label: "All",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border/40",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-200",
  },
  paid: {
    icon: CircleCheckBig,
    label: "Paid",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
  },
  cancelled: {
    icon: CircleX,
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
  },
  partially_paid: {
    icon: CircleDot,
    label: "Partially Paid",
    bg: "bg-violet-50",
    text: "text-violet-800",
    border: "border-violet-200",
  },
};


export {
  ORDER_TYPE_CONFIG,
  ORDER_TYPE_FALLBACK,
  ORDER_STATUS_CONFIG,
  type OrderTypeCfg,
  type OrderStatusCfg,
}
