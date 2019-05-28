/* eslint-disable no-param-reassign */
/* eslint dot-notation: "off" */
/* eslint object-shorthand: "off" */
/* eslint no-nested-ternary: "off" */
/* eslint max-len: "off" */
/* eslint no-else-return: "off" */
/* eslint no-console: "off" */
import d3 from 'd3';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-dist';
import { getScale } from '../../modules/CategoricalColorNamespace';
import './PlotlyMultiLine.css';

const propTypes = {
  data: PropTypes.shape({
    metrics: PropTypes.arrayOf(PropTypes.string),
    metrics_2: PropTypes.arrayOf(PropTypes.string),
    groupby_order: PropTypes.arrayOf(PropTypes.string),
    raw_data: PropTypes.object,
  }),
  sliceId: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  rowNumber: PropTypes.number,
  colorScheme: PropTypes.string,
  numberFormat: PropTypes.string,
  yAxis2Format: PropTypes.string,
  dateTimeFormat: PropTypes.string,
  showEnlarge: PropTypes.bool,
};

function formatLayout(colorArray, rowNumber, numberFormat, yAxis2Format, dateTimeFormat, metrics, metrics2, groupbyOrder, rawData) {
  const layout = {
    colorway: colorArray,
    grid: {
      rows: Math.ceil(groupbyOrder.length / rowNumber),
      columns: rowNumber,
      pattern: 'independent',
    },
    legend: {
      x: 1.1,
      xanchor: 'left',
    },
    // annotations: [],
  };
  const traces = [];
  let subplotCount = 0;
  let yaxis2Count = groupbyOrder.length + 1;
  groupbyOrder.forEach((groupbyValue) => {
    // layout['annotations'].push({
    //   xref: 'subplot',
    //   subplot: [subplotCount],
    //   x: 0.5,
    //   xanchor: 'middle',
    //   text: groupbyValue,
    // });
    const xaxisName = (subplotCount === 0) ? 'xaxis' : 'xaxis' + (subplotCount + 1).toString();
    const yaxisName = (subplotCount === 0) ? 'yaxis' : 'yaxis' + (subplotCount + 1).toString();
    const xaxis = (subplotCount === 0) ? 'x1' : 'x' + (subplotCount + 1).toString();
    const yaxis = (subplotCount === 0) ? 'y1' : 'y' + (subplotCount + 1).toString();
    const yaxis2Name = 'yaxis' + yaxis2Count.toString();
    const yaxis2 = 'y' + yaxis2Count.toString();
    layout[xaxisName] = {
      type: 'date',
      autorange: true,
    };
    layout[yaxisName] = {
      tickformat: numberFormat,
      autorange: true,
    };
    if (dateTimeFormat !== 'smart_date') {
      layout[xaxisName]['tickformat'] = dateTimeFormat;
    }
    const groupbyData = rawData[groupbyValue];
    metrics.forEach((metric) => {
      const metricData = groupbyData[metric];
      let isOnRight = false;
      for (let i = 0; i < metrics2.length; ++i) {
        if (metric.includes(metrics2[i])) {
          layout[yaxis2Name] = {
            anchor: xaxis,
            overlaying: yaxis,
            side: 'right',
            tickformat: yAxis2Format,
            autorange: true,
          };
          isOnRight = true;
          break;
        }
      }
      traces.push({
        name: groupbyValue + '-' + metric,
        // legendgroup: metric,
        type: 'scatter',
        x: metricData[0],
        y: metricData[1],
        xaxis: xaxis,
        yaxis: isOnRight ? yaxis2 : yaxis,
      });
    });
    ++subplotCount;
    ++yaxis2Count;
  });
  return {
    traces: traces,
    layout: layout,
  };
}

function PlotlyMultiLine(element, props) {
  const {
    data,
    sliceId,
    width,
    // height,
    rowNumber,
    colorScheme,
    numberFormat,
    yAxis2Format,
    dateTimeFormat,
    // showEnlarge,
  } = props;

  const groupbyOrder = data['groupby_order'];

  const div = d3.select(element);
  const Id = 'plotly_slice_' + sliceId;
  const needHeight = (Math.ceil(width / rowNumber) / 1.1) * Math.ceil(groupbyOrder.length / rowNumber);
  const html = '<div  id=' + Id + ' style="width:' + width + 'px;height:' + needHeight + 'px;"></div>';
  div.html(html);

  const metrics = data['metrics'];
  const metrics2 = data['metrics_2'];
  const rawData = data['raw_data'];

  const allData = formatLayout(getScale(colorScheme).colors, rowNumber, numberFormat, yAxis2Format, dateTimeFormat, metrics, metrics2, groupbyOrder, rawData);
  Plotly.newPlot(Id, allData['traces'], allData['layout']);
}

PlotlyMultiLine.displayName = 'PlotlyMultiLine';
PlotlyMultiLine.propTypes = propTypes;

export default PlotlyMultiLine;
