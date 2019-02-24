export const getMetersBetweenPoints = (point1, point2) => {
  const earthRadius = 6371
  const [dLat, dLng] = [
      degToRadians(point2.latitude - point1.latitude),
      degToRadians(point2.longitude - point1.longitude)
  ]
  const a = 
      Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
      Math.cos(degToRadians(point1.latitude)) * Math.cos(degToRadians(point2.latitude)) * 
      Math.sin( dLng / 2 ) * Math.sin( dLng / 2 );
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt( 1 - a )); 
  return Math.abs(( earthRadius * c ) * 350);
}

export const degToRadians = deg => deg * ( Math.PI / 180 )