function hasClass(element, className) {
  return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
}

function createElem(element, attribute, attributeValue) {
  let newElement = document.createElement(element);
  newElement.setAttribute(attribute, attributeValue);
  return newElement;
}
