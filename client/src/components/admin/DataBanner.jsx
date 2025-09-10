"use client"

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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  readAllBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} from "@/api/banner"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const availableCovers = [
  "/images/cover1.jpg",
  "/images/cover2.jpg",
  "/images/cover3.jpg",
]

const DataBanner = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  // --- Create State ---
  const [newTitle, setNewTitle] = useState("")
  const [newPosition, setNewPosition] = useState(1)
  const [newStatus, setNewStatus] = useState(1)
  const [newImage, setNewImage] = useState(null)
  const [newPreview, setNewPreview] = useState(null)
  const [creating, setCreating] = useState(false)

  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // --- Edit State ---
  const [editingBanner, setEditingBanner] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editPosition, setEditPosition] = useState(1)
  const [editStatus, setEditStatus] = useState(1)
  const [editImage, setEditImage] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  // --- Delete State ---
  const [deleteBannerId, setDeleteBannerId] = useState(null)
  const [alertOpen, setAlertOpen] = useState(false)

  // --- Fetch ---
  const fetchBanners = async (pageNumber = 1) => {
    try {
      setLoading(true)
      const res = await readAllBanner(pageNumber, pageSize)
      setData(res.data.records || [])
      setTotalRecords(res.data.totalRecords || 0)
      setTotalPages(Math.ceil((res.data.totalRecords || 0) / pageSize))
      setPage(pageNumber)
    } catch (err) {
      console.error("API ERROR:", err)
      setError(`ไม่สามารถโหลดแบนเนอร์ได้: ${err.message}`)
      toast.error("ไม่สามารถโหลดแบนเนอร์ได้")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  // --- CREATE ---
  const handleCreateBanner = async () => {
    if (!newTitle.trim()) return toast.error("กรุณากรอกชื่อ Banner")
    if (!newImage) return toast.error("กรุณาอัปโหลดรูปภาพ")

    try {
      setCreating(true)
      const uploadRes = await uploadBannerImage(newImage)
      const imageUrl = uploadRes.data.url

      await createBanner({
        title: newTitle,
        image_url: imageUrl,
        position: newPosition,
        status: newStatus,
      })

      toast.success("สร้างแบนเนอร์เรียบร้อยแล้ว")
      fetchBanners(page)

      setNewTitle("")
      setNewPosition(1)
      setNewStatus(1)
      setNewImage(null)
      setNewPreview(null)
    } catch (err) {
      console.error("Create ERROR:", err)
      toast.error("ไม่สามารถสร้างแบนเนอร์ได้")
    } finally {
      setCreating(false)
    }
  }

  // --- EDIT ---
  const openEditDialog = (banner) => {
    setEditingBanner(banner)
    setEditTitle(banner.title)
    setEditPosition(banner.position)
    setEditStatus(banner.status)
    setEditImage(null)
    setEditPreview(banner.image_url)
    setEditOpen(true)
  }

  const handleUpdateBanner = async (e) => {
    e.preventDefault()
    try {
      let imageUrl = editingBanner.image_url
      if (editImage) {
        const uploadRes = await uploadBannerImage(editImage, editingBanner.image_url)
        imageUrl = uploadRes.data.url
      }

      await updateBanner({
        banner_id: editingBanner.banner_id,
        title: editTitle,
        image_url: imageUrl,
        position: editPosition,
        status: editStatus,
      })

      toast.success("แก้ไขแบนเนอร์เรียบร้อย")
      setEditOpen(false)
      fetchBanners(page)
    } catch (err) {
      console.error("Update ERROR:", err)
      toast.error("ไม่สามารถแก้ไขแบนเนอร์ได้")
    }
  }

  // --- DELETE ---
  const handleConfirmDelete = async () => {
    try {
      await deleteBanner(deleteBannerId)
      toast.success("ลบแบนเนอร์เรียบร้อย")
      fetchBanners(page)
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || "ไม่สามารถลบแบนเนอร์ได้"
      toast.error(msg)
    } finally {
      setAlertOpen(false)
      setDeleteBannerId(null)
    }
  }

  // --- COLUMNS ---
  const columns = [
    { id: "index", header: "#", cell: ({ row }) => (page - 1) * pageSize + row.index + 1 },
    {
      accessorKey: "image_url",
      header: "รูปภาพ",
      cell: ({ row }) => {
        const url = row.getValue("image_url");
        const fullUrl = url.startsWith("http") ? url : `${import.meta.env.VITE_UPLOAD_BASE}/${url}`;
        return <div className="relative w-38 h-26">
          <img src={fullUrl} alt="Banner" className="w-full h-full object-cover rounded-md" />
        </div>
      },
    },
    {
      accessorKey: "title",
      header: "ชื่อ Banner",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    { accessorKey: "position", header: "ลำดับ" },
    { accessorKey: "status", header: "สถานะ", cell: ({ row }) => row.getValue("status") === 1 ? "ใช้งาน" : "ไม่ใช้งาน" },
    { accessorKey: "created_at", header: "วันที่สร้าง" },
    { accessorKey: "updated_at", header: "วันที่แก้ไข" },
    {
      id: "actions",
      cell: ({ row }) => {
        const banner = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">เมนู</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>จัดการ</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openEditDialog(banner)}>แก้ไข</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteBannerId(banner.banner_id)
                  setAlertOpen(true)
                }}>
                <div className="text-red-600 hover:text-red-700">ลบ</div>
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

  if (loading) return <div className="p-4">กำลังโหลดแบนเนอร์...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center py-4 gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" /> เพิ่มแบนเนอร์
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] w-full max-h-[90vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg animate-fade-in">
            <DialogHeader>
              <DialogTitle>เพิ่มแบนเนอร์ใหม่</DialogTitle>
              <DialogDescription>กรอกข้อมูลแบนเนอร์ของคุณที่นี่</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateBanner() }}>
              <div className="space-y-2 py-2">
                <Input
                  placeholder="ชื่อ Banner"
                  value={newTitle}
                  required
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="ลำดับ"
                  value={newPosition}
                  onChange={(e) => setNewPosition(parseInt(e.target.value))}
                />
                <Select
                  value={newStatus.toString()}
                  onValueChange={(value) => setNewStatus(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">ใช้งาน</SelectItem>
                    <SelectItem value="0">ไม่ใช้งาน</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    setNewImage(file)
                    setNewPreview(URL.createObjectURL(file))
                  }}
                />

                {newPreview && (
                  <div className="transition cursor-pointer h-[300px]">
                    <img
                      src={newPreview}
                      alt="Preview"
                      className="mt-2 w-full h-full object-cover rounded-md shadow-md"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">ยกเลิก</Button>
                </DialogClose>
                <Button type="submit" disabled={creating}>
                  {creating ? "กำลังเพิ่ม..." : "เพิ่ม"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px] w-full max-h-[90vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg animate-fade-in">
          <DialogHeader>
            <DialogTitle>แก้ไขแบนเนอร์</DialogTitle>
            <DialogDescription>แก้ไขข้อมูลแบนเนอร์ของคุณที่นี่</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateBanner}>
            <div className="space-y-2 py-2">
              <Input
                placeholder="ชื่อ Banner"
                value={editTitle}
                required
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <Input
                type="number"
                placeholder="ลำดับ"
                value={editPosition}
                onChange={(e) => setEditPosition(parseInt(e.target.value))}
              />
              <Select
                value={editStatus.toString()}
                onValueChange={(value) => setEditStatus(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ใช้งาน</SelectItem>
                  <SelectItem value="0">ไม่ใช้งาน</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setEditImage(file)
                    setEditPreview(file)
                  }
                }}
              />

              {editPreview && (
                <img
                  src={
                    typeof editPreview === "string"
                      ? editPreview.startsWith("http")
                        ? editPreview
                        : `${import.meta.env.VITE_UPLOAD_BASE}/${editPreview}`
                      : URL.createObjectURL(editPreview)
                  }
                  alt="Preview"
                  className="mt-2 w-full h-60 object-cover rounded-md shadow-md"
                />
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DialogClose>
              <Button type="submit">บันทึก</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-md p-4 animate-fade-in">
          <DialogHeader>
            <DialogTitle>คุณแน่ใจหรือไม่?</DialogTitle>
            <DialogDescription>การดำเนินการนี้ไม่สามารถกู้คืนได้</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">ยกเลิก</Button>
            </DialogClose>
            <Button className="bg-red-600 text-white" onClick={handleConfirmDelete}>
              ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="overflow-hidden rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-muted/40">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="px-4 py-2">
                    {header.isPlaceholder ? null :
                      flexRender(header.column.columnDef.header, header.getContext())
                    }
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500 py-4">
        <div>หน้า {page} จาก {totalPages}</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => fetchBanners(page - 1)} disabled={page <= 1}>
            ก่อนหน้า
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchBanners(page + 1)} disabled={page >= totalPages}>
            ถัดไป
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataBanner
