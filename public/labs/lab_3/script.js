function mbWildRide () {
  const rides = [1, 2, 3, 4, 5, 6, 7];
  let rideIndex = 1;
  let ride = rides[0];
  for(let i=1, i<=7, i++) {
    rideIndex = i;
    alert(ride[rideIndex]);
  }
}

onPageLoad = mbWildRide;