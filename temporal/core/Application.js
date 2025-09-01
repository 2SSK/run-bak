class Application {
  constructor() {
    this.providers = [];
    this.registeredServices = {};
  }

  register(provider) {
    provider.setApp(this);
    this.providers.push(provider);
    return this;
  }

  registerServices() {
    for (const provider of this.providers) {
      provider.register();
    }
    return this;
  }

  boot() {
    for (const provider of this.providers) {
      provider.boot();
    }
    return this;
  }

  bindService(name, service) {
    this.registeredServices[name] = service;
    return this;
  }

  service(name) {
    return this.registeredServices[name];
  }
}

export default Application;
