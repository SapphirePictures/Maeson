
import React, { useState } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Heart, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#0F4C5C]">Maeson Realty</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-700 hover:text-[#0F4C5C] transition-colors">
            Home
          </Link>
          <div className="relative group">
            <Link to="/properties" className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#0F4C5C] transition-colors">
              Properties <ChevronDown className="h-4 w-4" />
            </Link>
            <div className="absolute top-full left-0 w-40 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white rounded-md shadow-lg border p-2 flex flex-col gap-1">
                <Link to="/properties" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-sm">Buy</Link>
                <Link to="/properties" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-sm">Rent</Link>
                <Link to="/properties" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-sm">Land</Link>
              </div>
            </div>
          </div>
          <Link to="/about" className="text-sm font-medium text-slate-700 hover:text-[#0F4C5C] transition-colors">
            About Us
          </Link>
          <Link to="/blog" className="text-sm font-medium text-slate-700 hover:text-[#0F4C5C] transition-colors">
            Blog
          </Link>
        </nav>

        {/* CTA Button & Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback className="bg-[#0F4C5C] text-white">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="flex items-center cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    My Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/inquiries" className="flex items-center cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    My Inquiries
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="text-[#0F4C5C]">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#E3B505] text-[#0F4C5C] hover:bg-[#d4a804] font-semibold">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-base font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <div className="flex flex-col space-y-2 pl-4 border-l-2 border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Properties</span>
              <Link to="/properties" className="text-sm text-slate-600" onClick={() => setIsMenuOpen(false)}>Buy</Link>
              <Link to="/properties" className="text-sm text-slate-600" onClick={() => setIsMenuOpen(false)}>Rent</Link>
              <Link to="/properties" className="text-sm text-slate-600" onClick={() => setIsMenuOpen(false)}>Land</Link>
            </div>
            <Link to="/about" className="text-base font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/blog" className="text-base font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <Link to="/contact" className="text-base font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            
            {isAuthenticated ? (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <Avatar>
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-[#0F4C5C] text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link to="/favorites" className="text-base font-medium text-slate-700 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="h-4 w-4" /> Favorites
                  </Link>
                  <Link to="/inquiries" className="text-base font-medium text-slate-700 flex items-center gap-2 mt-3" onClick={() => setIsMenuOpen(false)}>
                    <MessageSquare className="h-4 w-4" /> Inquiries
                  </Link>
                  <Link to="/profile" className="text-base font-medium text-slate-700 flex items-center gap-2 mt-3" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Button 
                    onClick={() => { logout(); setIsMenuOpen(false); }} 
                    variant="outline" 
                    className="w-full mt-4 text-red-600 border-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[#E3B505] text-[#0F4C5C] hover:bg-[#d4a804] font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
