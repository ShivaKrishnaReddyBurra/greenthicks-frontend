
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm, { AuthMode } from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthPageProps {
  mode?: AuthMode;
  redirectUrl?: string;
}

const AuthPage = ({ mode = "signin", redirectUrl }: AuthPageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 leaf-pattern">
        <div className="container px-4 py-12">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="max-w-md mx-auto text-center mb-8">
            <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">GT</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "signin" ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="text-gray-600 mt-2">
              {mode === "signin" 
                ? "Sign in to access your Green Thicks account" 
                : "Join Green Thicks for farm-fresh organic vegetables"}
            </p>
          </div>
          
          <AuthForm defaultMode={mode} redirectUrl={redirectUrl} />
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {mode === "signin" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <Link 
                to={mode === "signin" ? "/signup" : "/login"} 
                className="text-primary hover:underline"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
