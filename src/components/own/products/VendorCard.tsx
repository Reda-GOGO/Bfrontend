import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VendorCard({ formData, setFormData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label>Vendor Name</Label>
          <Input
          // value={formData.vendor.name}
          // onChange={(e) =>
          //   setFormData((prev: any) => ({
          //     ...prev,
          //     vendor: { ...prev.vendor, name: e.target.value },
          //   }))
          // }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Vendor Contact</Label>
          <Input
          // value={formData.vendor.contact}
          // onChange={(e) =>
          //   setFormData((prev: any) => ({
          //     ...prev,
          //     vendor: { ...prev.vendor, contact: e.target.value },
          //   }))
          // }
          />
        </div>
      </CardContent>
    </Card>
  );
}
