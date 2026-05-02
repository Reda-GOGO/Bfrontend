import React, { useState, useMemo } from "react";
import {
  FileText,
  Hash,
  Settings2,
  Truck,
  ShoppingCart,
  FileSearch,
  Ban,
  Check,
  X,
  CreditCard,
  Banknote,
  Receipt,
  Wallet,
  Minus,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cols, Rows } from "@/components/shared/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldSeparator,
  Field,
  FieldLabel,
  FieldContent
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Configuration for order types
const ORDER_TYPES = [
  {
    value: "facture",
    label: "Facture",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    value: "bl",
    label: "Bon de Livraison",
    icon: Truck,
    color: "text-orange-500",
  },
  {
    value: "bc",
    label: "Bon de Commande",
    icon: ShoppingCart,
    color: "text-green-500",
  },
  {
    value: "devis",
    label: "Devis",
    icon: FileSearch,
    color: "text-purple-500",
  },
  {
    value: "none",
    label: "Without (Empty)",
    icon: Ban,
    color: "text-slate-400",
  },
];

export default function OrderConfiguration() {

  return (
    <Card className="w-full  mx-auto shadow-md border-muted-foreground/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm flex items-center gap-2">
          Order Configuration
        </CardTitle>
        <CardDescription>
          <Cols className="gap-1">
            <span className="text-muted-foreground/60 text-xs">
              Define &amp; configure order parameters such as : reference ID , payment mode , invoice type , etc...
            </span>
          </Cols>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Select Dropdown with Icons */}
        <InvoiceType />
        <PaymentMode />
        <PaymentStatus />


        {/* Reference Section */}
      </CardContent>
    </Card>
  );
}


function InvoiceType() {
  const [typeState, setTypeState] = useState<string>("Facture");

  return (
    <FieldGroup className="w-full">
      <FieldSet className="w-full">
        <FieldLegend className="w-full">
          <Rows className="justify-between items-center gap-2">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground">
              Invoice Type
            </Label>
            {/* <SelectedPill title={typeState} /> */}
          </Rows>
        </FieldLegend>
        <FieldDescription>
          Select type of Invoice Correspond to your order
        </FieldDescription>

        <FieldSet>
          <Field>
            <Rows className="gap-1 flex-wrap">
              {
                ORDER_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    onClick={() => setTypeState(type.label)}
                    variant="secondary"
                    //variant={type.label === typeState ? "default" : "secondary"}
                    //className="h-7 rounded-full text-xs "
                    className={cn(
                      " text-xs h-7  px-4 py-1 rounded-full transition-all duration-200",
                      type.label === typeState ? " border-2 border-primary " : ""
                    )}
                  >
                    {type.label}
                  </Button>
                ))
              }
            </Rows>
            <FieldDescription>
              Initial type is Facture
            </FieldDescription>
          </Field>

        </FieldSet>
      </FieldSet>
      {
        typeState === "Bon de Livraison" && <ShippingInfo />
      }
      <Button
      >
        <Settings2 className="w-4 h-4" /> Advanced Settings
      </Button>
      <FieldSeparator />
    </FieldGroup >
  )
}


function ShippingInfo() {
  return (
    <FieldGroup className="w-full">
      <FieldSeparator />
      <FieldSet className="w-full">
        <FieldLegend className="w-full">
          <Rows className="justify-between items-center gap-2">
            <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Shipping Information
            </Label>
            {/* <SelectedPill title="Shipping" /> */}
          </Rows>
        </FieldLegend>
        <FieldDescription>
          Enter your shipping information
        </FieldDescription>
        <Field>
          <FieldLabel className="w-full">
            {/* <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground"> */}
            Shipping Address
            {/* </Label> */}
          </FieldLabel>
          <Input placeholder="Enter your shipping address" />
          <FieldDescription>
            Enter your shipping address
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel className="w-full">
            {/* <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground"> */}
            Shipping Method
            {/* </Label> */}
          </FieldLabel>
          <Input placeholder="Enter your shipping method" />
          <FieldDescription>
            Enter your shipping method
          </FieldDescription>
        </Field>
      </FieldSet>
    </FieldGroup>
  )

}

function PaymentMode() {
  return (
    <div className="space-y-2">
      <FieldGroup className="w-full ">
        <FieldSet className="w-full">
          <FieldLegend variant="label" className="w-full">
            <Rows className="justify-between items-center gap-2">
              <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Payment Mode
              </Label>
              {/* <SelectedPill title="Espèce" /> */}
            </Rows>
          </FieldLegend>
          <FieldDescription>
            Select by which payment mode you want to filter your order.
          </FieldDescription>
          <FieldGroup className="gap-3">
            <Field >
              <Select
                defaultValue="espece"
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="espece">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5" /> Espèce
                    </div>
                  </SelectItem>
                  <SelectItem value="cheque">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5" /> Chèque
                    </div>
                  </SelectItem>
                  <SelectItem value="effet">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-3.5 h-3.5" /> Effet
                    </div>
                  </SelectItem>
                  <SelectItem value="virement">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5" /> Virement
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Initial mode is Espèce
              </FieldDescription>
            </Field>
          </FieldGroup>
          <FieldSeparator />
        </FieldSet>

      </FieldGroup>
    </div>
  )
}


function PaymentStatus() {
  const [status, setStatus] = useState<string>("pending");
  return (
    <div className="space-y-2">
      <FieldGroup className="w-full ">
        <FieldSet className="w-full">
          <FieldLegend variant="label" className="w-full">
            <Rows className="justify-between items-center gap-2">
              <Label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Payment Status
              </Label>
              {/* <SelectedPill title={status} /> */}
            </Rows>
          </FieldLegend>
          <FieldDescription>
            Select by which payment status you want to filter your order.
          </FieldDescription>
          <FieldGroup className="gap-3">
            <RadioGroup value={status} onValueChange={setStatus}>
              <Field orientation="horizontal">
                <RadioGroupItem
                  value="pending"
                />
                <FieldLabel>
                  <Clock className="w-3.5 h-3.5" />
                  Pending
                </FieldLabel>
              </Field>

              <Field orientation="horizontal">
                <RadioGroupItem
                  value="paid"
                />
                <FieldLabel>
                  <Check className="w-3.5 h-3.5" />
                  Paid
                </FieldLabel>
              </Field>

              <Field orientation="horizontal">
                <RadioGroupItem
                  value="partially-paid"
                />
                <FieldLabel>
                  <Minus className="w-3.5 h-3.5" />
                  Partially Paid
                </FieldLabel>
              </Field>

              <Field orientation="horizontal">
                <RadioGroupItem
                  value="cancelled"
                />
                <FieldLabel>
                  <X className="w-3.5 h-3.5" />
                  Cancelled
                </FieldLabel>
              </Field>
            </RadioGroup>
          </FieldGroup>
          <FieldDescription>
            Initial status is pending
          </FieldDescription>
        </FieldSet>
      </FieldGroup>
    </div>
  )
}



function SelectedPill({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full pl-2 pr-1 py-1">
      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
        <Check className="w-2.5 h-2.5 text-white" />
      </div>
      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 max-w-[100px] truncate pr-2">
        {title}
      </span>
      {/* <button */}
      {/*   className="w-4 h-4 rounded-full hover:bg-emerald-200/60 dark:hover:bg-emerald-800/40 flex items-center justify-center transition-colors" */}
      {/* > */}
      {/*   <X className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> */}
      {/* </button> */}
    </div>
  );
}

