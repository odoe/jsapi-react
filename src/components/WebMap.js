import React, { useEffect, useRef } from "react";

export function WebMap() {
  const elementRef = useRef();

  useEffect(_ => {
    import("../data/app").then(
      app => app.initialize(elementRef.current)
    );
  });

  return (
    <div className="viewDiv" ref={elementRef}>
    </div>
  );

}
