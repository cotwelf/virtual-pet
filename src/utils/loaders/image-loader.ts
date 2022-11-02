import { IImageAsset } from "~/../public/images"

export const loadSpritesheet = ({
  scene,
  imageObj
}: {
  scene: any
  imageObj: IImageAsset
}) => {
  return scene.load.spritesheet(
    imageObj.key,
    imageObj.path, // WORKAROUND
    { frameWidth: imageObj.width / imageObj.frame, frameHeight: imageObj.height }
  )
}

export const playAnims = ({
  scene,
  imageObj
}: {
  scene: any
  imageObj: IImageAsset
}) => {
  console.log(imageObj, 'obj')
  scene.anims.create({
    key: `${imageObj.key}-alive`,
    frames: scene.anims.generateFrameNames(imageObj.key, { start: 0, end: imageObj.frame - 1 }),
    frameRate: imageObj.frame,
    repeat: -1,
  })
  return scene.add.sprite(
    scene.scale.width * 0.5,
    scene.scale.height * 0.5,
    imageObj.key
  ).play(`${imageObj.key}-alive`, true)
}
