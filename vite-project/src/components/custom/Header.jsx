import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'

function Header() {
    const { user, isSignedIn } = useUser();

    return (
        <header className="p-4 px-6 md:px-12 shadow-md bg-white sticky top-0 z-50">
            <div className="w-full flex items-center justify-between">
                <Link to={'/dashboard'} className="flex items-center gap-2">
                    <img
                        src="/logo.svg"
                        alt="Logo"
                        className="cursor-pointer transition-transform hover:scale-105"
                        width={100}
                        height={100}
                    />
                </Link>

                {isSignedIn ? (
                    <div className="flex items-center gap-4">
                        <Link to={'/dashboard'}>
                          <Button variant="outline" className="hover:bg-gray-100 transition cursor-pointer">
                             Dashboard
                           </Button>
                        </Link>

                        <UserButton afterSignOutUrl='/' />
                    </div>
                ) : (
                    <Link to={'/auth/sign-in'}>
                       <Button className="bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer">
                                Get Started
                        </Button>
                    </Link>

                )}
            </div>
        </header>
    )
}

export default Header
