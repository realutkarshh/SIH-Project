"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { DotPattern } from "@/components/magicui/dot-pattern";
import AnimatedImage from "@/components/landing/AnimatedImage";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ERPHero = () => {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 px-4 pt-28 pb-12 bg-gradient-to-b from-background to-muted"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background pattern */}
      <DotPattern
        className={cn(
          "absolute inset-0 z-0 [mask-image:radial-gradient(60vw_circle_at_center,white,transparent)] dark:[mask-image:radial-gradient(60vw_circle_at_center,black,transparent)]"
        )}
      />

      {/* Heading */}
      <motion.div variants={itemVariants}>
        <TextAnimate
          animation="blurIn"
          as="h1"
          duration={1}
          className="font-display text-center text-3xl md:text-6xl font-bold w-full lg:w-auto max-w-5xl mx-auto"
        >
          Smart ERP Portal for Colleges & Organizations
        </TextAnimate>
      </motion.div>

      {/* Subheading */}
      <motion.h2
        className="mt-3 text-base md:text-xl text-gray-500 dark:text-gray-400 tracking-normal text-center max-w-2xl mx-auto z-10"
        variants={itemVariants}
      >
        Manage attendance, academics, finances, HR, and student services — all
        in one intelligent ERP system designed to make operations smoother.
      </motion.h2>

      {/* CTA */}
      <motion.div variants={itemVariants} className="z-20">
        <Link href="/erp/dashboard" passHref>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold rounded-lg cursor-pointer px-8 py-3 h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 group relative overflow-hidden border-0">
            <span className="relative z-10 flex items-center gap-2">
              Launch ERP
              <ArrowRightIcon className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </Link>
      </motion.div>

      {/* Image / Dashboard Preview */}
      <motion.div variants={itemVariants}>
        <AnimatedImage
          src="/images/image.png"
          alt="ERP Dashboard Preview"
          width={1200}
          height={900}
          className="w-full h-auto max-w-6xl mx-auto rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800"
        />
      </motion.div>
    </motion.div>
  );
};

export default ERPHero;
