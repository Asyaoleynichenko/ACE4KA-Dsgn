import { useRef } from 'react';
import { useHomeCameraScroll } from '../hooks/useHomeCameraScroll.js';

/** Scroll = camera на главной; монтируется внутри `.home-page--seamless`. */
export default function HomeCameraScroll({ children, bridgeLabel = '' }) {
  const rootRef = useRef(null);
  useHomeCameraScroll(rootRef);

  return (
    <div ref={rootRef} className="home-page home-page--chrome home-page--seamless">
      <div className="home-world" aria-hidden="true">
        <div className="home-world__glow home-world__glow--a" />
        <div className="home-world__glow home-world__glow--b" />
        <div className="home-world__grain" />
        <div className="home-world__vignette" />
      </div>
      {bridgeLabel ? (
        <div className="home-type-bridge" aria-hidden="true">
          <span className="home-type-bridge__word">{bridgeLabel}</span>
        </div>
      ) : null}
      {children}
    </div>
  );
}
