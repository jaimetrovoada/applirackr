"use client";
import { LinkFlow } from "@/lib/utils";
import { STAGES } from "@/lib/validators/schemas";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { SankeyChart } from "echarts/charts";
import { SVGRenderer } from "echarts/renderers";
import { EChartsOption } from "echarts";

interface Props {
  data: LinkFlow[] | null;
}
const Graphs = ({ data }: Props) => {
  if (!data) {
    return null;
  }

  echarts.use([SankeyChart, SVGRenderer]);
  const option: EChartsOption = {
    darkMode: true,
    series: {
      type: "sankey",
      emphasis: {
        focus: "adjacency",
      },
      data: STAGES.map((stage) => {
        return {
          name: stage,
        };
      }),
      links: data,
    },
  };
  return <ReactEChartsCore echarts={echarts} option={option} />;
};

export default Graphs;
