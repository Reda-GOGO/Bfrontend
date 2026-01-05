import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Landmark,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  User,
  UserPlus2,
} from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useOrderContext } from "@/contexts/orderContext";
import { toast } from "sonner";

/* --------------------------------- types --------------------------------- */

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  ice?: string;
}

/* ------------------------------ api helpers ------------------------------- */

const fetchCustomersFromAPI = async (): Promise<Customer[]> => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/customers`);
    if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);
    const body = await resp.json();
    return Array.isArray(body) ? body : body.customers || [];
  } catch (err) {
    console.error("Failed to fetch customers:", err);
    return [];
  }
};

/* ------------------------------ main component ---------------------------- */

export default function CustomerForm() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { setCustomer } = useOrderContext();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ----------------------------- initial load ----------------------------- */

  useEffect(() => {
    const load = async () => {
      const list = await fetchCustomersFromAPI();
      setCustomers(list);
      setFiltered(list);
    };
    load();
  }, []);

  /* ------------------------------ filtering ------------------------------- */

  useEffect(() => {
    const lower = searchValue.toLowerCase();

    if (!lower) {
      setFiltered(customers);
      return;
    }

    setFiltered(
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.email?.toLowerCase().includes(lower) ||
          c.phone?.toLowerCase().includes(lower),
      ),
    );
  }, [searchValue, customers]);

  /* ------------------------------ selection ------------------------------- */

  const handleSelect = (cust: Customer) => {
    setSelectedCustomer(cust);
    setCustomer(cust.id);
    setSearchValue(cust.name);
    setShowDropdown(false);
  };

  /* -------------------------- create customer form ------------------------ */

  const CustomerCreateForm = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      ice: "",
      address: "",
    });

    const [errors, setErrors] = useState({
      name: "",
      ice: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));

      if (errors[id as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [id]: "" }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors = {
        name: formData.name.trim() ? "" : "Name is required",
        ice: formData.ice.trim() ? "" : "ICE number is required",
      };

      setErrors(newErrors);
      if (Object.values(newErrors).some(Boolean)) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/customers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed");

        const body = await res.json();
        const customer: Customer = body.customer ?? body;

        setCustomers((prev) => [...prev, customer]);
        setFiltered((prev) => [...prev, customer]);
        setSelectedCustomer(customer);
        setCustomer(customer.id);
        setSearchValue(customer.name);
        setShowDropdown(false);
        setCreateOpen(false);

        toast.success("Customer created successfully");
      } catch {
        toast.error("Failed to create customer");
      }
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        {[
          {
            id: "name",
            label: "Name",
            icon: <User className="w-4 h-4" />,
            required: true,
          },
          { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
          { id: "phone", label: "Phone", icon: <Phone className="w-4 h-4" /> },
          {
            id: "ice",
            label: "ICE",
            icon: <Landmark className="w-4 h-4" />,
            required: true,
          },
          {
            id: "address",
            label: "Address",
            icon: <MapPin className="w-4 h-4" />,
          },
        ].map(({ id, label, icon, required }) => (
          <div key={id} className="grid gap-2">
            <Label htmlFor={id} className="flex items-center gap-2">
              {icon} {label}{" "}
              {required && <span className="text-red-500">*</span>}
            </Label>

            <Input
              id={id}
              value={formData[id as keyof typeof formData]}
              onChange={handleChange}
              placeholder={`Enter ${label.toLowerCase()}`}
            />

            {errors[id as keyof typeof errors] && (
              <p className="text-sm text-red-600">
                {errors[id as keyof typeof errors]}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gap-2">
            <UserPlus2 className="w-4 h-4" />
            Save & Select
          </Button>
        </div>
      </form>
    );
  };

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <Card className="w-full rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Customer Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer by name, phone, or email"
            value={searchValue}
            className="pl-9"
            onChange={(e) => {
              setSearchValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />

          {showDropdown && (
            <div className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-md border bg-background shadow-md">
              {filtered.length ? (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    className="w-full px-4 py-2 text-left hover:bg-accent"
                    onClick={() => handleSelect(c)}
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.phone || c.email}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No customers found
                </div>
              )}

              <div className="border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-4 py-2"
                  onClick={() => {
                    setCreateOpen(true);
                    setShowDropdown(false);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create New Customer
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Selected customer */}
        {selectedCustomer ? (
          <div className="relative space-y-1 rounded-md border bg-muted/50 p-4">
            <p className="text-base font-medium">{selectedCustomer.name}</p>

            {selectedCustomer.phone && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" /> {selectedCustomer.phone}
              </p>
            )}

            {selectedCustomer.email && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> {selectedCustomer.email}
              </p>
            )}

            {selectedCustomer.address && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {selectedCustomer.address}
              </p>
            )}

            {selectedCustomer.ice && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Landmark className="h-4 w-4" /> ICE: {selectedCustomer.ice}
              </p>
            )}

            <Button
              size="sm"
              variant="outline"
              className="absolute right-3 top-3"
              onClick={() => {
                setSelectedCustomer(null);
                setSearchValue("");
              }}
            >
              Change
            </Button>
          </div>
        ) : (
          <div className="rounded-md border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            No customer selected
          </div>
        )}

        {/* Create modal / drawer */}
        {isDesktop ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Customer</DialogTitle>
              </DialogHeader>
              <CustomerCreateForm />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={createOpen} onOpenChange={setCreateOpen}>
            <DrawerContent className="p-4">
              <DrawerHeader>
                <DrawerTitle>Create New Customer</DrawerTitle>
              </DrawerHeader>
              <CustomerCreateForm />
            </DrawerContent>
          </Drawer>
        )}
      </CardContent>
    </Card>
  );
}
