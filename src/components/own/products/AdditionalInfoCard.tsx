import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Boxes, Phone, MapPin, Truck } from "lucide-react";

export default function AdditionalInfoCard({
  price = 24,
  cost = 15,
  unit = "kg",
  vendor = {
    name: "Global Coffee Supply Co.",
    phone: "+1 (555) 483-9921",
    address: "742 Evergreen Ave, Seattle, WA",
  },
}: AdditionalInfoCardProps) {
  const margin = (((price - cost) / price) * 100).toFixed(1);

  return (
    <Card className="@container w-full bg-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Additional Information
          </CardTitle>
          <Badge variant="outline">Read only</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ================= Inventory ================= */}
        <section className="space-y-3">
          <div className="flex w-full gap-4 @md:flex-row flex-col">
            <Field label="Stock Unit">
              <Unit label="1 PIECE (PCS)" price="200.00 MAD" highlight />
            </Field>

            <Field label="Quantity Available">
              <div className="flex items-center gap-3 rounded-xl border px-4 py-5 max-sm:max-w-50 ">
                <Boxes className="h-5 w-5 text-muted-foreground" />

                <div className="flex flex-col">
                  <span className="text-lg font-semibold">100.56</span>
                  <Badge>piece (pcs)</Badge>
                </div>
              </div>
            </Field>
          </div>
        </section>

        <Separator />

        {/* ================= Vendor ================= */}
        <section className="space-y-3">
          <SectionTitle title="Vendor" />

          <div className="rounded-xl border p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>{vendor.name}</span>
            </div>

            {vendor.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{vendor.phone}</span>
              </div>
            )}

            {vendor.address && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="leading-relaxed">{vendor.address}</span>
              </div>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>;
}

function Unit({
  label,
  price,
  highlight = false,
}: {
  label: string;
  price: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 space-y-2 transition  ${highlight ? "ring-2 ring-primary/40 bg-primary/5" : "bg-background"
        }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide">{label}</span>

        {highlight && <Badge className="text-[10px]">Default</Badge>}
      </div>

      <div className="text-lg font-bold">{price}</div>
    </div>
  );
}
