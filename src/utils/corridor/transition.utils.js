import { createFlicker } from "../lamp/flicker";

function wait(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

function doFirstTransition() {}
