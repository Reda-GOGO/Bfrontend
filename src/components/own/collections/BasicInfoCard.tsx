import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Collection } from "@/types";

export default function BasicInfoCard({
  collection,
  setCollection,
  updateName,
}: {
  collection: Collection;
  setCollection: (collection: Collection) => void;
  updateName: (newName: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            value={collection.name}
            onChange={(e) => updateName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Handle</Label>
          <Input value={collection.handle} disabled />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea value={collection.description} disabled />
        </div>
      </CardContent>
    </Card>
  );
}
