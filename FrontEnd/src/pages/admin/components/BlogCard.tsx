export interface BlogPost {
    id: string;
    title: string;
    category: string;
    status: 'published' | 'draft';
    author?: string;
    date?: string;
    createdAt: string;
    views?: number;
}

import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
    Edit,
    Trash2,
    Eye,
    Calendar,
    FileText,
    MoreVertical
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface BlogCardProps {
    post: BlogPost;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function BlogCard({ post, onEdit, onDelete }: BlogCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow group">
            <div className="p-3 sm:p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 md:gap-6">
                {/* Icon/Image Placeholder - Scale or hide on mobile */}
                <div className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 items-center justify-center flex-shrink-0 text-blue-600">
                    <FileText className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-3">
                        <h3 className="font-semibold text-slate-900 text-base md:text-lg leading-snug">
                            {post.title}
                        </h3>
                        <Badge
                            variant={post.status === 'published' ? 'default' : 'secondary'}
                            className={`w-fit text-[10px] md:text-xs px-2 py-0.5 whitespace-nowrap ${post.status === 'published'
                                ? 'bg-green-100 text-green-700 hover:bg-green-100 shadow-none border-green-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-100 shadow-none border-slate-200'
                                }`}
                        >
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-x-3 md:gap-x-4 gap-y-2 text-[11px] sm:text-xs md:text-sm text-slate-500 flex-wrap">
                        <Badge variant="outline" className="text-[10px] md:text-xs font-normal text-slate-500 bg-slate-50 px-2 py-0.5">
                            {post.category}
                        </Badge>
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="opacity-70" />
                            {post.date ? new Date(post.date).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.views !== undefined && (
                            <span className="flex items-center gap-1.5">
                                <Eye size={14} className="opacity-70" />
                                {post.views}
                            </span>
                        )}
                        <span className="hidden sm:inline-flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            by {post.author || 'Admin'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 mt-3 md:mt-0">
                    {/* Large Screens (>= 1200px) - Buttons appear on hover */}
                    <div className="hidden min-[1200px]:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(post.id)}
                            className="h-9 text-xs px-3 hover:bg-slate-100"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(post.id)}
                            title="Delete"
                            className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Small/Medium Screens (< 1200px) - Dropdown Menu */}
                    <div className="min-[1200px]:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(post.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </Card>
    );
}
