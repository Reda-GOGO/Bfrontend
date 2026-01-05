import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Activity, User, Calendar } from "lucide-react";
import type { Order } from "@/types";

/* -------------------------------- helpers -------------------------------- */

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/* ------------------------------ subcomponents ----------------------------- */

function CommentInput({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a comment to the timeline..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-[80px]"
      />

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            if (!value.trim()) return;
            onSubmit(value);
            setValue("");
          }}
        >
          Add comment
        </Button>
      </div>
    </div>
  );
}

function TimelineItem({
  action,
  user,
  createdAt,
  description,
}: {
  action: string;
  user: string;
  createdAt: string;
  description?: string;
}) {
  return (
    <div className="relative flex gap-4 pb-6">
      {/* timeline line */}
      <div className="absolute left-5 top-10 h-full w-px bg-border" />

      {/* avatar */}
      <Avatar className="h-10 w-10">
        <AvatarFallback className="text-xs font-semibold">
          {user
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {action}
          </Badge>

          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(createdAt)}
          </span>
        </div>

        <p className="text-sm font-medium flex items-center gap-1">
          <User className="h-3 w-3 text-muted-foreground" />
          {user}
        </p>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ main component ----------------------------- */

export default function OrderTimeline({ order }: { order: Order }) {
  /**
   * TEMP data shape (replace with backend later)
   * This matches a typical audit log / activity table
   */
  const [activities, setActivities] = React.useState([
    {
      id: 1,
      action: "Order created",
      user: "Admin",
      createdAt: order.createdAt,
      description: `Order #${order.id} was created`,
    },
    {
      id: 2,
      action: "Status updated",
      user: "Admin",
      createdAt: order.createdAt,
      description: `Order marked as "${order.status}"`,
    },
  ]);

  function handleAddComment(comment: string) {
    setActivities((prev) => [
      {
        id: Date.now(),
        action: "Comment",
        user: "Admin",
        createdAt: new Date().toISOString(),
        description: comment,
      },
      ...prev,
    ]);
  }

  return (
    <div className="w-full col-span-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Timeline
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Comment input */}
          <CommentInput onSubmit={handleAddComment} />

          <Separator />

          {/* Timeline */}
          <div className="space-y-2 flex flex-col py-8">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <TimelineItem
                  key={activity.id}
                  action={activity.action}
                  user={activity.user}
                  createdAt={activity.createdAt}
                  description={activity.description}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
