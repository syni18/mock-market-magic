
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, LockKeyhole, User, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

import { signInSchema, signUpSchema, phoneSchema, otpSchema } from '@/utils/ValidationSchema';

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, signInWithPhone, verifyOtp, signInWithGoogle, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Form handlers
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

  // Handle email sign in
  const handleEmailSignIn = async (values: z.infer<typeof signInSchema>) => {
    await signIn(values.email, values.password);
  };

  // Handle sign up
  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    const { email, password, fullName } = values;
    const userData = { full_name: fullName };
    
    const { error, user } = await signUp(email, password, userData);
    
    if (!error && user) {
      setIsSignIn(true);
    }
  };

  // Handle phone sign in
  const handlePhoneSignIn = async (values: z.infer<typeof phoneSchema>) => {
    const phone = values.phoneNumber;
    setPhoneNumber(phone);
    const { error } = await signInWithPhone(phone);
    if (!error) {
      setIsVerifying(true);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    await verifyOtp(phoneNumber, values.code);
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      {/* Home button instead of navbar */}
      <div className="container py-4">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isSignIn ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isSignIn ? "Sign in to continue shopping" : "Sign up to get started"}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {isSignIn ? (
              <>
                {!isPhoneLogin ? (
                  <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(handleEmailSignIn)} className="space-y-5">
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Email address"
                                  className="pl-10"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Password"
                                  className="pl-10"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <div className="text-right">
                              <a href="#" className="text-sm text-indigo-600 hover:underline">
                                Forgot password?
                              </a>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Sign in
                      </Button>
                      
                      <div className="text-center">
                        <button 
                          type="button" 
                          onClick={() => setIsPhoneLogin(true)}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Sign in with phone number
                        </button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <>
                    {!isVerifying ? (
                      <Form {...phoneForm}>
                        <form onSubmit={phoneForm.handleSubmit(handlePhoneSignIn)} className="space-y-5">
                          <FormField
                            control={phoneForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <div className="relative">
                                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="Phone number"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Send Code
                          </Button>
                          
                          <div className="text-center">
                            <button 
                              type="button" 
                              onClick={() => setIsPhoneLogin(false)}
                              className="text-sm text-indigo-600 hover:underline"
                            >
                              Back to email login
                            </button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <Form {...otpForm}>
                        <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-5">
                          <FormField
                            control={otpForm.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter verification code"
                                    className="text-center text-xl tracking-wider"
                                    {...field}
                                  />
                                </FormControl>
                                <p className="text-sm text-center text-gray-500">
                                  We've sent a code to {phoneNumber}
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Verify Code
                          </Button>
                          
                          <Button 
                            type="button" 
                            variant="ghost" 
                            className="w-full"
                            onClick={() => setIsVerifying(false)}
                          >
                            Change phone number
                          </Button>
                        </form>
                      </Form>
                    )}
                  </>
                )}
              </>
            ) : (
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-5">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Full name"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email address"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm password"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Create Account
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full mt-5 flex items-center justify-center gap-2 hover:bg-gray-50"
                onClick={handleGoogleSignIn}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                type="button"
                className="ml-1 text-indigo-600 font-medium hover:underline"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
