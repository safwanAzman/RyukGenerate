"use client";
import { ReactNode } from "react";
import Header from "./header";
import { useLoading } from "@/hooks/loading";
import ParticleImage from "react-particle-image";
import { particleOptions, motionForce } from "@/utils/particleOptions";
import { useAbout } from "@/hooks/about";

interface BaseLayoutProps {
  children: ReactNode;
}


const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { pendingSpeech } = useLoading();
  const { aboutPage } = useAbout();
  return (
    <div className="relative">
      <div className={`container mx-auto flex flex-col w-full justify-center h-screen`}>
        <div className={`${pendingSpeech ? 'animate-speech' : ''}`}>
          <div className={`main-container ${pendingSpeech ? ' bg-black/85' : 'bg-black/50'}`}>
            {aboutPage && (
              <div className="hidden lg:block">
                <ParticleImage
                  src={"./ryuk.jpeg"}
                  width={500}
                  height={750}
                  scale={0.5}
                  entropy={20}
                  maxParticles={6000}
                  particleOptions={particleOptions}
                  mouseMoveForce={motionForce}
                  touchMoveForce={motionForce}
                  className="absolute right-0 top-0 z-0 px-1"
                  backgroundColor="transparent"
                />
              </div>
            )}
            <Header />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BaseLayout;