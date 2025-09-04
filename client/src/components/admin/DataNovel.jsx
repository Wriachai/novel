import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { readAllNovel, updateNovelStatus } from "@/api/admin";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { Eye, List } from "lucide-react";

const DataNovel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNovels = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await readAllNovel(pageNumber, pageSize);
      setData(res.data.records || []);
      console.log(res.data.records)
      setTotalRecords(res.data.totalRecords || 0);
      setTotalPages(Math.ceil((res.data.totalRecords || 0) / pageSize));
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load novels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNovels();
  }, []);

  const handleStatusChange = async (novel_id, newStatus) => {
    try {
      await updateNovelStatus(novel_id, newStatus); // API ต้องรับ string
      toast.success("Novel status updated");
      setData(prev => prev.map(n => n.novel_id === novel_id ? { ...n, status: newStatus } : n));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const columns = [
    { id: "index", header: "#", cell: ({ row }) => (page - 1) * pageSize + row.index + 1 },
    {
      accessorKey: "cover_image_url",
      header: "Cover",
      cell: ({ row }) => (
        <img
          src={row.original.cover_image_url.startsWith("http")
            ? row.original.cover_image_url
            : `${import.meta.env.VITE_UPLOAD_BASE}/${row.original.cover_image_url}`}
          alt={row.original.title}
          className="w-16 h-20 object-cover rounded-md"
        />
      )
    },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "display_name", header: "Author" },

    // Chapters with icon
    {
      accessorKey: "chapter_count",
      header: () => "Chapter",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <List className="w-4 h-4" />
          <span>{row.original.chapter_count || 0}</span>
        </div>
      )
    },

    // Views with icon
    {
      accessorKey: "view_count",
      header: () => "View",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4" />
          <span>{row.original.view_count?.toLocaleString() || 0}</span>
        </div>
      )
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const novel = row.original;
        return (
          <Select
            value={novel.status} // <-- ต้องตรงกับ value ของ SelectItem
            onValueChange={(value) =>
              handleStatusChange(novel.novel_id, value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">แบบร่าง</SelectItem>
              <SelectItem value="ongoing">กำลังดำเนินการ</SelectItem>
              <SelectItem value="completed">จบแล้ว</SelectItem>
              <SelectItem value="paused">หยุดชั่วคราว</SelectItem>
            </SelectContent>
          </Select>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <div className="p-4">Loading novels...</div>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by title..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
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
            onClick={() => fetchNovels(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNovels(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataNovel;
