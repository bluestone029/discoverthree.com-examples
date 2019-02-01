function initPoints( scene ) {

  const textureLoader = new THREE.TextureLoader();

  const geometry = new THREE.SphereBufferGeometry( 2, 32, 8 );

  const map = textureLoader.load( 'textures/leaf.png' );
  map.encoding = THREE.sRGBEncoding;

  const material = new THREE.PointsMaterial( {
    color: 0xffffff,
    map,

    // standard transparency doesn't work well,
    // since the particles are all pieces of the same geometry
    // this leads to transparent portions of particles cutting out
    // pieces of the particles behind them

    // transparent: true,

    // fortunately we can use alpha testing instead, which
    // gives much better results here since the transparent
    // portions of the texture are well defined

    alphaTest: 0.5,

    size: 1,
    sizeAttenuation: true,
  } );


  // no need to do this for black or white materials,
  // but let's keep the habit up anyway :)
  material.color.convertSRGBToLinear();

  const points = new THREE.Points( geometry, material );

  const positions = points.geometry.attributes.position.array;

  const originalPositions = positions.slice();

  let elapsedTime = 0;

  points.userData.onUpdate = ( delta ) => {

    elapsedTime += delta;

    points.rotation.y -= delta / 3;

    for ( let i = 0; i < positions.length; i += 3 ) {

      positions[ i ] = originalPositions[ i ] + ( Math.sin( ( elapsedTime * i / 100 ) * 0.3 ) * 5 )
      positions[ i + 2 ] = originalPositions[ i + 2 ]  + ( Math.sin( ( elapsedTime * i / 100 ) * 0.3 ) * 5 )

    }

    points.geometry.attributes.position.needsUpdate = true;

  };

  scene.add( points );

  return points;

}
