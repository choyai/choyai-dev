<script lang="ts">
  import { interactivity } from '@threlte/extras'
  import { T, useTask } from '@threlte/core'
  import { Spring } from 'svelte/motion'
  import CanvasPortal from './CanvasPortal.svelte'

  let rotation = $state(0)
  useTask((delta) => {
    rotation += delta
  })
  const scale = new Spring(1)

  // threlte
  interactivity()
</script>

<CanvasPortal>
  <T.PerspectiveCamera
    makeDefault
    position={[10, 10, 10]}
    oncreate={(ref) => {
      ref.lookAt(0, 1, 0)
    }}
  />
  <T.DirectionalLight position={[0, 10, 10]} castShadow />
  <T.Mesh
    position.y={1}
    rotation.y={rotation}
    scale={scale.current}
    onpointerenter={() => {
      scale.target = 1.5
    }}
    onpointerleave={() => {
      scale.target = 1
    }}
    castShadow
  >
    <T.BoxGeometry args={[1, 2, 1]} />
    <T.MeshStandardMaterial color="hotpink" />
  </T.Mesh>

  <T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
    <T.CircleGeometry args={[4, 40]} />
    <T.MeshStandardMaterial color="white" />
  </T.Mesh>
</CanvasPortal>
