"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFollowedNovels } from "@/api/follow";
import useAuthStore from "@/store/novel-store";
import NovelCard from "@/components/NovelCard";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const FollowDetail = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const userId = user?.user_id;

    const [novels, setNovels] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const limit = 24;

    const fetchFollowed = async (newPage = 1) => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await getFollowedNovels(userId, newPage, limit);

            setNovels(res.data.records || []);
            setPage(newPage);
            setTotalPages(res.data.totalPages || 1);

        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดรายการติดตามได้ ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowed(1);
    }, [userId]);

    if (loading) return <div className="text-center py-6">กำลังโหลด...</div>;
    if (error) return <div className="text-center text-red-500 py-6">{error}</div>;
    if (!novels.length) return <div className="text-center py-6">คุณยังไม่ได้ติดตามนิยายเรื่องใดเลย</div>;

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <button
                                onClick={() => navigate("/")}
                                className="hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                หน้าแรก
                            </button>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <button
                                onClick={() => navigate("/follow")}
                                className="hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                นิยายที่ติดตาม
                            </button>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Page Title */}
            <h2 className="text-lg font-semibold my-4">รายการนิยายที่ติดตาม</h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:gap-x-8 mt-5">
                {novels.map((novel, index) => (
                    <NovelCard key={novel.novel_id || index} item={novel} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-gray-500 py-4">
                <div>
                    หน้า {page} จาก {totalPages}
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchFollowed(page - 1)}
                        disabled={page <= 1}
                    >
                        ก่อนหน้า
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchFollowed(page + 1)}
                        disabled={page >= totalPages}
                    >
                        ถัดไป
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FollowDetail;
