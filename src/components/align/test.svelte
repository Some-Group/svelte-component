<script lang="ts">
  import Align from "./Align.svelte";
  import { formatStyle } from "../../utils";
  import type { MouseEventHandler } from "svelte/elements";

  let point: { pageX: number; pageY: number } | null = null;
  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    point = { pageX: event.pageX, pageY: event.pageY };
  };

  const align = {
    points: ["cc", "cc"],
  };
</script>

<div style={formatStyle({ marginBottom: 170 })}>
  <div
    style={formatStyle({
      margin: 20,
      border: "1px solid red",
      padding: "100px 0",
      textAlign: "center",
    })}
    on:click={handleClick}
  >
    Click this region please : )
  </div>

  <Align target={point} {align}>
    <div
      style={formatStyle({
        position: "absolute",
        width: 100,
        height: 100,
        background: "rgba(0, 255, 0, 0.5)",
        pointerEvents: "none",
      })}
    >
      Align
    </div>
  </Align>
</div>
