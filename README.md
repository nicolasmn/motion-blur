# 🏇🏻💨 MotionBlur 

Using the `feGaussianBlur` SVG filter we can create a motion blur effect on any element. This works by referencing the SVG filter with CSS through `filter: url(#<filter-id>)` and changing the values of the SVG filter according to the movement of the element.

This is really just a proof of concept and by no means intended for production usage. Works best in Chrome for now.

_Example usage:_
```js
import MotionBlur from 'motion-blur'

const elem = document.querySelector('.moving-element')
const opts = {
  selfUpdate: true,
  multiplier: 1/6
}

new MotionBlur(elem, opts)
```