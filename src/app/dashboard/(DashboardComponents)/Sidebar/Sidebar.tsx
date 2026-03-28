"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen,
  Users,
  Settings,
  PieChart,
  ChevronDown,
  Bookmark,
  Calendar,
  CreditCard,
  FileText,
  UserPlus,
  GraduationCap,
  Clipboard,
  User,
  PlusCircle,
  School,
  UserCheck,
  FileSearch,
  UserCog,
  Home,
  BookOpenText,
  BookOpenIcon
} from 'lucide-react';
import { useSidebar } from '@/context/sidebar-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  text: string;
}

interface Section {
  title: string;
  icon: React.ReactNode;
  key: string;
  items: NavItem[];
}

export function Sidebar() {
  const { expandedItems, toggleItem } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const instituteSections: Section[] = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      key: 'dashboard',
      items: [
        { href: "/dashboard/admin", icon: <PieChart className="h-4 w-4" />, text: "Overview" }
      ]
    },
    {
      title: "Product Info",
      icon: <BookOpen className="h-5 w-5" />,
      key: 'product',
      items: [
        { href: "/dashboard/admin/add-product", icon: <PlusCircle className="h-4 w-4" />, text: "Add Product" },
        { href: "/dashboard/admin/list-of-products", icon: <BookOpenText className="h-4 w-4" />, text: "Product Catalog" },
      ]
    },
    {
      title: "Order Info",
      icon: <BookOpen className="h-5 w-5" />,
      key: 'order',
      items: [
        { href: "/dashboard/admin/add-order", icon: <PlusCircle className="h-4 w-4" />, text: "Add Order" },
        { href: "/dashboard/admin/list-of-orders", icon: <BookOpenText className="h-4 w-4" />, text: "Orders List" },
      ]
    },

  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white text-gray-900 shadow-xl">
      {/* Elegant Header */}
      <div className="flex h-20 items-center justify-center border-b border-gray-200 px-6 bg-white shadow-sm">
        <Link href={"/"} className="text-xl font-semibold flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black text-white">
            <BookOpenIcon className="h-6 w-6" />
          </div>
          <span className="text-black font-bold">TITB</span>
        </Link>
      </div>
      
      {/* Sophisticated Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <nav className="space-y-1">
          {instituteSections.map((section) => (
            <CollapsibleSection 
              key={section.key}
              title={section.title}
              icon={section.icon}
              expanded={expandedItems[section.key]}
              onToggle={() => toggleItem(section.key)}
            >
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  active={isActive(item.href)}
                  nested
                >
                  {item.text}
                </NavItem>
              ))}
            </CollapsibleSection>
          ))}
        </nav>
      </div>

      {/* Minimalist User Profile */}
      <div 
        className="border-t border-gray-200 p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        onClick={async () => {
          router.push("/");
          router.refresh();
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow">
            <Image 
              src={'https://res.cloudinary.com/dc3czyqsb/image/upload/v1739842044/czkyrznb4mn6q05i0oal.png'} 
              fill
              alt='profile' 
              className="object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Suhad</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Refined Collapsible Section
function CollapsibleSection({
  title,
  icon,
  children,
  expanded,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="group">
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-4 py-3 transition-all",
          "hover:bg-gray-50 group-hover:shadow-sm",
          "font-medium text-gray-700",
          "transition-all duration-200 ease-out"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-500">{icon}</span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200 text-gray-400",
          expanded ? 'rotate-180' : ''
        )} />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out",
        expanded ? 'mt-1 max-h-96' : 'max-h-0'
      )}>
        <div className="ml-10 space-y-1 border-l border-gray-200 pl-3">
          {children}
        </div>
      </div>
    </div>
  );
}

// Elegant Navigation Item
function NavItem({
  href,
  icon,
  children,
  active,
  nested = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all",
        "text-gray-600 hover:bg-gray-50 hover:text-black",
        "transition-colors duration-150 ease-in-out",
        active ? "bg-gray-100 text-black font-medium" : "",
        nested ? "text-sm" : ""
      )}
    >
      <span className={cn(
        "flex items-center justify-center w-5 h-5",
        active ? "text-black" : "text-gray-500"
      )}>
        {icon}
      </span>
      <span>{children}</span>
      {active && (
        <span className="ml-auto h-2 w-2 rounded-full bg-black"></span>
      )}
    </Link>
  );
}