import React, { useState } from 'react';
import { BackButton } from './Buttons';

interface SignInPageProps {
  onBack: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691c2.242-4.333 6.848-7.391 12.18-7.882l5.657 5.657C21.758 12.433 18.016 14.69 14.69 17.758l-8.384-8.067z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.521-4.504 2.43-7.219 2.43c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.018 35.839 44 30.131 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);


export default function SignInPage({ onBack }: SignInPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
       <div className="w-full max-w-md">
            <BackButton onClick={onBack} className="mb-6">
                Back to App
            </BackButton>
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-lg">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 text-center">{isSignUp ? 'Create an Account' : 'Sign In'}</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-center">
                    {isSignUp ? 'to start your worldbuilding journey.' : 'to access your projects.'}
                </p>

                <div className="space-y-4">
                    <button className="w-full flex items-center justify-center py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium">
                        <GoogleIcon />
                        Sign in with Google
                    </button>
                    {/* Add other social logins here */}
                </div>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                </div>

                <form className="space-y-4">
                    {isSignUp && (
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                            <input id="name" type="text" placeholder="Your Name" required className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                        <input id="email" type="email" placeholder="you@example.com" required className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
                        <input id="password" type="password" placeholder="••••••••" required className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow" />
                    </div>
                     {isSignUp && (
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Confirm Password</label>
                            <input id="confirm-password" type="password" placeholder="••••••••" required className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow" />
                        </div>
                    )}

                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline ml-1">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
       </div>
    </div>
  );
}
