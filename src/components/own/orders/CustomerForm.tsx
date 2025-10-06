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
  CircleX,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  User,
  UserPlus2,
  Users,
} from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useOrderContext } from "@/contexts/orderContext";
import { toast } from "sonner";

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  ice?: string;
}

const fetchCustomersFromAPI = async (): Promise<Customer[]> => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/customers`);
    if (!resp.ok) {
      throw new Error(`HTTP error: ${resp.status}`);
    }
    const body = await resp.json();
    // adjust depending on API return shape
    // e.g. { customers: [...] } or just [...]
    if (Array.isArray(body)) {
      return body;
    }
    if (body.customers && Array.isArray(body.customers)) {
      return body.customers;
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch customers:", err);
    return [];
  }
};

export default function CustomerForm() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { setCustomer } = useOrderContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  useEffect(() => {
    const load = async () => {
      const list = await fetchCustomersFromAPI();
      setCustomers(list);
      setFiltered(list);
    };
    load();
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setFiltered(customers);
    } else {
      const lower = searchValue.toLowerCase();
      setFiltered(
        customers.filter(
          (c) =>
            c.name.toLowerCase().includes(lower) ||
            (c.email && c.email.toLowerCase().includes(lower)) ||
            (c.phone && c.phone.toLowerCase().includes(lower)),
        ),
      );
    }
  }, [searchValue, customers]);

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

      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));

      // Clear error as user types
      if (errors[id as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [id]: "",
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors = {
        name: formData.name.trim() === "" ? "Name is required" : "",
        ice: formData.ice.trim() === "" ? "ICE number is required" : "",
      };

      setErrors(newErrors);

      const hasErrors = Object.values(newErrors).some((err) => err !== "");
      if (hasErrors) return;

      // Submit logic here
      console.log("Submitted:", formData);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/customers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        toast.message("failed creating order", {
          description: "missing order items ...",
          icon: <CircleX className="text-red-500" />,
        });
        console.log("Saved customer:", data);
      } catch (error) {
        console.error("Failed creating customer ...", error);
      }
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Name
          </Label>
          <Input
            id="name"
            placeholder="Customer name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone
          </Label>
          <Input
            id="phone"
            placeholder="+212..."
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ice" className="flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            ICE
          </Label>
          <Input
            id="ice"
            placeholder="ICE number"
            value={formData.ice}
            onChange={handleChange}
            aria-invalid={!!errors.ice}
          />
          {errors.ice && <p className="text-sm text-red-600">{errors.ice}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Address
          </Label>
          <Input
            id="address"
            placeholder="Customer address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gap-2">
            <UserPlus2 className="w-4 h-4" />
            Create
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          Customer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="cust-search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search or Select Customer
          </Label>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Input
                id="cust-search"
                placeholder="Type to search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClick={() => setPopoverOpen(true)}
                className="cursor-text"
              />
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 max-h-60 overflow-auto">
              <Command>
                <CommandInput placeholder="Search customers..." />
                <CommandList>
                  <CommandEmpty>No customers found.</CommandEmpty>
                  <CommandGroup heading="Customers">
                    {filtered.map((c) => (
                      <CommandItem
                        key={c.id}
                        onSelect={() => {
                          setCustomer(c.id);
                          setSelectedCustomerId(c.id);
                          setPopoverOpen(false);
                        }}
                        className="flex flex-col px-1 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <span className="font-medium">{c.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="border-t px-2 py-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setCreateOpen(true);
                    setPopoverOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create New Customer
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {selectedCustomer && (
          <div className="rounded-md border p-4 bg-muted/40 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4 text-muted-foreground" />
              {selectedCustomer.name}
            </div>
            {selectedCustomer.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {selectedCustomer.email}
              </div>
            )}
            {selectedCustomer.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {selectedCustomer.phone}
              </div>
            )}
            {selectedCustomer.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {selectedCustomer.address}
              </div>
            )}
            {selectedCustomer.ice && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Landmark className="w-4 h-4" />
                ICE: {selectedCustomer.ice}
              </div>
            )}
          </div>
        )}

        {isDesktop ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Customer</DialogTitle>
              </DialogHeader>
              <CustomerCreateForm />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer
            open={createOpen}
            repositionInputs={false}
            onOpenChange={setCreateOpen}
          >
            <DrawerContent className="p-4">
              <DrawerHeader className="px-1">
                <DrawerTitle>Create Customer</DrawerTitle>
              </DrawerHeader>
              <CustomerCreateForm />
            </DrawerContent>
          </Drawer>
        )}
      </CardContent>
    </Card>
  );
}
