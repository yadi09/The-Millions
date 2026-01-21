import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FileText, Clock, Activity, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const AdminDashboard = () => {
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {greeting}, <span className="text-blue-600">Admin!</span>
                    </h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-500" />
                        Here's an overview of your site architecture and activity
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Active Architecture</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">8</h3>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-blue-200 shadow-md">
                                <FileText size={22} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">Total managed pages</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Latest Refinement</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">Home</h3>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-md">
                                <Clock size={22} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 italic">2 hours ago</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Content Velocity</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">4</h3>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-emerald-200 shadow-md">
                                <Activity size={22} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">Updates in last 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { page: "Home", action: "Page updated", time: "2 hours ago" },
                                    { page: "Services", action: "Content modified", time: "1 day ago" },
                                    { page: "About", action: "Metadata changed", time: "3 days ago" },
                                    { page: "Contact", action: "Form settings updated", time: "5 days ago" },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-blue-600 flex items-center justify-center shadow-sm">
                                                    <FileText size={18} />
                                                </div>
                                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${i === 0 ? 'bg-green-500' : 'bg-blue-400'}`} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.page}</p>
                                                <p className="text-sm text-slate-500">{item.action}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100 mt-2 sm:mt-0">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link to="/admin/pages" className="group block p-4 bg-white rounded-xl shadow-sm border hover:border-blue-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Manage Pages</p>
                                        <p className="text-sm text-slate-500">View architectural overview</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                        <Link to="/admin/pages/home" className="group block p-4 bg-white rounded-xl shadow-sm border hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Edit Home Page</p>
                                        <p className="text-sm text-slate-500">Jump to latest refinement</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
