class Provider {
  constructor() {
    this.app = null;
  }

  setApp(app) {
    this.app = app;
    return this;
  }

  register() {
    // To be implemented by subclasses
  }

  boot() {
    // To be implemented by subclasses
  }
}

export default Provider;
