export default function transformProps(chartProps) {
  const { formData, payload } = chartProps;
  const {
    sliceId,
    colorScheme,
  } = formData;

  return {
    sliceId,
    data: payload.data,
    colorScheme,
  };
}
