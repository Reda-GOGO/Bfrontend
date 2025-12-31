const MEMBER = {
  id: 1,
  name: "Ahmed Bensaid",
  email: "ahmed@agab13.ma",
  role: "Admin",
  description: "System administrator",
  joinedAt: "2023-06-12",
  lastActiveAt: "2025-09-28T10:42:00Z",
  avatar: "/avatars/ahmed.png",
  permissions: [
    "read_orders",
    "write_orders",
    "read_products",
    "write_products",
    "read_customers",
    "write_customers",
  ],
};

const PERMISSION_GROUPS = [
  {
    title: "Orders",
    description: "Access and manage customer orders",
    permissions: [
      {
        key: "read_orders",
        label: "View orders",
        description: "See orders and order details",
      },
      {
        key: "write_orders",
        label: "Manage orders",
        description: "Create, update, and cancel orders",
      },
    ],
  },
  {
    title: "Products",
    description: "Manage products and inventory",
    permissions: [
      {
        key: "read_products",
        label: "View products",
        description: "See product catalog and stock levels",
      },
      {
        key: "write_products",
        label: "Manage products",
        description: "Create and update products",
      },
    ],
  },
  {
    title: "Customers",
    description: "Access customer information",
    permissions: [
      {
        key: "read_customers",
        label: "View customers",
        description: "See customer profiles",
      },
      {
        key: "write_customers",
        label: "Manage customers",
        description: "Edit customer information",
      },
    ],
  },
];

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Calendar, Clock, ShieldCheck } from "lucide-react";
import Back from "@/components/own/Back";

export default function Member() {
  return (
    <Back>
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        {/* Back */}
        <MemberContent />
        {/* Sticky actions */}
        <MemberActions />
      </div>
    </Back>
  );
}

function MemberContent() {
  return (
    <>
      {/* Identity header */}
      <div className="flex items-start gap-5">
        <Avatar className="h-14 w-14">
          <AvatarImage src={MEMBER.avatar} />
          <AvatarFallback>
            {MEMBER.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {MEMBER.name}
            </h1>
            <Badge>{MEMBER.role}</Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {MEMBER.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {new Date(MEMBER.joinedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last active {new Date(MEMBER.lastActiveAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input defaultValue={MEMBER.name} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input disabled defaultValue={MEMBER.email} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <Textarea defaultValue={MEMBER.description} />
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Permissions</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <div>
                <h3 className="font-medium">{group.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              </div>

              <div className="space-y-2">
                {group.permissions.map((permission) => (
                  <label
                    key={permission.key}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/40 cursor-pointer"
                  >
                    <Checkbox
                      defaultChecked={MEMBER.permissions.includes(
                        permission.key,
                      )}
                    />
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">
                        {permission.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {permission.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

function MemberActions() {
  return (
    <div className="sticky bottom-0 bg-background border-t py-4 flex justify-end gap-2">
      <Button variant="ghost">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  );
}
