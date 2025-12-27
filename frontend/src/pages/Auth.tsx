/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Mail, Lock, User, MapPin, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const { login } = useAuth(); // Get the login function
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fname: "", // Split Name into First/Last to match SQL
    lname: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Real API Call
      const res = await api.post("/users/login", loginData);

      // 2. Update Global State
      login(res.data.token, res.data.data.user);

      toast({
        title: "Welcome back!",
        description: `Logged in as ${res.data.data.user.username}`,
      });

      // 3. Redirect based on role
      if (res.data.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Real API Call
      const res = await api.post("/users/signup", {
        username: signupData.username,
        password: signupData.password,
        first_name: signupData.fname,
        last_name: signupData.lname,
        email: signupData.email,
        phone: signupData.phone,
        shipping_address: signupData.address,
      });

      // 2. Update Global State (Auto-login after signup)
      login(res.data.token, res.data.data.user);

      toast({
        title: "Account created!",
        description: "Welcome to Bibliomania.",
      });

      navigate("/");
    } catch (err: any) {
      toast({
        title: "Signup Failed",
        description: err.response?.data?.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-primary-foreground">
          <div className="w-24 h-24 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8 backdrop-blur-sm">
            <BookOpen className="h-12 w-12" />
          </div>
          <h1 className="font-display text-4xl font-bold text-center mb-4">
            Welcome to Bibliomania
          </h1>
          <p className="text-primary-foreground/80 text-center max-w-md text-lg">
            Your gateway to a world of knowledge. Discover, explore, and collect
            books that inspire and enlighten.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="font-display text-2xl font-bold">
                    Welcome Back
                  </h2>
                  <p className="text-muted-foreground">
                    Enter your credentials to access your account
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup" className="space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="font-display text-2xl font-bold">
                    Create Account
                  </h2>
                  <p className="text-muted-foreground">
                    Join our community of book lovers
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-username"
                          placeholder="johndoe"
                          className="pl-10"
                          value={signupData.username}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              username: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Updated: First Name and Last Name instead of Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-fname">First Name</Label>
                      <Input
                        id="signup-fname"
                        placeholder="John"
                        value={signupData.fname}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            fname: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-lname">Last Name</Label>
                      <Input
                        id="signup-lname"
                        placeholder="Doe"
                        value={signupData.lname}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            lname: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone</Label>
                      <Input
                        id="signup-phone"
                        placeholder="010..."
                        value={signupData.phone}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-address">Shipping Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-address"
                        placeholder="123 Street..."
                        className="pl-10"
                        value={signupData.address}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            address: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          className="pl-10"
                          value={signupData.password}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm"
                          type="password"
                          className="pl-10"
                          value={signupData.confirmPassword}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
