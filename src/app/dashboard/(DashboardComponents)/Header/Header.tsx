'use client'

import { ChevronDown, Menu, Settings, LogOut,CreditCard } from 'lucide-react'
import { useSidebar } from '@/context/sidebar-context'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'




export function Header() {
  const { toggleMobileSidebar } = useSidebar()



 

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b  px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileSidebar}
          className="rounded-md p-1 hover:bg-gray-100 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-black" />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 text-white hover:text-black focus:outline-none">
            <div className="relative h-10 w-10">
              <Image 
                src={ 'https://res.cloudinary.com/dc3czyqsb/image/upload/v1739842044/czkyrznb4mn6q05i0oal.png'} 
                width={40} 
                height={40} 
                alt="Profile picture"
                className="rounded-full border-2 border-gray-200 object-cover w-10 h-10"
              />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Suhad |Admin</p>
              <p className="text-xs text-gray-500 capitalize">
                Role : Admin
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Suhad | Admin</p>
                <p className="text-xs text-gray-500 capitalize">
                  Role : Admin
                </p>
                <p className="text-xs leading-none text-gray-500">
                  suhadahmodkhan@gmail.com
                </p>
               
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
             
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              
              className="cursor-pointer"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Balance</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
          
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}