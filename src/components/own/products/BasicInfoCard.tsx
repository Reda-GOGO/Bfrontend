import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function BasicInfoCard({ formData, setFormData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label>Title</Label>
          <Input
            value={formData.title}
            required
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Handle</Label>
          <Input
            value={formData.handle}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, handle: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
