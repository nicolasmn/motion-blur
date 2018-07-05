import Helpers from './helpers'

/**
 * Create a motion blur effect on any given element using SVG filter magic.
 *
 * NOTE: Works best in Chrome for now. Other browsers may work too,
 *        but have serious performance problems.
 *
 * @param {HTMLElement} element   The element to apply the motion blur to
 * @param {Object}      settings  Custom settings for the motion blur instance
 */
class MotionBlur {

  constructor(element, settings) {
    MotionBlur.createSVG()

    this.element = element
    this.settings = Object.assign({}, MotionBlur.defaults, settings)

    this.init()
  }

  /**
   * Creates the SVG filter element used for the motion blur
   * @return {void}
   */
  _createFilter() {
    const filter = Helpers.createElementSVG('filter')
    const blur = Helpers.createElementSVG('feGaussianBlur')

    blur.setAttribute('in', 'SourceGraphic')

    filter.setAttribute('id', this._filterId)
    filter.appendChild(blur)

    // Reference to the SVG filter element
    this._filterElement = MotionBlur._svgElement.appendChild(filter)

    return this._filterElement
  }

  _setFilterStyle() {
    this.element.style.filter = `url('#${this._filterId}')`
  }

  _unsetFilterStyle() {
    this.element.style.filter = ''
  }

  _getPosition() {
    const  { x, y } = this.element.getBoundingClientRect()
    return { x, y }
  }

  _getDiff() {
    const pos = this._getPosition()
    let x = 0, y = 0

    if (pos.x !== this._lastPos.x || pos.y !== this._lastPos.y) {
      x = Math.abs(pos.x - this._lastPos.x) * this.settings.multiplier
      y = Math.abs(pos.y - this._lastPos.y) * this.settings.multiplier
    }

    this._lastPos = pos

    return { x, y }
  }

  _setBlur(x = 0, y = 0) {
    const defs = this._filterElement.children[0]
    defs.setAttribute('stdDeviation', x + ',' + y)
  }

  init() {
    this._lastPos = this._getPosition()
    this._filterId = Helpers.uniqueId()
    this._filterElement = undefined
    this._frameId = undefined

    this._createFilter()

    if (this.settings.selfUpdate) {
      this.update()
    }
  }

  update() {
    const { x, y } = this._getDiff()

    if (x > 0 || y > 0) {
      this._setFilterStyle()
      this._setBlur(x, y)
    } else {
      this._unsetFilterStyle()
    }

    if (this.settings.selfUpdate) {
      this._frameId = requestAnimationFrame(() => this.update())
    }
  }

  destroy() {
    cancelAnimationFrame(this._frameId)
    this._unsetFilterStyle()
    MotionBlur._svgElement.removeChild(this._filterElement)
  }
}

MotionBlur.defaults = {
  selfUpdate: true,
  multiplier: 1/6
}

/**
 * Creates an SVG element that holds the filter definitions
 * @return {void}
 */
MotionBlur.createSVG = () => {
  if (MotionBlur._svgElement)
    return

  const svg = Helpers.createElementSVG('svg')

  svg.style.position = 'absolute'
  svg.style.width = 0
  svg.style.height = 0

  // Reference to the SVG element holding the generated filters
  MotionBlur._svgElement = document.body.appendChild(svg)
}

export default MotionBlur
