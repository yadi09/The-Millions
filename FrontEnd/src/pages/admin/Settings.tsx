import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Mail, KeyRound, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
    useChangeEmailMutation,
    useChangePasswordMutation,
} from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mb-2 block font-medium">
        {children}
    </label>
);

const SettingsInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full bg-white/5 border border-white/10 text-white font-jost text-sm tracking-wide focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 rounded-none h-12 px-4 transition-all placeholder:text-white/15 ${
            props.className || ""
        }`}
    />
);

function PasswordField({
    value,
    onChange,
    placeholder,
    autoComplete,
    name,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    autoComplete?: string;
    name?: string;
}) {
    const [shown, setShown] = useState(false);
    return (
        <div className="relative">
            <SettingsInput
                type={shown ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                name={name}
                className="pr-12"
            />
            <button
                type="button"
                onClick={() => setShown((s) => !s)}
                aria-label={shown ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-millions-accent transition-colors p-1"
            >
                {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    );
}

function getErrorMessage(err: unknown, fallback: string): string {
    const e = err as { data?: { message?: string; errors?: any } } | undefined;
    return e?.data?.message || fallback;
}

const AdminSettings = () => {
    const currentEmail = useSelector((s: RootState) => s.auth.user?.email) || "";

    // Email form
    const [emailForm, setEmailForm] = useState({ currentPassword: "", newEmail: "" });
    const [changeEmail, { isLoading: isChangingEmail }] = useChangeEmailMutation();

    // Password form
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!emailForm.newEmail.trim() || !emailForm.currentPassword) {
            toast.error("Enter your current password and a new email.");
            return;
        }
        if (emailForm.newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
            toast.error("That's already your current email.");
            return;
        }
        try {
            await changeEmail({
                currentPassword: emailForm.currentPassword,
                newEmail: emailForm.newEmail.trim(),
            }).unwrap();
            toast.success("Email updated. Your session has been refreshed.");
            setEmailForm({ currentPassword: "", newEmail: "" });
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not update email."));
        }
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!pwForm.currentPassword || !pwForm.newPassword) {
            toast.error("Enter your current and new password.");
            return;
        }
        if (pwForm.newPassword.length < 12) {
            toast.error("New password must be at least 12 characters.");
            return;
        }
        if (pwForm.newPassword !== pwForm.confirmNewPassword) {
            toast.error("New password and confirmation don't match.");
            return;
        }
        if (pwForm.newPassword === pwForm.currentPassword) {
            toast.error("New password must be different from the current one.");
            return;
        }
        try {
            await changePassword({
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            }).unwrap();
            toast.success("Password updated.");
            setPwForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not update password."));
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8 md:space-y-10 max-w-3xl mx-auto pb-12 sm:pb-16 md:pb-20 animate-fade-in">
            <div>
                <h1 className="font-cormorant text-[clamp(1.85rem,6vw,3.5rem)] font-light text-white mb-3 sm:mb-4 leading-tight">
                    Account <em className="italic text-millions-accent">Settings</em>
                </h1>
                <div className="flex items-center gap-3 sm:gap-4 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase">
                    <div className="w-6 sm:w-8 h-[1px] bg-millions-accent/40" />
                    Login Credentials
                </div>
                {currentEmail && (
                    <p className="mt-4 sm:mt-5 text-white/40 font-jost text-[0.75rem] sm:text-[0.8rem] tracking-wide">
                        Signed in as <span className="text-white/70">{currentEmail}</span>
                    </p>
                )}
            </div>

            {/* Change Email */}
            <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none animate-fade-in-up">
                <CardContent className="p-5 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-white/5">
                        <div className="w-10 h-10 bg-millions-accent/5 border border-millions-accent/10 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-millions-accent" />
                        </div>
                        <div>
                            <h2 className="font-cormorant text-xl sm:text-2xl text-white font-light italic leading-none">Change Email</h2>
                            <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mt-1.5">Updates your login address</p>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="space-y-5 sm:space-y-6">
                        <input type="text" name="username" value={currentEmail} autoComplete="username" readOnly className="hidden" />
                        <div>
                            <Label>New Email</Label>
                            <SettingsInput
                                type="email"
                                value={emailForm.newEmail}
                                onChange={(e) => setEmailForm((f) => ({ ...f, newEmail: e.target.value }))}
                                placeholder="you@example.com"
                                autoComplete="email"
                                name="email"
                            />
                        </div>
                        <div>
                            <Label>Current Password</Label>
                            <PasswordField
                                value={emailForm.currentPassword}
                                onChange={(v) => setEmailForm((f) => ({ ...f, currentPassword: v }))}
                                placeholder="Enter current password to confirm"
                                autoComplete="current-password"
                                name="current-password"
                            />
                        </div>
                        <div className="pt-3 sm:pt-4 border-t border-white/5">
                            <Button
                                type="submit"
                                disabled={isChangingEmail}
                                className="w-full sm:w-auto h-11 sm:h-12 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.2em] uppercase text-[0.65rem] sm:text-[0.7rem] font-bold px-6 sm:px-10 transition-all shadow-lg"
                            >
                                {isChangingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Update Email
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none animate-fade-in-up">
                <CardContent className="p-5 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-white/5">
                        <div className="w-10 h-10 bg-millions-accent/5 border border-millions-accent/10 flex items-center justify-center shrink-0">
                            <KeyRound className="w-4 h-4 text-millions-accent" />
                        </div>
                        <div>
                            <h2 className="font-cormorant text-xl sm:text-2xl text-white font-light italic leading-none">Change Password</h2>
                            <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mt-1.5">Minimum 12 characters</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-5 sm:space-y-6">
                        <input type="text" name="username" value={currentEmail} autoComplete="username" readOnly className="hidden" />
                        <div>
                            <Label>Current Password</Label>
                            <PasswordField
                                value={pwForm.currentPassword}
                                onChange={(v) => setPwForm((f) => ({ ...f, currentPassword: v }))}
                                placeholder="Enter current password"
                                autoComplete="current-password"
                                name="current-password"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <Label>New Password</Label>
                                <PasswordField
                                    value={pwForm.newPassword}
                                    onChange={(v) => setPwForm((f) => ({ ...f, newPassword: v }))}
                                    placeholder="At least 12 characters"
                                    autoComplete="new-password"
                                    name="new-password"
                                />
                            </div>
                            <div>
                                <Label>Confirm New Password</Label>
                                <PasswordField
                                    value={pwForm.confirmNewPassword}
                                    onChange={(v) => setPwForm((f) => ({ ...f, confirmNewPassword: v }))}
                                    placeholder="Re-enter new password"
                                    autoComplete="new-password"
                                    name="confirm-new-password"
                                />
                            </div>
                        </div>
                        <div className="pt-3 sm:pt-4 border-t border-white/5">
                            <Button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full sm:w-auto h-11 sm:h-12 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.2em] uppercase text-[0.65rem] sm:text-[0.7rem] font-bold px-6 sm:px-10 transition-all shadow-lg"
                            >
                                {isChangingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Update Password
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSettings;
