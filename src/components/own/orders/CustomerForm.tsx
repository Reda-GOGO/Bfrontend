import React, { useState } from "react";
import { Search, UserPlus, Check, ChevronsUpDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Mock data for the search functionality
const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Alex Rivera",
    email: "alex@example.com",
    company: "TechFlow",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.c@design.io",
    company: "Studio 24",
  },
  {
    id: "3",
    name: "Jordan Smith",
    email: "jsmith@logistics.com",
    company: "Global Move",
  },
];

export default function CustomerForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Customer</CardTitle>
            <CardDescription>
              Select an existing client or add a new one.
            </CardDescription>
          </div>
          {selectedId && (
            <Badge
              variant="outline"
              className="text-green-600 border-green-200 bg-green-50"
            >
              Selected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" /> Search
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> New
            </TabsTrigger>
          </TabsList>

          {/* Search Content */}
          <TabsContent value="search" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[200px] border rounded-md p-2">
              {filteredCustomers.length > 0 ? (
                <div className="space-y-1">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => setSelectedId(customer.id)}
                      className={`w-full flex items-center justify-between p-3 text-sm rounded-md transition-colors ${selectedId === customer.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                        }`}
                    >
                      <div className="text-left">
                        <p className="font-medium">{customer.name}</p>
                        <p
                          className={`text-xs ${selectedId === customer.id
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                            }`}
                        >
                          {customer.email} • {customer.company}
                        </p>
                      </div>
                      {selectedId === customer.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No customers found.
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Create Content */}
          <TabsContent value="create" className="space-y-4 pt-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" placeholder="Acme Inc." />
              </div>
              <Button className="w-full mt-2">Create & Select Customer</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
