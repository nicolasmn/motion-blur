const Helpers = {
  /**
   * Generate unique IDs for use as pseudo-private/protected names
   * @see    https://gist.github.com/gordonbrander/2230317
   * @return {string}  Unique ID
   */
  uniqueId: () => {
    return '_' + Math.random().toString(36).substr(2, 9)
  },

  /**
   * Helper method for creating SVG elements
   * @param  {string}      tagName  Name of the tag
   * @return {HTMLElement}          Created element
   */
  createElementSVG: (tagName) => {
    const xmlns = 'http://www.w3.org/2000/svg'
    return document.createElementNS(xmlns, tagName)
  },
}

export default Helpers
