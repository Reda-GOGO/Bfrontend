import { TitleLayout } from "@/components/shared/title-layout";
import { KeyRound } from "lucide-react";

const TEAM_MEMBERS = [
  {
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
  },
  {
    id: 2,
    name: "Sara El Amrani",
    email: "sara@agab13.ma",
    role: "Staff",
    description: "Sales manager",
    joinedAt: "2024-01-03",
    lastActiveAt: "2025-09-27T18:10:00Z",
    avatar: "/avatars/sara.png",
    permissions: ["read_orders", "read_sale_info", "read_products"],
  },
];

const PERMISSIONS = [
  { key: "read_orders", label: "Read orders" },
  { key: "write_orders", label: "Manage orders" },
  { key: "read_sale_info", label: "View sales analytics" },
  { key: "read_products", label: "View products" },
  { key: "write_products", label: "Manage products" },
  { key: "read_customers", label: "View customers" },
  { key: "write_customers", label: "Manage customers" },
];

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar } from "lucide-react";

export default function Teams() {
  return (
    <div className="w-full flex flex-col gap-8">
      <TeamsHeader />

      <TeamsStats members={TEAM_MEMBERS} />

      <TeamsToolbar />

      <TeamsGrid />
    </div>
  );
}

function TeamsHeader() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full justify-between ">
        <TitleLayout title="Teams & Permissions" icon={<KeyRound />} />
        <Button>Add Member</Button>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Team members &amp; Permissions
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage who has access to your workspace and what they can do.
        </p>
      </div>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";

function TeamsStats({ members }: { members: typeof TEAM_MEMBERS }) {
  const admins = members.filter((m) => m.role === "Admin").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          Total members
        </div>
        <div className="mt-1 text-2xl font-semibold">{members.length}</div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Admins
        </div>
        <div className="mt-1 text-2xl font-semibold">{admins}</div>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

function TeamsToolbar() {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-lg font-semibold tracking-tight">Team members</h1>
    </div>
  );
}

function TeamsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {TEAM_MEMBERS.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router";

function TeamMemberCard({ member }) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate("/teams/member")}
      className="group transition-all hover:shadow-md"
    >
      <CardHeader className="pb-4">
        {/* Identity */}
        <div className="flex items-start gap-4">
          <Avatar className="h-11 w-11">
            <AvatarImage src={"/avatar.jpeg"} />
            <AvatarFallback>
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium leading-none">{member.name}</h3>

              <Badge
                variant={member.role === "Admin" ? "default" : "secondary"}
              >
                {member.role}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {member.email}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {member.description}
        </p>

        {/* Permissions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4 text-muted-foreground" />
            Permissions
          </div>

          <div className="flex flex-wrap gap-1.5">
            {member.permissions.slice(0, 4).map((permission) => (
              <Badge key={permission} variant="outline" className="text-xs">
                {permission}
              </Badge>
            ))}

            {member.permissions.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{member.permissions.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Last active {new Date(member.lastActiveAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
