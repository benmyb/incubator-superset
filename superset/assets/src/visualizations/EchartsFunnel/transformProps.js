export default function transformProps(chartProps) {
  const { formData, payload } = chartProps;
  const {
    sliceId,
    colorScheme,
    groupby,
    orderDesc,
  } = formData;

  return {
    sliceId,
    data: payload.data,
    colorScheme,
    groupby,
    orderDesc,
  };
}
