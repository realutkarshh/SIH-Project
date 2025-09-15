"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ERPHero from "@/components/landing/ERPHero";
import Features from "@/components/landing/Feature";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/Footer";
import Navbar from "@/components/landing/navbar";


export default function Home() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        // Scroll smoothly to the element
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname]);

  return (
    <>
      <Navbar></Navbar>
      <ERPHero></ERPHero>
      <Features></Features>
      <HowItWorks></HowItWorks>
      <Footer></Footer>
    </>
  );
}
