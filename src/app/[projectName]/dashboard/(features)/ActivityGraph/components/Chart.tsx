import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleLinear, scaleTime } from "@visx/scale";
import { GridRows } from "@visx/grid";
import { max, bisector } from "@visx/vendor/d3-array";
import React, { FC, useCallback, useMemo } from "react";
import { getMinMax } from "../utils";
import { margin } from "../constants";
import { AreaClosed, Bar, LinePath } from "@visx/shape";
import { localPoint } from "@visx/event/";
import { useTooltip } from "@visx/tooltip";
import { Tooltip } from "./Tooltip";
import useMeasure from "react-use-measure";
import { ClockType, GraphData } from "../types";
import { oneDay, oneHour } from "../../../constants";

type ChartProps = {
  data: GraphData;
  ClockType: ClockType;
};

export const Chart: FC<ChartProps> = ({ data, ClockType }) => {
  const xValues = useCallback(() => data.map((e) => e.x), [data])();
  const d = xValues.filter((element, index) => index % 2 === 0);
  const d2 = d.filter((element, index) => index % 2 === 0);
  console.log(d2.filter((element, index) => index % 2 === 0));
  const [ref, bounds] = useMeasure();
  const width = bounds.width;
  const height = bounds.height;
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<any>();

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [margin, width - margin],
        domain: getMinMax(xValues),
      }),
    [width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [height - margin, margin],
        domain: [0, max(data, (d: any) => d.y) || 0],
      }),
    [height]
  );

  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x);
      const time = x0.getTime();
      const timeXOne = ClockType == "days" ? oneDay : oneHour;
      const min = time - timeXOne / 2;
      const max = time + timeXOne / 2 + 1;
      const d7 = data.find((e) => {
        const xTime = e.x.getTime();
        if (xTime > min && xTime < max) {
          return e;
        }
      });

      showTooltip({
        tooltipData: d7,
        tooltipLeft: xScale(d7!.x),
        tooltipTop: yScale(d7!.y),
      });
    },
    [showTooltip, yScale, xScale]
  );

  return (
    <div ref={ref} style={{ height: "100%", position: "relative" }}>
      {width === 0 || height === 0 ? (
        <></>
      ) : (
        <>
          <svg width="100%" height="100%">
            <rect x={0} y={0} width="100%" height="100%" />

            <GridRows
              numTicks={2}
              left={margin}
              width={width - margin - margin}
              height={height - margin}
              scale={yScale}
              stroke="#262626"
            />

            <AxisBottom
              hideAxisLine
              hideTicks
              scale={xScale}
              top={height - margin + 5}
              tickLabelProps={{ fill: "rgba(255,255,255,.6)" }}
              tickFormat={(tick) => {
                if (ClockType === "hours") {
                  const [hour, min] = (tick as Date)
                    .toLocaleTimeString()
                    .split(":");
                  return `${hour}:${min}`;
                } else {
                  return (tick as Date).toLocaleDateString();
                }
              }}
              numTicks={width < 535 ? 4 : 7}
            />

            <AxisLeft
              hideTicks
              hideAxisLine
              tickLabelProps={{ fill: "rgba(255,255,255,.6)" }}
              tickFormat={(tick) => tick.toString()}
              left={margin}
              scale={yScale}
              numTicks={2}
            />

            <AreaClosed
              data={data}
              x={({ x }) => xScale(x)}
              y={({ y }) => yScale(y)}
              yScale={yScale}
              strokeWidth={2}
              fill="rgba(0, 112, 243, 0.15)"
            />

            <LinePath
              data={data}
              x={({ x }) => xScale(x)}
              y={({ y }) => yScale(y)}
              strokeWidth={2}
              stroke="#0070F3"
            />

            <Bar
              x={margin}
              y={margin}
              width={width - margin}
              height={height - margin}
              fill="transparent"
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />
          </svg>
          {tooltipData && (
            <Tooltip
              tooltipData={tooltipData}
              tooltipLeft={tooltipLeft}
              tooltipTop={tooltipTop}
            />
          )}
        </>
      )}
    </div>
  );
};
//
