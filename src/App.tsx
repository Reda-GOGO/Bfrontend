import { Route, Routes } from "react-router";
import { Layout } from "./components/app-sidebar";
import Login from "./pages/Login";
import Inventory from "./pages/inventory/Inventory.tsx";
import Products from "./pages/products/Products";
import Product from "./pages/products/[handle]";
import Invoice from "./pages/Invoice";
import { PrivateRoute } from "./components/PrivateRoute";
import CreateProduct from "./pages/products/Create.tsx";
import CreateOrder from "./pages/orders/Create.tsx";
import Orders from "./pages/orders/Orders.tsx";
import Order from "./pages/orders/Order.tsx";
import Setting from "./pages/Setting.tsx";
import Dashboard from "./pages/home/Dashboard.tsx";
import PrintProductHero from "./pages/pdf/PrintTest.tsx";
import Analytics from "./pages/analytics/Analytics.tsx";
import Teams from "./pages/teams/Teams.tsx";
import Member from "./pages/teams/Member.tsx";
import Update from "./pages/products/Update.tsx";

function App() {
  return (
    <Routes>
      <Route path="/pdf/:id" element={<PrintProductHero />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          {/* All nested routes here are now protected */}
          <Route index element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:title" element={<Product />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/products/update/:handle" element={<Update />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Order />} />
          <Route path="/orders/create" element={<CreateOrder />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/member" element={<Member />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
