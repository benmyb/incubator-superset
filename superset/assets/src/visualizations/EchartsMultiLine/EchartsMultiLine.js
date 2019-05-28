/* eslint-disable no-param-reassign */
/* eslint dot-notation: "off" */
/* eslint object-shorthand: "off" */
/* eslint no-nested-ternary: "off" */
/* eslint max-len: "off" */
/* eslint no-else-return: "off" */
/* eslint no-console: "off" */
import d3 from 'd3';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { getScale } from '../../modules/CategoricalColorNamespace';
import { d3format } from '../../modules/utils';
import './EchartsMultiLine.css';

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
  showEnlarge: PropTypes.bool,
};

function formatSeries(colorArray, rowNumber, numberFormat, yAxis2Format, metrics, metrics2, groupbyOrder, rawData) {
  const grids = [];
  const xAxes = [];
  const yAxes = [];
  const series = [];
  const titles = [];
  const dataZooms = [];
  let count = 0;
  let yaxisCount = 0;
  let seriesCount = 0;
  const seriseMap = [];
  const selectMap = [];
  groupbyOrder.forEach((groupbyValue) => {
    const groupbyData = rawData[groupbyValue];
    grids.push({
      show: true,
      borderWidth: 0,
      backgroundColor: '#fff',
      shadowColor: selectMap[count] ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
      shadowBlur: selectMap[count] ? 10 : 2,
      containLabel: true,
    });
    xAxes.push({
      type: 'time',
      show: true,
      gridIndex: count,
    });
    yAxes.push({
      type: 'value',
      show: true,
      gridIndex: count,
      axisLabel: {
        formatter: function (value) {
          const format = numberFormat || '.3s';
          return d3format(format, value);
        },
      },
    });
    yAxes.push({
      type: 'value',
      show: true,
      gridIndex: count,
      axisLabel: {
        formatter: function (value) {
          const format = yAxis2Format || '.3s';
          return d3format(format, value);
        },
      },
    });
    seriseMap.push([]);
    metrics.forEach((metric, idx) => {
      const metricData = groupbyData[metric];
      let yaxis = yaxisCount;
      for (let i = 0; i < metrics2.length; ++i) {
        if (metric.includes(metrics2[i])) {
          yaxis = yaxisCount + 1;
          break;
        }
      }
      series.push({
        name: metric,
        type: 'line',
        xAxisIndex: count,
        yAxisIndex: yaxis,
        data: metricData,
        showSymbol: false,
        animationEasing: name,
        animationDuration: 1000,
        itemStyle: {
          color: colorArray[idx],
        },
      });
      seriseMap[count].push(seriesCount++);
    });
    titles.push({
      textAlign: 'center',
      text: groupbyValue,
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
      },
      triggerEvent: true,
    });
    dataZooms.push({
      type: 'inside',
      xAxisIndex: [count],
      filterMode: 'filter',
      start: 0,
      end: 100,
    });
    count++;
    yaxisCount += 2;
  });
  // const rowNumber = Math.ceil(Math.sqrt(count));
  grids.forEach((grid, idx) => {
    grid.left = ((idx % rowNumber) / rowNumber * 100) + '%';
    grid.top = (Math.floor(idx / rowNumber) / rowNumber * 100 + 4) + '%';
    grid.width = (1 / rowNumber * 100 - 4) + '%';
    grid.height = (1 / rowNumber * 100 - 4) + '%';

    titles[idx].left = parseFloat(grid.left) + parseFloat(grid.width) / 2 + '%';
    titles[idx].top = parseFloat(grid.top) + '%';
  });
  return {
    count: count,
    grids: grids,
    xAxes: xAxes,
    yAxes: yAxes,
    series: series,
    titles: titles,
    dataZooms: dataZooms,
    seriseMap: seriseMap,
    selectMap: selectMap,
  };
}

function EchartsMultiLine(element, props) {
  const {
    data,
    sliceId,
    width,
    height,
    rowNumber,
    colorScheme,
    numberFormat,
    yAxis2Format,
    showEnlarge,
  } = props;

  const div = d3.select(element);
  const Id = 'echarts_slice_' + sliceId;
  const html = '<div id=' + Id + ' style="width:' + width + 'px;height:' + height + 'px;"></div>';
  // const html = '<div id=' + Id + ' style="width:' + width + 'px;height:5000"></div>';
  div.html(html);

  const myChart = echarts.init(document.getElementById(Id));

  let selectIndex = -1;
  let selectGrid = {};
  let showOneChart = false;

  const metrics = data['metrics'];
  const metrics2 = data['metrics_2'];
  const groupbyOrder = data['groupby_order'];
  const rawData = data['raw_data'];

  const allData = formatSeries(getScale(colorScheme).colors, rowNumber, numberFormat, yAxis2Format, metrics, metrics2, groupbyOrder, rawData);

  myChart.getDom().childNodes[0].style['overflow-y'] = 'scroll';

  const option = {
    color: getScale(colorScheme).colors,
    title: allData.titles,
    legend: {
      data: metrics,
    },
    grid: allData.grids,
    xAxis: allData.xAxes,
    yAxis: allData.yAxes,
    series: allData.series,
    tooltip: {
      trigger: 'axis',
      // axisPointer: {
      //   type: 'cross',
      // },
      confine: true,
    },
    toolbox: {
      show: true,
      itemSize: 20,
      right: '1%',
      feature: {
        myTool1: {
          title: 'enlarge',
          show: showEnlarge,
          icon: 'path://M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM14 6h-4v4h-4v4h4v4h4v-4h4v-4h-4z',
          onclick: function () {
            if (selectIndex !== -1) {
              showOneChart = !showOneChart;
              myChart.setOption({
                toolbox: {
                  feature: {
                    myTool1: {
                      iconStyle: {
                        color: (showOneChart) ? '#7CFC00' : '#cdcdcd',
                      },
                    },
                  },
                },
              });
              if (showOneChart) {
                const oneSeries = [];
                for (let i = 0; i < allData.seriseMap[selectIndex].length; ++i) {
                  const s = allData.series[allData.seriseMap[selectIndex][i]];
                  let yaxis = 0;
                  for (let j = 0; j < metrics2.length; ++j) {
                    const metric = s.name;
                    if (metric.includes(metrics2[j])) {
                      yaxis = 1;
                      break;
                    }
                  }
                  const se = {
                    name: s.name,
                    type: s.type,
                    xAxisIndex: 0,
                    yAxisIndex: yaxis,
                    data: s.data,
                    showSymbol: false,
                    animationEasing: name,
                    animationDuration: 1000,
                    itemStyle: s.itemStyle,
                  };
                  oneSeries.push(se);
                }
                const seriesOption = {
                  title: {
                    text: allData.titles[selectIndex].text,
                    top: 'bottom',
                    left: 'center',
                  },
                  legend: {
                    data: metrics,
                  },
                  grid: {
                    show: true,
                    borderWidth: 0,
                    backgroundColor: '#fff',
                    shadowColor: 'rgba(0, 0, 0, 1)',
                    shadowBlur: 10,
                    left: '4%',
                    top: '4%',
                    width: '95%',
                    height: '90%',
                    containLabel: true,
                  },
                  xAxis: {
                    type: 'time',
                    show: true,
                    gridIndex: 0,
                  },
                  yAxis: [
                    {
                      type: 'value',
                      show: true,
                      gridIndex: 0,
                      axisLabel: {
                        formatter: function (value) {
                          const format = numberFormat || '.3s';
                          return d3format(format, value);
                        },
                      },
                    },
                    {
                      type: 'value',
                      show: true,
                      gridIndex: 0,
                      axisLabel: {
                        formatter: function (value) {
                          const format = yAxis2Format || '.3s';
                          return d3format(format, value);
                        },
                      },
                    },
                  ],
                  series: oneSeries,
                  tooltip: {
                    trigger: 'axis',
                    // axisPointer: {
                    //   type: 'cross',
                    // },
                    confine: true,
                  },
                  dataZoom: {
                    type: 'inside',
                    xAxisIndex: [0],
                    filterMode: 'filter',
                    start: 0,
                    end: 100,
                  },
                  toolbox: myChart.getOption().toolbox,
                };
                myChart.clear();
                myChart.setOption(seriesOption);
              } else {
                // const rowNumber = Math.ceil(Math.sqrt(count));
                allData.grids.forEach((grid, idx) => {
                  grid.left = ((idx % rowNumber) / rowNumber * 100) + '%';
                  grid.top = (Math.floor(idx / rowNumber) / rowNumber * 100 + 4) + '%';
                  grid.width = (1 / rowNumber * 100 - 4) + '%';
                  grid.height = (1 / rowNumber * 100 - 4) + '%';

                  allData.titles[idx].left = parseFloat(grid.left) + parseFloat(grid.width) / 2 + '%';
                  allData.titles[idx].top = parseFloat(grid.top) + '%';
                });
                const seriesOption = {
                  title: allData.titles,
                  legend: {
                    data: metrics,
                  },
                  grid: allData.grids,
                  xAxis: allData.xAxes,
                  yAxis: allData.yAxes,
                  series: allData.series,
                  tooltip: {
                    trigger: 'axis',
                    // axisPointer: {
                    //   type: 'cross',
                    // },
                    confine: true,
                  },
                  dataZoom: allData.dataZooms,
                  toolbox: myChart.getOption().toolbox,
                };
                myChart.clear();
                myChart.setOption(seriesOption);
              }
            }
          },
        },
      },
    },
    dataZoom: allData.dataZooms,
  };

  myChart.setOption(option);
  const newHeight = (allData.count / rowNumber) * ((width / rowNumber) * 0.7) + height * 0.4;
  myChart.getDom().childNodes[0].childNodes[0].style.height = newHeight + 'px';
  myChart.getDom().childNodes[0].childNodes[0].setAttribute('height', newHeight);

  myChart.on('click', 'title', function (params) {
    const mouseIndex = params['componentIndex'];
    if (selectIndex !== -1) {
      allData.selectMap[selectIndex] = false;
      allData.grids[selectIndex] = selectGrid;
    }
    if (mouseIndex !== selectIndex) {
      allData.selectMap[mouseIndex] = !allData.selectMap[mouseIndex];
      selectIndex = mouseIndex;
      selectGrid = allData.grids[mouseIndex];
      allData.grids[mouseIndex] = {
        show: true,
        borderWidth: 0,
        backgroundColor: '#fff',
        shadowColor: allData.selectMap[mouseIndex] ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
        shadowBlur: allData.selectMap[mouseIndex] ? 12 : 2,
      };
    } else {
      selectIndex = -1;
    }
    myChart.setOption({
      grid: allData.grids,
    });
  });
}

EchartsMultiLine.displayName = 'EchartsMultiLine';
EchartsMultiLine.propTypes = propTypes;

export default EchartsMultiLine;
