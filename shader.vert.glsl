#version 300 es
precision highp float;

in vec3 position;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

void main() {
  gl_Position = projection * view * model * vec4(position, 1.0);
  gl_PointSize = 2.0;
}
