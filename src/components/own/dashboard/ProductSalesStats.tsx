import { useState } from "react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  sold: number;
};

function ProductTooltip({ active, payload, products }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const product = products.find((p) => p.id === data.id);
  if (!product) return null;
  const handleClick = () => console.log("clicked");
  return (
    <div className="rounded-lg bg-background shadow-lg p-4 border border-border w-40">
      <div className="font-medium mb-2 truncate " onClick={handleClick}>
        {product.name.length > 32
          ? product.name.slice(0, 32) + "..."
          : product.name}
      </div>

      <div className="grid grid-cols-2 text-xs sm:text-sm gap-y-1">
        <span className="text-muted-foreground">Sold:</span>
        <span className="text-right font-semibold">{product.sold}</span>

        {/* <span className="text-muted-foreground">Price:</span> */}
        {/* <span className="text-right">${product.price}</span> */}
        {/**/}
        {/* <span className="text-muted-foreground">Revenue:</span> */}
        {/* <span className="text-right font-semibold"> */}
        {/*   ${(product.price * product.sold).toFixed(2)} */}
        {/* </span> */}
      </div>
    </div>
  );
}
export default function ProductSalesChart({
  products,
  className,
}: { products: Product[]; className?: string }) {
  const [selected, setSelected] = useState<Product | null>(null);

  // transform products into chart-friendly data
  const chartData = products.map((p, index) => ({
    id: p.id,
    label: `#${index + 1}`,
    fullName: p.name,
    sold: p.sold,
    price: p.price,
  }));

  const chartConfig = {
    sold: {
      label: "Units Sold",
      color: "var(--color-blue-500)",
    },
  } satisfies ChartConfig;

  return (
    <Card className={cn("w-full flex min-w-65", className)}>
      <CardHeader>
        <CardTitle>Product Sales</CardTitle>
        <CardDescription>Total units sold across all products</CardDescription>
      </CardHeader>

      <CardContent>
        {/* horizontal scroll for 26 products */}
        <ChartContainer className=" w-full h-65" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />

            <ChartTooltip
              cursor={true}
              content={<ProductTooltip products={products} />}
            />

            <Bar
              dataKey="sold"
              fill="var(--color-sold)"
              radius={3}
              onClick={(bar) => {
                const product = products.find((p) => p.id === bar.id);
                if (product) setSelected(product);
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Click a bar to see full product details
        </div>
      </CardFooter>
    </Card>
  );
}

export const testProducts = [
  {
    id: "p1",
    name: "Wireless Bluetooth Earbuds Pro X2",
    image: "/uploads/1758498455862-81372853.webp",
    price: 59.99,
    sold: 320,
  },
  {
    id: "p2",
    name: "Smart Home LED Light Strip 5m RGB",
    image: "/uploads/1758501191940-988616717.jpg",
    price: 24.99,
    sold: 145,
  },
  {
    id: "p3",
    name: "4K Ultra HD Portable Projector MiniBeam",
    image: "/uploads/1758500902673-479147377.jpg",
    price: 199.0,
    sold: 87,
  },
  {
    id: "p4",
    name: "Ergonomic Wireless Mouse ComfortGrip",
    image: "/uploads/1758500841108-591211540.jpg",
    price: 29.99,
    sold: 510,
  },
  {
    id: "p5",
    image: "/uploads/1758500760605-421755691.jpg",
    name: "Mechanical Keyboard RGB SwitchMaster",
    price: 89.99,
    sold: 240,
  },
  {
    id: "p6",
    name: "Noise Cancelling Headphones MaxSilence",
    price: 129.99,
    sold: 160,
  },
  {
    id: "p7",
    name: "Smart Fitness Band TrackFit Pro",
    price: 49.99,
    sold: 420,
  },
  {
    id: "p8",
    name: "Portable Power Bank 20000mAh UltraCharge",
    price: 39.99,
    sold: 780,
  },
  {
    id: "p9",
    name: "USB-C Fast Charger 30W TurboCharge",
    price: 19.99,
    sold: 950,
  },
  {
    id: "p10",
    name: "Smart WiFi Security Camera 360Home",
    price: 69.99,
    sold: 185,
  },
  {
    id: "p11",
    name: "Laptop Stand Adjustable AlloyLift Pro",
    price: 34.99,
    sold: 310,
  },
  {
    id: "p12",
    name: "Portable SSD 1TB SpeedDrive",
    price: 119.99,
    sold: 132,
  },
  {
    id: "p13",
    name: "Bluetooth Speaker BassBoom Mini",
    price: 27.5,
    sold: 640,
  },
  {
    id: "p14",
    name: "Smartphone Tripod Stand FlexGrip",
    price: 14.99,
    sold: 220,
  },
  {
    id: "p15",
    name: "LED Desk Lamp SmartTouch Pro",
    price: 22.99,
    sold: 310,
  },
  {
    id: "p16",
    name: "Wireless Charger Pad 15W RapidCharge",
    price: 18.99,
    sold: 480,
  },
  {
    id: "p17",
    name: "Smart Water Bottle HydrationTrack",
    price: 29.99,
    sold: 76,
  },
  {
    id: "p18",
    name: "Gaming Headset SurroundX",
    price: 49.99,
    sold: 260,
  },
  {
    id: "p19",
    name: "Bluetooth Car Adapter DriveConnect",
    price: 16.99,
    sold: 555,
  },
  {
    id: "p20",
    name: "Home Air Purifier FreshAir Mini",
    price: 89.99,
    sold: 82,
  },
  {
    id: "p21",
    name: "Electric Toothbrush CleanWave Pro",
    price: 39.99,
    sold: 340,
  },
  {
    id: "p22",
    name: "Smart Scale BodyMetrics+",
    price: 49.99,
    sold: 120,
  },
  {
    id: "p23",
    name: "Portable Mini Fan BreezeGo",
    price: 12.99,
    sold: 510,
  },
  {
    id: "p24",
    name: "Wireless Keyboard SlimType Lite",
    price: 29.5,
    sold: 295,
  },
  {
    id: "p25",
    name: "Compact Digital Camera SnapShot Z3",
    price: 149.99,
    sold: 60,
  },
  {
    id: "p26",
    name: "Smart Door Lock SecureHome X1",
    price: 129.99,
    sold: 110,
  },
];
