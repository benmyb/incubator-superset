/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { t } from '@superset-ui/translation';
import { NVD3TimeSeries } from './sections';

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['percent_metrics'],
        ['groupby'],
        ['subchart_limit', 'row_limit'],
        ['markers'],
        ['row_number'],
        ['groupby_orderdesc'],
        ['adhoc_filters'],
      ],
    },
    {
      label: t('Chart Options'),
      controlSetRows: [
        ['color_scheme'],
        ['number_format', 'y_axis_2_format'],
        ['date_time_format'],
      ],
    },
    NVD3TimeSeries[1],
  ],
  controlOverrides: {
    metrics: {
      description: t('Metrics in left yaxis in every sub chart.'),
    },
    percent_metrics: {
      label: t('Metrics right yaxis'),
      description: t('Metrics in right yaxis in every sub chart.'),
    },
    markers: {
      label: t('Order of groupby'),
      description: t('Manually specify the order of groupby value, accepted format: ["A", "B", "C"]. ' +
        'Use a-z,0-9 if blank.'),
    },
  },
};
