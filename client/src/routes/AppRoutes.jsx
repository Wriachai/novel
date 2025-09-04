import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Home from '../pages/Home'
import Category from '../pages/Category'
import Profile from '../pages/Profile'
import Follow from '../pages/Follow'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import LayoutWriter from '../layouts/LayoutWriter'
import DashboardWriter from '../pages/writer/Dashboard'
import MyNovel from '../pages/writer/MyNovel'
import LayoutAdmin from '../layouts/LayoutAdmin'
import Dashboard from '../pages/admin/Dashboard'
import ManageUser from '../pages/admin/ManageUser'
import ManageCategory from '../pages/admin/ManageCategory'
import ManageNovel from '../pages/admin/ManageNovel'
import ManageMyNovel from '../pages/admin/ManageMyNovel'
import ManageMyNovelDetail from '../pages/admin/ManageMyNovelDetail'
import NotFound from '../pages/NotFound'
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "category", element: <Category /> },
      { path: "profile", element: <Profile /> },
      { path: "follow", element: <Follow /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/writer",
    element: <ProtectedRoute allowedRoles={["writer"]} />,
    children: [
      {
        element: <LayoutWriter />,
        children: [
          { index: true, element: <DashboardWriter /> },
          { path: "mynovel", element: <MyNovel /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <LayoutAdmin />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "novel", element: <ManageNovel /> },
          { path: "category", element: <ManageCategory /> },
          { path: "user", element: <ManageUser /> },
          { path: "mynovel", element: <ManageMyNovel /> },
          { path: "mynovel/:id", element: <ManageMyNovelDetail /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const AppRoutes = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRoutes