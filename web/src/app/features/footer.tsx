import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import {
  IoLogoFacebook,
  IoLogoGithub,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoYoutube,
} from "react-icons/io5";

export const Footer = () => {
  return (
    <footer className="bg-black">
      <div className="px-5 lg:px-10 pt-20  divide-y-[1.5px] divide-gray-dark page-max-width">
        <div className="pb-10">
          <p className="text-white font-medium text-lg">
            Subscribe to our newsletter
          </p>
          <p className="text-gray-light text-sm mt-2">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>

          <div className="dark flex items-center flex-col md:flex-row gap-5 mt-5 md:max-w-md">
            <Input placeholder="Enter your email" className="w-full" />
            <Button className="shrink-0 w-full md:w-fit mr-auto">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="flex lg:items-center justify-start lg:justify-between flex-col lg:flex-row py-10 gap-5">
          <p className="text-white">
            © 2023 Dashify, Inc. All rights reserved.
          </p>

          <div className="flex items-center space-x-5 text-2xl">
            <Link href="">
              <IoLogoFacebook className="text-gray-light hover:text-white" />
            </Link>
            <Link href="">
              <IoLogoInstagram className="text-gray-light hover:text-white" />
            </Link>
            <Link href="">
              <IoLogoTwitter className="text-gray-light hover:text-white" />
            </Link>
            <Link href="">
              <IoLogoGithub className="text-gray-light hover:text-white" />
            </Link>
            <Link href="">
              <IoLogoYoutube className="text-gray-light hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
