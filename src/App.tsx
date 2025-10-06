import { Route, Routes } from "react-router";
import { Dashboard } from "./components/app-sidebar";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Overview from "./pages/Overview";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Invoice from "./pages/Invoice";
import { PrivateRoute } from "./components/PrivateRoute";
import CreateProduct from "./pages/CreateProduct.tsx";
import CreateOrder from "./pages/CreateOrder.tsx";
import Orders from "./pages/Orders.tsx";
import Order from "./pages/Order.tsx";
import Setting from "./pages/Setting.tsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />}>
          {/* All nested routes here are now protected */}
          <Route index element={<Overview />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:title" element={<Product />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Order />} />
          <Route path="/orders/create" element={<CreateOrder />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
