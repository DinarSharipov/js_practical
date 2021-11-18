import {capitalize} from './utils';

export class DomListener {
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error('No $root provider for DomListener');
    }
    this.$root = $root;
    this.listeners = listeners;
  }

  initDOMListeners() {
    this.listeners.forEach((listener) => {
      const method = getMethodName(listener);
      if (!this[method]) {
        throw new Error(
            `Метод ${method} еще не проинициализирован в компоненте ${this.name ||
            ''}`
        );
      }
      console.log(this, method);
      this.$root.on(listener, this[method].bind(this));
    });
  }

  removeDOMListener() {}
}

function getMethodName(eventName) {
  return 'on' + capitalize(eventName);
}
