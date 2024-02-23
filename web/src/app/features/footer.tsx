import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import {
  IoLogoGithub,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoLinkedin,
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
            <Link
              href="https://www.instagram.com/nakel_dev"
              target="_blank"
              rel="noreferrer"
            >
              <IoLogoInstagram className="text-gray-light hover:text-white" />
            </Link>
            <Link
              href="https://twitter.com/nakel_dev"
              target="_blank"
              rel="noreferrer"
            >
              <IoLogoTwitter className="text-gray-light hover:text-white" />
            </Link>
            <Link
              href="https://github.com/nakel-ola"
              target="_blank"
              rel="noreferrer"
            >
              <IoLogoGithub className="text-gray-light hover:text-white" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/olamilekan-nunu/"
              target="_blank"
              rel="noreferrer"
            >
              <IoLogoLinkedin className="text-gray-light hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
