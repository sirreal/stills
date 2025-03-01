const getImperfectCircle = require('../utils/get-imperfect-circle');
const sharp = require('../utils/sharp');
const SVG = require('../utils/svg');
const getEyeDetails = require('../utils/get-eye-details');

const getEyes = (face, imperfection) => {
  if (
    !face.annotations.leftEyeIris ||
    !face.annotations.rightEyeIris ||
    !face.annotations.leftEyeIris[0] ||
    !face.annotations.rightEyeIris[0]
  ) {
    return null;
  }

  const bounds1 = getEyeDetails(face.annotations.leftEyeIris);
  const bounds2 = getEyeDetails(face.annotations.rightEyeIris);
  const coordinates = [bounds1, bounds2];
  const size = (bounds1.size + bounds2.size) / 2;

  return coordinates.map(({ x, y }) =>
    getImperfectCircle(x, y, size, size * (1 + imperfection))
  );
};

module.exports = async (
  buffer,
  frame,
  { color = '#fba155', imperfection = 0.3 } = {}
) => {
  const result = await frame.detectHumans();
  const faces = result.face;
  if (faces.length === 0) {
    return buffer;
  }

  const image = await sharp(buffer);
  const { width, height } = await image.metadata();
  const results = faces.reduce(
    (memo, face) => [...memo, ...getEyes(face, imperfection)],
    []
  );

  const svg = SVG().size(width, height).fill({ color });

  for (const result of results) {
    svg.polygon(result);
  }

  const foreground = await sharp(Buffer.from(svg.svg())).toBuffer();

  return await image.composite([{ input: foreground }]).toBuffer();
};
