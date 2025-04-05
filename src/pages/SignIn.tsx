
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, LockKeyhole, ArrowRight } from 'lucide-react';
import { CategoryDisplay } from '@/components/CategoryDisplay';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in attempted with:', { email, password });
    // Here you would integrate with Supabase for email auth
  };

  const handlePhoneSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerifying) {
      console.log('Sending verification code to:', phoneNumber);
      setIsVerifying(true);
      // Here you would send verification code via Supabase
    } else {
      console.log('Verifying code:', verificationCode);
      // Here you would verify the code via Supabase
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Signing in with Google');
    // Here you would integrate with Supabase for Google auth
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <CategoryDisplay />
      
      <main className="flex-grow py-8 md:py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue shopping</p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleEmailSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Email address"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-right">
                      <a href="#" className="text-sm text-ecommerce-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="phone">
                <form onSubmit={handlePhoneSignIn} className="space-y-5">
                  {!isVerifying ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="Phone number"
                          className="pl-10"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="text-center text-xl tracking-wider"
                        required
                      />
                      <p className="text-sm text-center text-gray-500">
                        We've sent a code to {phoneNumber}
                      </p>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full">
                    {!isVerifying ? 'Continue' : 'Verify Code'}
                  </Button>
                  
                  {isVerifying && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => setIsVerifying(false)}
                    >
                      Change phone number
                    </Button>
                  )}
                </form>
              </TabsContent>
            </Tabs>
            
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
              <span className="text-gray-600">Don't have an account?</span>
              <a href="#" className="ml-1 text-ecommerce-600 hover:underline">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
