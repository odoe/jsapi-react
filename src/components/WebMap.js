import React, { useEffect, useRef } from "react";

export function WebMap() {
  const elementRef = useRef();

  useEffect(_ => {
    // lazy load the module that loads the JSAPI
    // and initialize it
    import("../data/app").then(
      app => app.initialize(elementRef.current)
    );
  });

  // assign elementRef to the ref of our component
  return (
    <div className="viewDiv" ref={elementRef}>
    </div>
  );
}



