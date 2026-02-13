import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function RootLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, padding: 16, maxWidth: "1280px", width: "100%", margin: "auto" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
