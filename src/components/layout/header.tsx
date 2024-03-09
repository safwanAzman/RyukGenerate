"use client";
import { useAbout } from "@/hooks/about";
import {GithubIcon, MessageSquare } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { setAboutPage , aboutPage } = useAbout();
  return (
    <header className={`flex items-center justify-between px-6 py-4 z-50 ${aboutPage ? 'absolute w-full' : ''}`}>
      <button onClick={() => setAboutPage(false)}>
        <h1 className="font-bold text-white text-lg">RYUK-<span className="text-main">GENERATE</span></h1>
      </button>
      <div className="flex items-center space-x-2 md:space-x-5">
        <button onClick={() => setAboutPage(true)} className={`flex items-center  text-xs md:text-sm hover:text-main ${aboutPage ? 'text-main' : 'text-white'}`}>
          <MessageSquare className="w-4 h-4 mr-1" />
          <p>About</p>
        </button>
        <Link href="/" target="_blank" className="flex items-center  text-white text-xs md:text-sm hover:text-main">
          <GithubIcon className="w-4 h-4 mr-1" />
          <p>Github</p>
        </Link>
      </div>
    </header>
  );
}
export default Header;