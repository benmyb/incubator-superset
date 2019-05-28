export default function transformProps(chartProps) {
  const { formData, payload } = chartProps;
  const {
    sliceId,
    colorScheme,
    numberFormat,
    yAxis2Format,
    showEnlarge,
    rowNumber,
  } = formData;

  return {
    sliceId,
    data: payload.data,
    colorScheme,
    numberFormat,
    yAxis2Format,
    rowNumber,
    showEnlarge,
  };
}
