import Back from "@/components/own/Back";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function CreateProductAlert() {
	return (
		<div className="flex flex-row gap-2">
			<Button variant="secondary" className="max-sm:w-24 w-full capitalize">
				discard
			</Button>
			<Button className="max-sm:w-24 w-full capitalize">save</Button>
		</div>
	);
}

export default function Create() {
	const [formData, setFormData] = useState({
		title: "",
		handle: "",
		description: "",
		price: 1,
		cost: 0,
		profit: 0,
		margin: 0,
		baseUnit: { name: "", price: "" },
		units: [] as { name: string; price: string; conversion: string }[],
		inventory: { unit: "", quantity: "" },
		vendor: { name: "", contact: "" },
		image: null as File | null,
		imagePreview: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const form = new FormData();

		// append file (multer will pick this up as req.file)
		if (formData.image) {
			form.append("image", formData.image);
		}

		// append product fields
		form.append("name", formData.title);
		form.append("handle", formData.handle);
		form.append("description", formData.description);
		form.append("cost", String(formData.cost));
		form.append("price", String(formData.price));
		form.append("unit", formData.baseUnit.name);
		form.append("vendorName", formData.vendor.name);
		form.append("vendorContact", formData.vendor.contact);

		// append units (array → JSON string)
		form.append(
			"units",
			JSON.stringify(
				formData.units.map((u) => ({
					name: u.name,
					price: Number(u.price),
					quantityInBase: Number(u.conversion),
				})),
			),
		);

		// append inventory
		form.append(
			"inventory",
			JSON.stringify({
				unit: formData.inventory.unit,
				quantity: Number(formData.inventory.quantity),
			}),
		);

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
				method: "POST",
				body: form,
			});

			const data = await res.json();
			console.log("Saved product:", data);
		} catch (err) {
			console.error("Error saving product:", err);
		}
	};

	return (
		<>
			<Back>
				<form
					onSubmit={(e) => handleSubmit(e)}
					className="lg:grid lg:grid-cols-3 w-full gap-4 xl:px-46"
				>
					<div className="lg:col-span-2 flex flex-col gap-2">
						<BasicInfoCard formData={formData} setFormData={setFormData} />
						<PricingCard formData={formData} setFormData={setFormData} />
						<SellingUnitsCard formData={formData} setFormData={setFormData} />
					</div>

					<div className="lg:col-span-1 max-lg:py-4 flex flex-col gap-2">
						<MediaCard formData={formData} setFormData={setFormData} />
						<InventoryCard formData={formData} setFormData={setFormData} />
						<VendorCard formData={formData} setFormData={setFormData} />
					</div>
				</form>

				<div className="w-full flex max-sm:justify-center justify-end sm:pr-24 items-center">
					<Button
						type="submit"
						className="mt-6 w-[220px]"
						onClick={(e) => handleSubmit(e)}
					>
						Save Product
					</Button>
				</div>
			</Back>
		</>
	);
}

import { Textarea } from "@/components/ui/textarea";

