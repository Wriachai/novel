import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { readAllUser, updateUserStatus, updateUserRole } from "@/api/admin";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import useAuthStore from "@/store/novel-store";

const DataUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { user: currentUser } = useAuthStore();

  const fetchUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await readAllUser(pageNumber, pageSize);
      console.log("API Response:", res.data); // ตรวจสอบ response

      setData(res.data.records || []);
      setTotalRecords(res.data.totalRecords || 0);
      setTotalPages(res.data.totalPages || Math.ceil((res.data.totalRecords || 0) / pageSize));
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (user_id, newStatus) => {
    try {
      await updateUserStatus(user_id, newStatus ? 1 : 0);
      toast.success("User status updated");
      setData(prev => prev.map(u => u.user_id === user_id ? { ...u, status: newStatus ? 1 : 0 } : u));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleRoleChange = async (user_id, newRole) => {
    try {
      await updateUserRole(user_id, newRole);
      toast.success("User role updated");
      setData(prev => prev.map(u => u.user_id === user_id ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  const columns = [
    { id: "index", header: "#", cell: ({ row }) => (page - 1) * pageSize + row.index + 1 },
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "display_name", header: "Display Name" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentAdmin = currentUser?.user_id === user.user_id && user.role === "admin";

        return (
          <Select
            value={user.role}
            onValueChange={(value) => handleRoleChange(user.user_id, value)}
            disabled={isCurrentAdmin} // ปิดถ้าเป็น admin ตัวเอง
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="writer">Writer</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        const isActive = user.status === 1;
        const isCurrentAdmin = currentUser?.user_id === user.user_id && user.role === "admin";

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => handleStatusChange(user.user_id, checked)}
              disabled={isCurrentAdmin} // ปิดถ้าเป็น admin ตัวเอง
            />
            <span className={isActive ? "text-green-600" : "text-red-600"}>
              {isActive ? "กำลังใช้งาน" : "ถูกระงับ"}
            </span>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by first name..."
          value={table.getColumn("firstname")?.getFilterValue() ?? ""}
          onChange={(e) => table.getColumn("firstname")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-hidden rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-muted/40">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="px-4 py-2">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="hover:bg-muted/20">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 py-4">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUsers(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUsers(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataUser;
