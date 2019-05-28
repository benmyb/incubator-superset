export default function transformProps(chartProps) {
  const { formData, payload } = chartProps;
  const {
    sliceId,
    colorScheme,
    numberFormat,
    pshowMulti,
    dshowMulti,
  } = formData;

  return {
    sliceId,
    data: payload.data,
    colorScheme,
    numberFormat,
    pshowMulti,
    dshowMulti,
  };
}