export function BasicInfoCard({ formData, setFormData }: any) {
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function PricingCard({ formData, setFormData }: any) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Pricing</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<div className="flex flex-row w-full gap-2 py-4">
					<div className="flex w-full flex-col gap-2">
						<Label>Price</Label>
						<Input
							type="number"
							value={formData.price}
							onChange={(e) =>
								setFormData((prev: any) => ({
									...prev,
									price: e.target.value,
								}))
							}
						/>
					</div>
					<div className="flex w-full flex-col gap-2">
						<Label>Cost</Label>
						<Input
							type="number"
							value={formData.cost}
							onChange={(e) =>
								setFormData((prev: any) => ({ ...prev, cost: e.target.value }))
							}
						/>
					</div>
				</div>
				<Separator />
				<div className="flex flex-row w-full gap-2 py-4">
					<div className="flex w-full flex-col gap-2">
						<Label>Profit</Label>
						<Input
							type="number"
							value={formData.price - formData.cost}
							disabled
							onChange={(e) =>
								setFormData((prev: any) => ({
									...prev,
									profit: e.target.value,
								}))
							}
						/>
					</div>
					<div className="flex w-full flex-col gap-2">
						<Label>Margin</Label>
						<Input
							type="number"
							value={parseFloat(
								((formData.price - formData.cost) / formData.price) * 100,
							).toFixed(2)}
							disabled
							onChange={(e) =>
								setFormData((prev: any) => ({
									...prev,
									margin: e.target.value,
								}))
							}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function InventoryCard({ formData, setFormData }: any) {
	// Build options safely
	const options = [
		formData.baseUnit?.name,
		...(formData.units || []).map((u: any) => u?.name),
		formData.inventoryUnit, // explicitly include current inventoryUnit
	].filter((v) => typeof v === "string" && v.trim() !== ""); // ✅ only keep non-empty strings

	// Ensure unique values
	const uniqueOptions = Array.from(new Set(options));

	console.log("InventoryUnit value:", formData.inventoryUnit);
	console.log("Options:", uniqueOptions);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Inventory</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Label>Select Unit for Inventory</Label>
					{uniqueOptions.length > 0 && (
						<Select
							value={formData.inventoryUnit ?? undefined}
							onValueChange={(val) =>
								setFormData((prev: any) => ({
									...prev,
									inventoryUnit: val,
								}))
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select unit" />
							</SelectTrigger>
							<SelectContent>
								{uniqueOptions.map((opt, idx) => (
									<SelectItem key={idx} value={opt}>
										{opt}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<Label>Quantity</Label>
					<Input
						type="number"
						value={formData.inventoryQuantity}
						onChange={(e) =>
							setFormData((prev: any) => ({
								...prev,
								inventoryQuantity: e.target.value,
							}))
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export function VendorCard({ formData, setFormData }: any) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Vendor Information</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<div className="flex flex-col gap-2">
					<Label>Vendor Name</Label>
					<Input
						value={formData.vendor.name}
						onChange={(e) =>
							setFormData((prev: any) => ({
								...prev,
								vendor: { ...prev.vendor, name: e.target.value },
							}))
						}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label>Vendor Contact</Label>
					<Input
						value={formData.vendor.contact}
						onChange={(e) =>
							setFormData((prev: any) => ({
								...prev,
								vendor: { ...prev.vendor, contact: e.target.value },
							}))
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

import { BookImage, CirclePlus, Trash2 } from "lucide-react";

export function MediaCard({ formData, setFormData }: any) {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		if (file) {
			const preview = URL.createObjectURL(file);
			setFormData((prev: any) => ({
				...prev,
				image: file,
				imagePreview: preview,
			}));
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Media</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2 items-center px-6">
				{formData.imagePreview ? (
					<div className="flex flex-col items-center gap-2">
						<img
							src={formData.imagePreview}
							alt="Preview"
							className="w-40 h-40 object-cover rounded-full border"
						/>
						<Button
							type="button"
							variant="outline"
							onClick={() => document.getElementById("imageInput")?.click()}
						>
							Change Image
						</Button>
					</div>
				) : (
					<Label>
						<div className="w-40 rounded-full bg-secondary dark:bg-background h-40 flex items-center justify-center">
							<BookImage />
							<Input
								id="imageInput"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleFileChange}
							/>
						</div>
					</Label>
				)}
			</CardContent>
		</Card>
	);
}

export function SellingUnitsCard({
	formData,
	setFormData,
}: {
	formData: any;
	setFormData: any;
}) {
	const baseUnit = formData.baseUnit;
	const units = formData.units;

	const handleAddUnit = (e: Event) => {
		e.preventDefault();
		setFormData((prev: any) => ({
			...prev,
			units: [...prev.units, { name: "", price: "", conversion: "" }],
		}));
	};

	const handleChangeUnit = (
		index: number,
		field: "name" | "price" | "conversion",
		value: string,
	) => {
		const newUnits = [...units];
		newUnits[index][field] = value;
		setFormData((prev: any) => ({ ...prev, units: newUnits }));
	};

	const handleRemoveUnit = (index: number) => {
		const newUnits = [...units];
		newUnits.splice(index, 1);
		setFormData((prev: any) => ({ ...prev, units: newUnits }));
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Selling Units</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				{/* Base Unit */}
				<div className="space-y-2 border p-4 rounded-md">
					<h4 className="font-semibold text-sm text-muted-foreground">
						Base Unit
					</h4>
					<div className="flex flex-row w-full gap-4">
						<div className="flex w-full flex-col gap-2">
							<Label>Name</Label>
							<Input
								placeholder="e.g. Packet"
								value={baseUnit.name}
								onChange={(e) =>
									setFormData((prev: any) => ({
										...prev,
										baseUnit: { ...prev.baseUnit, name: e.target.value },
									}))
								}
							/>
						</div>
						<div className="flex w-full flex-col gap-2">
							<Label>Price</Label>
							<Input
								type="number"
								placeholder="e.g. 300"
								disabled
								value={formData.price}
								onChange={(e) =>
									setFormData((prev: any) => ({
										...prev,
										baseUnit: { ...prev.baseUnit, price: e.target.value },
									}))
								}
							/>
						</div>
					</div>
				</div>

				{/* Additional Units */}
				<div className="space-y-4">
					{units.map((unit: any, index: number) => (
						<div
							key={index}
							className="border p-4 rounded-md space-y-2 relative"
						>
							<div className="absolute top-2 right-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleRemoveUnit(index)}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
							<h4 className="font-semibold text-sm text-muted-foreground">
								Additional Unit #{index + 1}
							</h4>
							<div className="flex flex-row gap-4">
								<div className="flex w-full flex-col gap-2">
									<Label>Name</Label>
									<Input
										placeholder="e.g. Sachet"
										value={unit.name}
										onChange={(e) =>
											handleChangeUnit(index, "name", e.target.value)
										}
									/>
								</div>
								<div className="flex w-full flex-col gap-2">
									<Label>Price</Label>
									<Input
										type="number"
										placeholder="e.g. 25"
										value={unit.price}
										onChange={(e) =>
											handleChangeUnit(index, "price", e.target.value)
										}
									/>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<Label>
									Conversion (How many of <strong>{unit.name || "..."}</strong>{" "}
									in 1 {baseUnit.name || "base unit"})
								</Label>
								<div className="flex flex-row gap-2">
									<Input type="text" value={`1 ${baseUnit.name}`} disabled />
									<Input
										type="number"
										placeholder="e.g. 10"
										value={unit.conversion}
										onChange={(e) =>
											handleChangeUnit(index, "conversion", e.target.value)
										}
									/>
								</div>
							</div>
						</div>
					))}
				</div>

				<Button variant="outline" onClick={(e) => handleAddUnit(e)}>
					<CirclePlus className="mr-2 h-4 w-4" />
					Add Additional Unit
				</Button>
			</CardContent>
		</Card>
	);
}
