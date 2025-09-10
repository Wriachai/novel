import React from 'react';
import { Link } from "react-router-dom";
import { Eye, List } from "lucide-react"; // ถ้ายังไม่ได้ import

const NovelCard = ({ item }) => {
    // console.log(item)
    return (
        <div className="group">
            <Link to={`/novel/${item.novel_id}`}>
                <div className="transition cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl flex items-center justify-center bg-gray-200 aspect-[3/4]">
                        {item.cover_image_url ? (
                            <img
                                src={
                                    item.cover_image_url.startsWith("http")
                                        ? item.cover_image_url
                                        : `${import.meta.env.VITE_UPLOAD_BASE}/${item.cover_image_url}`
                                }
                                alt={item.title || "No Title"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-500 font-semibold">No Image</span>
                        )}
                    </div>

                    <div className="p-2">
                        <h3 className="text-sm font-bold truncate">{item.title || "Untitled Novel"}</h3>
                        <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{item.view_count?.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <List className="w-3 h-3" />
                                <span>{item.chapter_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default NovelCard;
