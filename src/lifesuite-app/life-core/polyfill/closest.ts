// Adds polyfill for browsers not implementing Element.closest(), such as IE.
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
    Element.prototype.matches = (Element.prototype as any).msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
    Element.prototype.closest = function(selector: string): Element | null {
        let el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(selector)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}
