export default {
  /**
   * Method used to capitalize the first letter
   *
   * @param {string} string The string
   * @returns {string} The output string
   */
  ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
};
