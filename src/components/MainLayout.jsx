import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import { GiHamburgerMenu } from "react-icons/gi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


const MainLayout = () => {

  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <div className='md:w-[16%] md:block hidden'>
          <LeftSidebar></LeftSidebar>
        
      </div>

      <Sheet className='md:hidden ' open={open} onOpenChange={(open)=>setOpen(open)}>
        <SheetTrigger><GiHamburgerMenu className='md:hidden ' /></SheetTrigger>
        <SheetContent side='left'>
          
          <LeftSidebar></LeftSidebar>
        </SheetContent>
      </Sheet>

     

      
      
          <div >
              <Outlet></Outlet>
          </div>
    </div>
  )
}

export default MainLayout
