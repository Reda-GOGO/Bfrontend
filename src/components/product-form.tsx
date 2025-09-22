import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Save } from "lucide-react";

/**
 * 📐 Form Schema – validates the product fields.
 */
const productSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  image: z.instanceof(FileList).optional(), // Image file (optional)
  description: z.string().min(10, "Description is too short"),
  price: z.number().nonnegative({ message: "Price must be positive" }),
  size: z.number().positive({ message: "Size must be > 0" }),
  sizeUnit: z.enum(["kg", "m", "l", "pcs"]),
  packageName: z.string().min(1, "Package / unit name required"),
  divisible: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

/**
 * 🗂 Props for the dialog
 */
interface ProductFormDialogProps {
  mode?: "create" | "edit";
  /** Default values when editing */
  defaultValues?: Partial<ProductFormValues>;
  /** Callback when form is submitted */
  onSubmit: (data: ProductFormValues) => void;
}

/**
 * 🧩 ProductFormDialog – ShadCN styled dialog to create / update products.
 */
export function ProductFormDialog({
  mode = "create",
  defaultValues,
  onSubmit,
}: ProductFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      size: 1,
      sizeUnit: "kg",
      packageName: "bag",
      divisible: false,
      ...defaultValues,
    },
  });

  const [open, setOpen] = useState(false);

  const imageFileList = watch("image");
  const previewUrl = React.useMemo(() => {
    if (!imageFileList || imageFileList.length === 0) return null;
    return URL.createObjectURL(imageFileList[0]);
  }, [imageFileList]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Product
          </Button>
        ) : (
          <Button variant="outline">Edit</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl w-full min-h-[500px] p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "create" ? "Create Product" : "Update Product"}
          </DialogTitle>
        </DialogHeader>

        {/* 🌟   Form Grid   */}
        <form
          id="product-form"
          onSubmit={handleSubmit((data) => {
            // 🔄 convert FileList -> File before submit
            onSubmit({ ...data, image: data.image });
            setOpen(false);
          })}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Product title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe your product…"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="packageName">Package Name</Label>
                <Input
                  id="packageName"
                  placeholder="e.g. bag, roll"
                  {...register("packageName")}
                />
                {errors.packageName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.packageName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                {...register("image")}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 h-32 w-full object-cover rounded-md border"
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  type="number"
                  step="0.01"
                  placeholder="25"
                  {...register("size", { valueAsNumber: true })}
                />
                {errors.size && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.size.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="sizeUnit">Unit</Label>
                <Select
                  onValueChange={(v) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore – register returns onChange type conflict; easier to set value manually
                    register("sizeUnit").onChange({ target: { value: v } });
                  }}
                  defaultValue={defaultValues?.sizeUnit ?? "pcs"}
                >
                  <SelectTrigger id="sizeUnit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { label: "Kg (kilogram)", value: "kg" },
                      { label: "Meter (m)", value: "m" },
                      { label: "Liter (l)", value: "l" },
                      { label: "Pieces (pcs)", value: "pcs" },
                    ].map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Switch id="divisible" {...register("divisible")} />
              <Label htmlFor="divisible" className="cursor-pointer">
                This package can be sold in smaller units (e.g., sell per kg)
              </Label>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
