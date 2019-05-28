export default function transformProps(chartProps) {
  const { formData, payload } = chartProps;
  const {
    sliceId,
    colorScheme,
    pshowPercent,
    pshowMulti,
    pshowThumbnail,
    dshowPercent,
    dshowMulti,
    dshowThumbnail,
  } = formData;

  return {
    sliceId,
    data: payload.data,
    colorScheme,
    pshowPercent,
    pshowMulti,
    pshowThumbnail,
    dshowPercent,
    dshowMulti,
    dshowThumbnail,
  };
}
