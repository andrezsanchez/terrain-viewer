#version 300 es
precision highp float;

out vec4 color;

void main() {
  vec2 position = gl_PointCoord - vec2(0.5, 0.5);
  //float distance2 = dot(position, position);
  //if (distance2 > 0.25) {
    //discard;
  //}
  color = vec4(1.);
}
