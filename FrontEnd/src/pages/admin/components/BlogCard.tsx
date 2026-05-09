export interface BlogPost {
    id: string;
    slug: string;
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
    const isPublished = post.status === 'published';

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-none hover:border-millions-accent/30 transition-all duration-500 group animate-fade-in-up">
            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                {/* Visual Icon */}
                <div className="hidden sm:flex w-12 h-12 bg-white/5 border border-white/10 flex-shrink-0 items-center justify-center text-millions-accent group-hover:border-millions-accent/50 transition-colors">
                    <FileText className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <h3 className="font-cormorant text-[1.3rem] text-white font-light leading-snug truncate group-hover:text-millions-accent transition-colors italic">
                            {post.title}
                        </h3>
                        <Badge
                            className={`w-fit text-[0.6rem] px-2 py-0.5 uppercase tracking-wider rounded-none border shadow-none font-jost font-light ${isPublished
                                ? 'bg-millions-accent/10 text-millions-accent border-millions-accent/20'
                                : 'bg-white/5 text-white/30 border-white/5'
                                }`}
                        >
                            {post.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-x-4 gap-y-2 text-[0.7rem] text-white/30 font-jost uppercase tracking-[0.15em] flex-wrap font-light">
                        <span className="text-millions-accent/50 italic lowercase">#{post.category}</span>
                        <span className="flex items-center gap-2">
                            <Calendar size={12} className="text-white/10" />
                            {post.date ? new Date(post.date).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.views !== undefined && (
                            <span className="flex items-center gap-2">
                                <Eye size={12} className="text-white/10" />
                                {post.views} views
                            </span>
                        )}
                        <span className="hidden sm:inline-flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            by {post.author || 'Admin'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-white/5 md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                    {/* Desktop Actions */}
                    <div className="hidden min-[1100px]:flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-9 text-[0.65rem] uppercase tracking-[0.2em] px-4 hover:bg-white/5 hover:text-white rounded-none border border-white/5 hover:border-white/20 transition-all"
                        >
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(post.id)}
                            className="h-9 text-[0.65rem] uppercase tracking-[0.2em] px-4 hover:bg-millions-accent/10 hover:text-millions-accent rounded-none border border-millions-accent/20 transition-all font-bold"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Refine
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(post.id)}
                            className="h-9 w-9 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-none border border-transparent hover:border-red-400/20 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Mobile/Tablet Actions */}
                    <div className="min-[1100px]:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 border border-white/10 rounded-none text-white/60">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-millions-dark border-white/10 rounded-none min-w-[160px]">
                                <DropdownMenuItem asChild className="text-white/60 focus:bg-white/5 focus:text-white rounded-none cursor-pointer">
                                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center w-full px-2 py-2">
                                        <Eye className="mr-3 h-4 w-4 text-millions-accent" />
                                        <span className="text-[0.7rem] uppercase tracking-widest font-jost">View Post</span>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(post.id)} className="text-white/60 focus:bg-millions-accent/10 focus:text-millions-accent rounded-none cursor-pointer px-2 py-2">
                                    <Edit className="mr-3 h-4 w-4" />
                                    <span className="text-[0.7rem] uppercase tracking-widest font-jost">Refine</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-400 focus:bg-red-400/5 focus:text-red-400 rounded-none cursor-pointer px-2 py-2 border-t border-white/5 mt-1">
                                    <Trash2 className="mr-3 h-4 w-4" />
                                    <span className="text-[0.7rem] uppercase tracking-widest font-jost">Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </Card>
    );
}
