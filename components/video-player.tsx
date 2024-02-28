"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { SourceProps } from "react-player/base";

export const VideoPlayer = ({ url }: { url: string | string[] | SourceProps[] | MediaStream | undefined }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div>{isClient && <ReactPlayer  url={url} controls />}</div>;
};
