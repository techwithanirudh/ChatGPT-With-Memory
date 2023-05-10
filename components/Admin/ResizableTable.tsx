import React, { useEffect } from "react";
import "./ResizableTable.css";

interface Props {
  children: React.ReactNode;
  className?: string;
}

function ResizableTable(props: Props) {
  const { children, className } = props;

  useEffect(() => {
    function resizeTable(
      table: HTMLTableElement | null,
      selector = "thead tr th",
      minWidth = 5
    ) {
      if (!table) return;
      const cols = table.querySelectorAll(selector);
      const parent = table.parentNode as HTMLElement;
      const tableWidth = table.offsetWidth;
      let value = 0;

      parent.dataset.tableParent = "";
      parent.style.setProperty(`--th`, `${table.offsetHeight}px`);

      cols.forEach((col, index) => {
        const colWidth = parseInt(
					
					// @ts-ignore
          (100 / (tableWidth / col.offsetWidth)).toString()
        );
				
				// @ts-ignore
        col.style.width = `calc(1% * var(--c${index}))`;

        table.style.setProperty(`--c${index}`, colWidth.toString());

        if (index > 0) {
          const input = document.createElement("input");
          input.dataset.tableCol = index.toString();
          input.setAttribute("aria-hideen", "true");
          input.type = "range";
          input.value = value.toString();
          parent.appendChild(input);

          input.addEventListener("input", () => {
            if (input.valueAsNumber < minWidth)
              input.value = minWidth.toString();
            if (input.valueAsNumber > 100 - minWidth)
              input.value = (100 - minWidth).toString();

            const next = input.nextElementSibling as HTMLInputElement | null;
            const prev =
              input.previousElementSibling as HTMLInputElement | null;

            if (
              next?.nodeName === "INPUT" &&
              input.valueAsNumber > next.valueAsNumber - minWidth
            ) {
              input.value = (next.valueAsNumber - minWidth).toString();
              return;
            }
            if (
              prev?.nodeName === "INPUT" &&
              input.valueAsNumber < prev.valueAsNumber + minWidth
            ) {
              input.value = (prev.valueAsNumber + minWidth).toString();
              return;
            }

            table.style.setProperty(
              `--c${index - 1}`,
              prev?.nodeName === "INPUT"
                ? (input.valueAsNumber - prev.valueAsNumber).toString()
                : input.value
            );
            table.style.setProperty(
              `--c${index}`,
              next?.nodeName === "INPUT"
                ? (next.valueAsNumber - input.valueAsNumber).toString()
                : (100 - input.valueAsNumber).toString()
            );
          });
        }

        value += colWidth;
      });

      /* HACK TO INIT FIREFOX: Trigger input event on last range to re-position sliders */
      const lastRange = table.parentNode?.lastChild as HTMLInputElement | null;
      if (lastRange?.nodeName === "INPUT") {
        lastRange.dispatchEvent(
          new Event("input", {
            bubbles: true,
            cancelable: true,
          })
        );
      }

      table.style.setProperty(`--c1`, "8");
    }

    /* Init Demo */
    const table = document.querySelector("table");
    resizeTable(table);
    if (table) table.style.tableLayout = "fixed";
  }, []);

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table className={className}>{children}</table>
    </div>
  );
}

export default ResizableTable;
