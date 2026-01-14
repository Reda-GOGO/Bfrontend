import { LoginForm } from "@/components/login-form";
import { useEffect, useState } from "react";

export default function Login() {
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  //
  // useEffect(() => {
  //   // This function will run after the component first mounts.
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3000/api/data");
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const res = await response.json();
  //       setData(res);
  //     } catch (e) {
  //       setError(e.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchData();
  // }, []); // The empty array [] ensures this effect runs only once
  //
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  //
  // if (error) {
  //   return <div>Error: {error}</div>;
  // }
  //
  // console.log("data from api : ", data);
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
