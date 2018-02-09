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
    this.element = element
    this.settings = Object.assign({}, MotionBlur.defaults, settings)
    
    this.init()
    this.update()
  }
  
  init() {
    this.lastPos = this.element.getBoundingClientRect()
    this.filterId = this.getUniqueId()
    this.svg = this.createSVGFilter()
    
    this.element.style.filter = `url('#${this.filterId}')`
  }
  
  /**
   * Generate unique IDs for use as pseudo-private/protected names
   * @see    https://gist.github.com/gordonbrander/2230317
   * @return {string}  Unique ID
   */
  getUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Helper method for creating SVG elements
   * @param  {string}      tagName  Name of the tag
   * @return {HTMLElement}          Created element
   */
  createSVGElement(tagName) {
    const xmlns = 'http://www.w3.org/2000/svg'
    return document.createElementNS(xmlns, tagName)
  }

  /**
   * Create the SVG filter element used for the motion blur
   * @return {SVGSVGElement}  Created SVG element
   */
  createSVGFilter() {
    const svg = this.createSVGElement('svg')
    const defs = this.createSVGElement('defs')
    const filter = this.createSVGElement('filter')
    const blur = this.createSVGElement('feGaussianBlur')
    
    blur.setAttribute('in', 'SourceGraphic')
    filter.setAttribute('id', this.filterId)

    // svg.style.display = 'none'
    
    filter.appendChild(blur)
    defs.appendChild(filter)
    svg.appendChild(defs)

    // Append SVG to body and return it
    return document.body.appendChild(svg)
  }
  
  getSVGFilter() {
    return this.svg.getElementsByTagName('feGaussianBlur')[0]
  }
  
  setBlur(x, y) {
    this.getSVGFilter().setAttribute('stdDeviation', x + ',' + y)
  }
  
  update() {
    const position = this.element.getBoundingClientRect()
    
    if ( position.left !== this.lastPos.left || position.top !== this.lastPos.top ) {
      const xDiff = Math.round(Math.abs(position.left - this.lastPos.left) * this.settings.multiplier)
      const yDiff = Math.round(Math.abs(position.top - this.lastPos.top) * this.settings.multiplier)

      this.setBlur(xDiff, yDiff)

      // store current position for the next frame
      this.lastPos = position
    }

    if ( this.settings.selfUpdate ) {
      this.animFrameId = window.requestAnimationFrame(() => this.update())
    }
  }
  
  destroy() {
    this.element.style.filter = ''
    document.body.removeChild(this.svg)
    window.cancelAnimationFrame(this.animFrameId)
  }
}

MotionBlur.defaults = {
  selfUpdate: true,
  multiplier: 1/6
}
