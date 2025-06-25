'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useRouter,usePathname } from 'next/navigation'

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  const renderNavigation = () => {
    if(pathname === '/dashboard' || pathname.startsWith('/dashboard/')){
      return <Link href="/" className='font-semibold'>Home</Link>
    }
    if(pathname === '/'){
      return <Link href="/dashboard" className='font-semibold'>Dashboard</Link>
    }

    return null;
  }

  const user: User = session?.user as User;

  const logOut = async() => {
    setIsLoading(true);
    const response = await signOut({ redirect: false });
    
    toast.success('Logged out successfully');
    router.replace('/')
    setIsLoading(false);
  }

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user.username || user?.email}
            </span>

            <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4'>
              {renderNavigation()}
              <Button
                onClick={() => logOut()}
                className="w-full md:w-auto bg-slate-100 text-black cursor-pointer"
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            {renderNavigation()}

            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black cursor-pointer"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar

