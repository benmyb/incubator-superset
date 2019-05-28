/* eslint-disable no-param-reassign */
/* eslint dot-notation: "off" */
/* eslint object-shorthand: "off" */
/* eslint no-nested-ternary: "off" */
/* eslint max-len: "off" */
/* eslint no-else-return: "off" */
/* eslint no-console: "off" */
/* eslint prefer-rest-params: "off" */
/* eslint no-undef: "off" */
/* eslint no-unused-expressions: "off" */
/* eslint one-var: "off" */
/* eslint no-var: "off" */
import dt from 'datatables.net-bs';
import $ from 'jquery';
import d3 from 'd3';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { getScale } from '../../modules/CategoricalColorNamespace';

dt(window, $);

const propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    names: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.any),
    ),
    raw_data: PropTypes.object,
  }),
  sliceId: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  colorScheme: PropTypes.string,
};

function formatSeries(data, isPercentView) {
  const series = [];
  const rawData = data['raw_data'];
  const names = data['names'];
  names.forEach((name) => {
    const serie = rawData[name];
    series.push({
      name: name,
      type: 'area',
      stacking: (isPercentView) ? 'percent' : 'normal',
      data: serie,
    });
  });
  return series;
}

function HighChartsStack(element, props) {
  const {
    data,
    sliceId,
    width,
    height,
    colorScheme,
  } = props;

  Exporting(Highcharts);

  const div = d3.select(element);
  const Id = 'hightcharts_slice_' + sliceId;
  const html = '<div id=' + Id + ' style="width:' + width + 'px;height:' + height + 'px;"></div>';
  div.html(html);

  let isPercentView = true;
  let isSingleTooltip = false;
  const series = formatSeries(data, isPercentView);

  (function (H) {
    H.wrap(H.Legend.prototype, 'render', function (proceed) {
      var legend = this,
        chart = legend.chart,
        animation = H.pick(legend.options.navigation.animation, true);

      proceed.apply(this, Array.prototype.slice.call(arguments, 1));

      $(legend.group.element)
        .on('wheel', function (event) {
          const e = chart.pointer.normalize(event);
          e.originalEvent.deltaY < 0 ? legend.scroll(-1, animation) : legend.scroll(1, animation);
        });
    });
  }(Highcharts));

  const chart = Highcharts.chart(Id, {
    colors: getScale(colorScheme).colors,
    chart: {
      type: 'area',
    },
    title: {
      text: data['title'],
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      layout: 'vertical',
      y: 30,
    },
    xAxis: {
      type: 'datetime',
      crosshair: true,
      title: {
        enabled: false,
      },
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%b. %e',
        week: '%b. %e',
        month: '%y/%m',
        year: '%Y',
      },
    },
    yAxis: {
      crosshair: true,
      title: {
        text: '',
      },
      labels: {
        format: isPercentView ? '{value}%' : '{value}',
      },
    },
    tooltip: {
      xDateFormat: '%Y-%m-%d %H:%M:%S',
      shared: true,
      pointFormat: isPercentView ? '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.percentage:.2f}%</b><br/>' : '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.f}</b><br/>',
    },
    exporting: {
      buttons: {
        percentButton: {
          text: 'percent view',
          theme: {
            fill: isPercentView ? '#00FA9A' : '#FFFFFF',
          },
          onclick: function () {
            isPercentView = !isPercentView;
            chart.series.forEach((s) => {
              s.update({
                stacking: isPercentView ? 'percent' : 'normal',
              });
            });
            chart.update({
              exporting: {
                buttons: {
                  percentButton: {
                    theme: {
                      fill: isPercentView ? '#00FA9A' : '#FFFFFF',
                    },
                  },
                },
              },
              yAxis: {
                labels: {
                  format: isPercentView ? '{value}%' : '{value}',
                },
              },
              tooltip: {
                pointFormat: isPercentView ? '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.percentage:.2f}%</b><br/>' : '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.f}</b><br/>',
              },
            });
          },
        },
        tooltipButton: {
          text: 'single tooltip',
          theme: {
            fill: isSingleTooltip ? '#00FA9A' : '#FFFFFF',
          },
          onclick: function () {
            isSingleTooltip = !isSingleTooltip;
            chart.update({
              exporting: {
                buttons: {
                  tooltipButton: {
                    theme: {
                      fill: isSingleTooltip ? '#00FA9A' : '#FFFFFF',
                    },
                  },
                },
              },
              tooltip: {
                shared: !isSingleTooltip,
              },
            });
          },
        },
      },
    },
    series: series,
  });

}

HighChartsStack.displayName = 'HighChartsStack';
HighChartsStack.propTypes = propTypes;

export default HighChartsStack;
