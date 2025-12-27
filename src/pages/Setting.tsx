import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Camera, Lock, Mail, Globe, Sparkles } from "lucide-react";
import avatar from "../../public/avatar.jpeg";
/* Mock user */
const user = {
  name: "Elena Rodriguez",
  role: "Head of Engineering",
  email: "elena@nova.io",
  avatar: "https://github.com/shadcn.png",
  language: "en",
};

/* Motion */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

import { useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

function TableWithPDF() {
  const tableRef = useRef<HTMLDivElement | null>(null);

  const downloadPDF = async () => {
    const element = tableRef.current;
    if (!element) return;

    // 1️⃣ Wait for all fonts to load (VERY important)
    await document.fonts.ready;

    // 2️⃣ Freeze layout to A4 width (96 DPI)
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;

    element.style.width = "794px"; // A4 width @ 96 DPI
    element.style.maxWidth = "794px";

    // 3️⃣ Generate image with high fidelity
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 3,
      style: {
        transform: "none",
        animation: "none",
        transition: "none",
      },
    });

    // 4️⃣ Restore original layout
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;

    // 5️⃣ Create PDF using pixel-friendly units
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;

      pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("table.pdf");
    };
  };

  return (
    <>
      <div ref={tableRef} className="p-4">
        <ChartBarDefault />
        <table style={{ width: "100%", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>95</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button onClick={downloadPDF}>Download PDF</button>
    </>
  );
}

export function DownloadPDFButton({ productId }: { productId: number }) {
  const downloadPDF = async () => {
    try {
      const theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";

      const response = await fetch("http://localhost:3000/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId, theme }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `product-${productId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF");
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download PDF
    </button>
  );
}
// export default function Setting() {
//   return <DownloadPDFButton productId={1} />;
// }

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-blue-500)",
  },
} satisfies ChartConfig;

export function ChartBarDefault() {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-[250px]" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
export default function Setting() {
  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="relative min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-background px-6 py-16"
    >
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Identity Hero */}
        <motion.section
          variants={item}
          className="relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />

          <div className="relative flex flex-col md:flex-row items-center gap-10 p-10">
            <div className="relative group">
              <Avatar className="h-32 w-32 ring-4 ring-background">
                <AvatarImage src={avatar} />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {user.name}
                </h1>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <p className="text-lg text-muted-foreground">{user.role}</p>

              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </motion.section>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Account */}
          <motion.section variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Your public identity and contact details
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={user.name} />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input defaultValue={user.role} />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      disabled
                      defaultValue={user.email}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Preferences */}
          <motion.section variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Personalize how the product feels
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue={user.language}>
                    <SelectTrigger>
                      <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Label>Change password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" className="pl-9" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Save */}
        <motion.div variants={item} className="flex justify-end">
          <Button size="lg" className="px-10">
            Save changes
          </Button>
        </motion.div>
      </div>
    </motion.main>
  );
}
