import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FileText, Clock, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome, Admin!</h1>
                <p className="text-slate-500 mt-2">Here's an overview of your site activity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Pages</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">8</h3>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <FileText size={20} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">Managed pages</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Last Edited</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">Home</h3>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Clock size={20} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">2 hours ago</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Recent Updates</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">4</h3>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Activity size={20} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">Updates in 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-blue-100 rounded text-blue-600 flex items-center justify-center">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{item.page}</p>
                                                <p className="text-sm text-slate-500">{item.action}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-400">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link to="/admin/pages" className="block p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">Manage Pages</p>
                                    <p className="text-sm text-slate-500">View all pages</p>
                                </div>
                                <ArrowRight size={18} className="text-slate-400" />
                            </div>
                        </Link>
                        <Link to="/admin/pages/home" className="block p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">Edit Home Page</p>
                                    <p className="text-sm text-slate-500">Quick access</p>
                                </div>
                                <ArrowRight size={18} className="text-slate-400" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
