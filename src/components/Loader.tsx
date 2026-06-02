"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Loader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onLoad = () => setTimeout(() => setDone(true), 700);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    // Safety net: never trap the page behind the loader.
    const failsafe = setTimeout(() => setDone(true), 2600);

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setHidden(true), 750);
    return () => clearTimeout(t);
  }, [done]);

  if (hidden) return null;

  return (
    <div id="loader" className={done ? "done" : undefined}>
      <Image className="iris" src="/assets/logo-mark.png" alt="" width={545} height={500} priority />
      <div className="lt">LOADING THE FRAME</div>
    </div>
  );
}
