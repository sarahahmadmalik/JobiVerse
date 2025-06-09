"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import LeftSection from "@/components/Register/LeftSection";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";
import Spinner from "@/components/ui/spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (err) {
      setError("Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      <LeftSection
        title={"Welcome Back!"}
        description="Good to see you back. Login and Continue your journey."
        buttonText="Register"
        buttonLink="/register"
        linkText="Don't have an account?"
        linkHref="/register"
      />

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
          <p className="text-colors-textSecondary text-[16px] mt-3 mb-6 font-[300] text-center">
            Log in and take the next step with JobiVerse.
          </p>
          
          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full text-colors-textPrimary text-[16px] flex items-center justify-center border border-[#00000066] rounded-[12px] px-[24px] gap-3 py-[12px] transition-all duration-500 ease-in-out mb-4 hover:bg-gray-100"
            disabled={loading}
          >
            <Image
              width={20}
              height={20}
              src="/assets/google.svg"
              alt="google-icon"
            />
            {loading ? "Processing..." : "Login with Google"}
          </button>

          {/* Separator */}
          <div className="flex items-center my-3">
            <div className="flex-1 h-px bg-[#999999]"></div>
            <span className="mx-3 text-[#999999] text-sm">or</span>
            <div className="flex-1 h-px bg-[#999999]"></div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="mb-6 text-left">
            <Link
              href="/forgot-password"
              className="text-sm text-colors-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <Button type="submit" className="w-full !font-[400]" disabled={loading}>
            {loading ? (
              <>
                <Spinner /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <div className="w-full md:hidden flex justify-center items-center mt-2">
            <p className="text-[#161819AB] text-sm mt-4">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-colors-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;