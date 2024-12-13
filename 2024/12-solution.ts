import { log } from "console";
import { processLines } from "./utilities.js";

type Plot = {
  coords: [number, number];
  plant: string;
  fenced: boolean;
  region?: Region;
};

type Region = {
  plant: string;
  plots: Plot[];
  perimeter: number;
  sides: number;
};

const grid: Plot[][] = (await processLines("12-input.txt")).map((line, i) =>
  line.split("").map((plot, j) => {
    return { coords: [i, j], plant: plot, fenced: false };
  })
);

function checkRegionPlotNeighbor(
  region: Region,
  plotProcessingStack: Plot[],
  x: number,
  y: number
) {
  const comparePlot = grid[x]?.[y];
  if (comparePlot?.plant === region.plant) {
    plotProcessingStack.push(comparePlot);
  } else {
    region.perimeter++;
  }
}

const regions: Region[] = [];
function pt1() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const plot = grid[i][j];
      if (plot.fenced) continue;

      const region: Region = { plant: plot.plant, plots: [], perimeter: 0, sides: 0 };
      regions.push(region);

      const stack = [plot];
      let regionPlot;
      while ((regionPlot = stack.pop())) {
        if (regionPlot.fenced) continue;
        regionPlot.fenced = true;
        regionPlot.region = region;
        region.plots.push(regionPlot);
        const [x, y] = regionPlot.coords;
        checkRegionPlotNeighbor(region, stack, x - 1, y);
        checkRegionPlotNeighbor(region, stack, x + 1, y);
        checkRegionPlotNeighbor(region, stack, x, y - 1);
        checkRegionPlotNeighbor(region, stack, x, y + 1);
      }
    }
  }

  const perimeterPriceSum = regions.reduce(
    (acc, region) => acc + region.perimeter * region.plots.length,
    0
  );
  log("perimeter-based price sum:", perimeterPriceSum);
}
pt1();

// We check against neighbor plot region equality (not plant equality) because a neighboring region
// with the same plant could touch this region diagonally.
function checkRegionPlotIsCorner(
  regionPlot: Plot,
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  [x3, y3]: [number, number]
) {
  const comparePlot1 = grid[x1]?.[y1];
  const comparePlot2 = grid[x2]?.[y2];
  const comparePlot3 = grid[x3]?.[y3];

  // A corner can occur in two ways:
  // 1. The plots below/above and beside the current plot are not in the same region (clearly a
  //    corner because the region cannot continue in either of those directions)
  // 2. The plots below/above and beside the current plot are in the same region, but the plot
  //    diagonally between them is not (this is an "inward" corner, where two arms of this region meet)
  if (
    (regionPlot.region !== comparePlot1?.region && regionPlot.region !== comparePlot3?.region) ||
    (regionPlot.region === comparePlot1?.region &&
      regionPlot.region === comparePlot3?.region &&
      regionPlot.region !== comparePlot2?.region)
  ) {
    // we have found a corner and # of corners = # of sides
    regionPlot.region!.sides++;
  }
}

function pt2() {
  for (const region of regions) {
    for (const plot of region.plots) {
      const [x, y] = plot.coords;
      checkRegionPlotIsCorner(plot, [x - 1, y], [x - 1, y - 1], [x, y - 1]);
      checkRegionPlotIsCorner(plot, [x - 1, y], [x - 1, y + 1], [x, y + 1]);
      checkRegionPlotIsCorner(plot, [x + 1, y], [x + 1, y - 1], [x, y - 1]);
      checkRegionPlotIsCorner(plot, [x + 1, y], [x + 1, y + 1], [x, y + 1]);
    }
  }

  log("regions:", regions);
  const sidesPriceSum = regions.reduce(
    (acc, region) => acc + region.sides * region.plots.length,
    0
  );
  log("side-based price sum:", sidesPriceSum);
}
pt2();
