import * as THREE from 'three'

export function createVideoTexture(src, { muted = true, loop = true, rotation = Math.PI / 2 } = {}) {
  const video = document.createElement('video')
  video.src = src
  video.crossOrigin = 'Anonymous'
  video.loop = loop
  video.muted = muted
  video.playsInline = true
  video.autoplay = true
  video.play()

  const texture = new THREE.VideoTexture(video)
  texture.encoding = THREE.sRGBEncoding
  texture.flipY = true
  texture.center.set(0.5, 0.5)
  texture.rotation = rotation

  return { video, texture }
}
