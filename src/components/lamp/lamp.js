import { setLampType } from "../../utils/lamp/lamp-types";
import { handleVariants } from "../../utils/lamp/lamp-variants";

AFRAME.registerComponent("lamp", {
  schema: {
    type: { type: "string", default: "ceiling" },
    variant: { type: "string", default: "normal" },
  },

  init() {
    // this.el.classList.add("clickable");
    setLampType(this);
    handleVariants(this);
  },

  update(oldData) {
    if (oldData.variant === undefined) return; // skip A-Frame's initial update call
    if (oldData.variant === this.data.variant) return;
    if (this._updateVariant) this._updateVariant();
  },
});
