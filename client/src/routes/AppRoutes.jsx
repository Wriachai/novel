import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../layouts/Layout'
// import Dashboard from '../pages/admin/Dashboard'
// import ManageUser from '../pages/admin/ManageUser'
// import ManageCategory from '../pages/admin/ManageCategory'
// import LayoutAdmin from '../layouts/LayoutAdmin'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: '*', element: <NotFound /> }
        ]
    // },
    // {
    //     path: '/admin',
    //     element: <LayoutAdmin />,
    //     children: [
    //         { index: true, element: <Dashboard /> },
    //         { path: 'category', element: <ManageCategory /> },
    //         { path: 'user', element: <ManageUser /> }
    //     ]
    }
])

const AppRoutes = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRoutes