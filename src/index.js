import "./config";

import React from "react";
import { render } from "react-dom";

import { WebMap } from "./components/WebMap";

const rootElement = document.getElementById("root");
render(<WebMap />, rootElement);

