import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <main className="px-4 mt-20 mx-auto container">
                <Outlet />
            </main>
        </>
    );
};

export default Layout;