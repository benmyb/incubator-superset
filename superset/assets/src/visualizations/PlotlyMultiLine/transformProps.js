export default function transformProps(chartProps) {
  const { width, height, formData, payload } = chartProps;
  const {
    sliceId,
    colorScheme,
    numberFormat,
    yAxis2Format,
    dateTimeFormat,
    showEnlarge,
    rowNumber,
  } = formData;

  return {
    width,
    height,
    sliceId,
    data: payload.data,
    colorScheme,
    numberFormat,
    yAxis2Format,
    dateTimeFormat,
    rowNumber,
    showEnlarge,
  };
}
