import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Customer = {
  id: string;
  name: string;
  email?: string;
  orders: number;
  spent: number;
  avatar?: string;
};

export function CustomersGrid({ customers }: { customers: Customer[] }) {
  return (
    <div
      className="
      w-full rounded-xl border bg-card shadow-sm
      overflow-hidden
    "
    >
      <Table>
        {/* HEADER */}
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-medium text-foreground">
              Customer
            </TableHead>
            <TableHead className="font-medium text-foreground">
              Orders
            </TableHead>
            <TableHead className="font-medium text-foreground">Spent</TableHead>
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {customers.map((c) => (
            <TableRow
              key={c.id}
              className="
                hover:bg-muted/20 transition-colors cursor-pointer
              "
            >
              {/* CUSTOMER INFO */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={c.avatar} />
                    <AvatarFallback>{c.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{c.name}</span>
                    {c.email && (
                      <span className="text-sm text-muted-foreground">
                        {c.email}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* ORDERS */}
              <TableCell className="py-4">
                <span className="font-semibold">{c.orders}</span>
              </TableCell>

              {/* SPENT */}
              <TableCell className="py-4">
                <span className="font-semibold">${c.spent.toFixed(2)}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export const customers = [
  {
    id: "c1",
    name: "John Doe",
    email: "john@example.com",
    orders: 12,
    spent: 540.23,
    avatar: "",
  },
  {
    id: "c2",
    name: "Emily Carter",
    email: "emily@example.com",
    orders: 7,
    spent: 310.5,
    avatar: "",
  },
  {
    id: "c3",
    name: "Michael Smith",
    email: "michael@example.com",
    orders: 19,
    spent: 1290.99,
    avatar: "",
  },
  {
    id: "c4",
    name: "Sara Johnson",
    email: "sara@example.com",
    orders: 4,
    spent: 89.99,
    avatar: "",
  },
];
