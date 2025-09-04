"use client";

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  IconBook,
  IconBooks,
  IconMenu2,
  IconUser,
  IconLogin2,
  IconLogout,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAuthStore from "@/store/novel-store";
import { toast } from "react-toastify";

const Navbar = () => {
  const menuItems = [
    { name: "Novel", path: "/" },
    { name: "Category", path: "/category" }
  ];

  const user = useAuthStore((state) => state.user);
  const actionLogout = useAuthStore((state) => state.actionLogout);
  const navigate = useNavigate();

  const handleLogout = () => {
    actionLogout();
    toast.success("Logout successful 🎉");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile Left: Menu Trigger + Logo */}
          <div className="flex items-center space-x-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <IconMenu2 />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col mt-2 space-y-2 p-2">
                  <NavLink to={"/"} end>
                    {({ isActive }) => (
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : ""
                          }`}>
                        <IconBook />
                        Novel
                      </Button>
                    )}
                  </NavLink>
                  <NavLink to={"category"}>
                    {({ isActive }) => (
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : ""
                          }`}>
                        <IconBooks />
                        Category
                      </Button>
                    )}
                  </NavLink>
                </div>
              </SheetContent>
            </Sheet>

            <div className="font-bold text-xl text-gray-800 ml-2">
              MyNovelApp
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to={"/"}>
              <div className="font-bold text-xl text-gray-800">MyNovelApp</div>
            </NavLink>

            <NavLink to={"/"} end>
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={`${isActive ? "bg-primary text-primary-foreground" : ""
                    }`}>
                  <IconBook />
                  Novel
                </Button>
              )}
            </NavLink>

            <NavLink to={"category"}>
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={`${isActive ? "bg-primary text-primary-foreground" : ""
                    }`}>
                  <IconBooks />
                  Category
                </Button>
              )}
            </NavLink>
          </div>

          {/* Right side: Search + Login */}
          <div className="flex items-center space-x-2">
            <Input placeholder="Search..." className="w-32 md:w-48" />
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar >
                  {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                  <AvatarFallback>
                    <IconUser />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-2">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      My Account
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {user.role === "admin" && (
                      <NavLink to={"/admin/"}>
                        <DropdownMenuItem className={'mb-1'}>Dashboard</DropdownMenuItem>
                      </NavLink>
                    )}

                    {user.role === "writer" && (
                      <NavLink to={"/writer/"}>
                        <DropdownMenuItem className={'mb-1'}>Dashboard</DropdownMenuItem>
                      </NavLink>
                    )}

                    <NavLink to={"profile"}>
                      {({ isActive }) => (
                        <DropdownMenuItem
                          className={`mb-1 ${isActive ? "bg-primary text-primary-foreground" : ""}`}>
                          Profile
                        </DropdownMenuItem>
                      )}
                    </NavLink>

                    {user.role === "writer" && (
                      <NavLink to={"/writer/mynovel"}>
                        <DropdownMenuItem className={"mb-1"}>MyNovel</DropdownMenuItem>
                      </NavLink>
                    )}

                    <NavLink to={"follow"}>
                      {({ isActive }) => (
                        <DropdownMenuItem
                          className={`mb-1 ${isActive ? "bg-primary text-primary-foreground" : ""}`}>
                          Follow
                        </DropdownMenuItem>
                      )}
                    </NavLink>

                    <DropdownMenuItem onClick={handleLogout} >
                      <IconLogout className="text-red-600" />
                      <div className="text-red-600 ">
                        Logout
                      </div>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <NavLink to={"login"}>
                    <DropdownMenuItem>
                      <IconLogin2 /> Login
                    </DropdownMenuItem>
                  </NavLink>
                )}

              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
