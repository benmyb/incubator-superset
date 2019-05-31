import { t } from '@superset-ui/translation';
import { ChartMetadata, ChartPlugin } from '@superset-ui/chart';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';

const metadata = new ChartMetadata({
  name: t('Plotly MultiLine'),
  description: '',
  thumbnail,
  useLegacyApi: true,
});

export default class PlotlyMultiLineChartPlugin extends ChartPlugin {
  constructor() {
    super({
      metadata,
      transformProps,
      loadChart: () => import('./ReactPlotlyMultiLine'),
    });
  }
}
