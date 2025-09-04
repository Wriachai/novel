import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar"

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="px-4 mt-5 mx-auto container">
                <Outlet />
            </main>
        </>
    );
};

export default Layout;