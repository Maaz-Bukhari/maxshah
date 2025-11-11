"use client";

import { useEffect, useRef, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./GradientBg";
import GridGlobe from "./GridGlobe";
import MagicButton from "../MagicButton";
import Image from "next/image";

/**
 * NOTE:
 * 1) Move your confetti JSON to the `public` folder as `/public/confetti.json`.
 *    This prevents bundling it into the JS and allows the file to be cached by the browser.
 * 2) Install lottie-web (if not already): npm i lottie-web
 */

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const leftLists = ["ReactJS", "Express", "Typescript"];
  const rightLists = ["VueJS", "NuxtJS", "GraphQL"];
  const [copied, setCopied] = useState(false);
  const lottieContainer = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<any>(null);

  // Play confetti animation when `copied` becomes true.
  useEffect(() => {
    let cancelled = false;

    if (!copied) return;

    // dynamic imports: only run in browser, only when needed
    (async () => {
      if (typeof window === "undefined" || !lottieContainer.current) return;
      try {
        const lottie =
          (await import("lottie-web")).default ?? (await import("lottie-web"));
        // Fetch the JSON from public folder (not bundling it)
        const resp = await fetch("/confetti.json");
        if (!resp.ok) return;
        const animationData = await resp.json();

        if (cancelled) return;

        // destroy a previous animation if any
        if (animRef.current) {
          try {
            animRef.current.destroy();
          } catch (e) {}
          animRef.current = null;
        }

        animRef.current = lottie.loadAnimation({
          container: lottieContainer.current as Element,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData,
        });
      } catch (err) {
        // you can optionally console.error(err) during development
      }
    })();

    // Cleanup on unmount or when copied toggles
    return () => {
      cancelled = true;
      if (animRef.current) {
        try {
          animRef.current.destroy();
        } catch (e) {}
        animRef.current = null;
      }
    };
  }, [copied]);

  // optional: reset copied after a short delay so user can trigger again
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 4500);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("maazbukhari333@gmail.com");
      setCopied(true);
    } catch {
      // fallback or show UI if clipboard fails
      setCopied(true);
    }
  };

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className
      )}
      style={{
        background:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <div className={`${id === 6 ? "flex justify-center" : ""} h-full`}>
        <div className="w-full h-full absolute">
          {img && (
            // consider switching to next/image for production
            <Image
              width={50}
              height={50}
              src={img}
              alt={img}
              className={cn(imgClassName, "object-cover object-center")}
            />
          )}
        </div>

        <div
          className={`absolute right-0 -bottom-5 ${
            id === 5 ? "w-full opacity-80" : ""
          }`}
        >
          {spareImg && (
            <Image
              src={spareImg}
              alt={spareImg}
              className="object-cover object-center w-full! h-full!"
              fill
            />
          )}
        </div>

        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl" />
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>

          <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10">
            {title}
          </div>

          {id === 2 && <GridGlobe />}

          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-6">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-6">
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {id === 6 && (
            <div className="mt-5 relative">
              {/* Lottie container — will be populated client-side */}
              <div
                ref={lottieContainer}
                className="absolute -bottom-5 right-0 w-full h-48 pointer-events-none z-50"
                aria-hidden
              />

              <MagicButton
                title={copied ? "Email is Copied!" : "Copy my email address"}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
                otherClasses="!bg-[#161A31]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
