import React from "react";
import { Outlet } from "react-router-dom";

const LayoutWriter = () => {
    return (
        <>
            <main className="py-10">
                <Outlet />
            </main>
        </>
    );
};
export default LayoutWriter;