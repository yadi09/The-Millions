import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../features/auth/authSlice';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password }).unwrap();
            navigate('/admin');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-millions-dark flex items-center justify-center p-6 relative overflow-hidden selection:bg-millions-accent selection:text-millions-dark">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-[url('/grid-subtle.svg')] bg-repeat opacity-[0.03] pointer-events-none" />
            <div className="absolute -top-48 -left-48 w-96 h-96 bg-millions-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-millions-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

            <div className="w-full max-w-lg relative z-10 animate-fade-in">
                {/* Branding Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 border border-millions-accent/20 rounded-none flex items-center justify-center mx-auto mb-8 relative group">
                        <div className="absolute inset-0 bg-millions-accent/5 group-hover:bg-millions-accent/10 transition-colors" />
                        <span className="font-cormorant text-4xl font-bold text-millions-accent relative">M</span>
                    </div>
                    <h1 className="font-cormorant text-[clamp(2.5rem,6vw,4rem)] font-light text-white leading-none mb-6">
                        Millions <em className="italic text-millions-accent not-italic">Sync</em>
                    </h1>
                     <div className="flex items-center justify-center gap-4 text-millions-accent text-[0.65rem] tracking-[0.2em] uppercase opacity-50 font-light">
                        <div className="w-8 h-[1px] bg-millions-accent/40" />
                        Architectural Control Center
                    </div>
                </div>

                <Card className="bg-white/5 border-white/5 backdrop-blur-xl rounded-none shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-millions-accent/20 to-transparent" />
                    
                    <CardContent className="p-10 md:p-14">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Email Input */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.15em] flex items-center gap-2 font-light">
                                    <ShieldCheck size={12} className="text-millions-accent/60" />
                                    Access Identity
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/5 px-6 py-4 text-white font-jost text-[0.85rem] tracking-wider focus:border-millions-accent/30 outline-none transition-all rounded-none placeholder:text-white/5 font-light"
                                    placeholder="ADMIN@THEMILLIONS.COM"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-3">
                                <label htmlFor="password" className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.15em] flex items-center gap-2 font-light">
                                    <Lock size={12} className="text-millions-accent/60" />
                                    Security Key
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/5 px-6 py-4 text-white font-jost text-[0.85rem] tracking-[0.3em] focus:border-millions-accent/30 outline-none transition-all rounded-none placeholder:text-white/5 font-light"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-400/5 border border-red-400/10 rounded-none animate-shake">
                                    <p className="text-[0.6rem] text-red-400/80 font-jost uppercase tracking-widest text-center font-light">
                                        {('data' in error && typeof error.data === 'object' && error.data && 'message' in error.data)
                                            ? String(error.data.message)
                                            : 'Authentication Refused. Verify Identity.'}
                                    </p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-millions-accent text-millions-dark hover:bg-white rounded-none py-7 text-[0.7rem] uppercase tracking-[0.2em] font-bold shadow-xl transition-all duration-500 group"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        Enter Control Center
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Regulatory Footer */}
                        <div className="mt-12 pt-8 border-t border-white/5 text-center">
                            <p className="text-[0.55rem] font-jost text-white/10 uppercase tracking-[0.2em] leading-loose font-light">
                                Protected Architectural Area. 
                                <br />
                                Authorized Access Protocols Required.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;
