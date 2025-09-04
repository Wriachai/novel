import React, { useEffect, useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import { readAllCategory, createCategory, updateCategory, deleteCategory } from "@/api/category";
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const DataCategory = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [page, setPage] = useState(1)
    const [pageSize] = useState(10)

    // State ฟอร์มใหม่
    const [newName, setNewName] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [creating, setCreating] = useState(false)

    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const [editingCategory, setEditingCategory] = useState(null)
    const [editName, setEditName] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editOpen, setEditOpen] = useState(false)

    const fetchCategories = async (pageNumber = 1) => {
        try {
            setLoading(true)
            const res = await readAllCategory(pageNumber, pageSize)
            setData(res.data.records || [])
            setTotalRecords(res.data.totalRecords || 0)   // API ต้องส่ง totalRecords มาด้วย
            setTotalPages(Math.ceil((res.data.totalRecords || 0) / pageSize))  // คำนวณ totalPages
            setPage(pageNumber)
        } catch (err) {
            console.error("API ERROR:", err)
            setError(`Failed to load categories: ${err.message}`)
            toast.error("Failed to load categories")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleCreateCategory = async () => {
        if (!newName.trim()) return toast.error("Name is required");
        try {
            setCreating(true);
            await createCategory({ name: newName, description: newDescription });

            toast.success("Category created successfully");

            fetchCategories(page);

            setNewName("");
            setNewDescription("");
        } catch (err) {
            console.error("Create ERROR:", err);
            toast.error("Failed to create category");
        } finally {
            setCreating(false);
        }
    }

    const openEditDialog = (category) => {
        setEditingCategory(category)
        setEditName(category.name)
        setEditDescription(category.description)
        setEditOpen(true)
    }

    const handleUpdateCategory = async (e) => {
        e.preventDefault()
        try {
            await updateCategory({
                category_id: editingCategory.category_id,
                name: editName,
                description: editDescription,
            })
            setEditOpen(false)

            toast.success("Category updated successfully")

            fetchCategories(page);
        } catch (err) {
            console.error("Update ERROR:", err)
            toast.error("Failed to update category")
        }
    }

    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);

    const handleConfirmDelete = async () => {
        try {
            await deleteCategory(deleteCategoryId);
            toast.success("Category deleted successfully");
            fetchCategories(page);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to delete category";
            toast.error(msg);
        } finally {
            setAlertOpen(false);
            setDeleteCategoryId(null);
        }
    };

    const columns = [
        {
            id: "index",
            header: "#",
            cell: ({ row, table }) => {
                // ID ใหม่ นับจากหน้า
                return (page - 1) * pageSize + row.index + 1
            },
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="text-muted-foreground">{row.getValue("description")}</div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Created At",
        },
        {
            accessorKey: "updated_at",
            header: "Updated At",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const category = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {/* <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        category.category_id.toString()
                                    )
                                }
                            >
                                Copy category ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem> */}
                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setDeleteCategoryId(category.category_id);
                                    setAlertOpen(true);
                                }}>
                                <div className={"text-red-600 hover:text-red-700"}>Delete</div>

                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    if (loading) return <div className="p-4">Loading categories...</div>
    if (error) return <div className="p-4 text-red-500">{error}</div>

    return (
        <div className="w-full">
            {/* Toolbar */}
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Filter by name..."
                    value={table.getColumn("name")?.getFilterValue() ?? ""}
                    onChange={(e) =>
                        table.getColumn("name")?.setFilterValue(e.target.value)
                    }
                    className="max-w-sm"
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" className="ml-2">
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white rounded-md p-4 opacity-0 animate-fade-in"
                        style={{
                            animationDuration: "0.2s",
                            animationFillMode: "forwards",
                        }}>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>
                                ใส่ข้อมูลหมวดหมู่ใหม่ของคุณที่นี่
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            handleCreateCategory()
                        }}>
                            <div className="space-y-2 py-2">
                                <Input
                                    placeholder="Name"
                                    value={newName}
                                    required
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <Input
                                    placeholder="Description"
                                    value={newDescription}
                                    required
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={creating}>
                                    {creating ? "Adding..." : "Add"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-md p-4 opacity-0 animate-fade-in"
                    style={{ animationDuration: "0.2s", animationFillMode: "forwards" }}
                >
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            แก้ไขข้อมูลหมวดหมู่ของคุณที่นี่
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCategory}>
                        <div className="space-y-2 py-2">
                            <Input
                                placeholder="Name"
                                value={editName}
                                required
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <Input
                                placeholder="Description"
                                value={editDescription}
                                required
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-md p-4 opacity-0 animate-fade-in"
                    style={{ animationDuration: "0.2s", animationFillMode: "forwards" }}>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete this category.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            className=" bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Table */}
            <div className="overflow-hidden rounded-md border shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/40">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-4 py-2">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/20"
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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
                    {/* : Showing {data.length} records */}
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchCategories(page - 1)}
                        disabled={page <= 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchCategories(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DataCategory
