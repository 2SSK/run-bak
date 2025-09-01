import { Client, Connection } from "@temporalio/client";
import Provider from "./Provider.js";

let temporalClient = null;
let temporalConnection = null;

class TemporalClientProvider extends Provider {
  register() {
    this.app.bindService("temporalClient", {
      getTemporalClient: async () => {
        if (temporalClient) return temporalClient;

        const config = this.app.service("config").temporal;
        const namespace = config.namespaces[0];
        const serverAddress = config.serverAddress || "localhost:7233";

        try {
          if (!temporalConnection) {
            temporalConnection = await Connection.connect({
              address: serverAddress,
            });
            this.app
              .service("logger")
              ?.info("Temporal connection established.");
          }
          temporalClient = new Client({
            connection: temporalConnection,
            namespace,
          });

          this.app.service("logger")?.info("Temporal client initialized.");
          return temporalClient;
        } catch (error) {
          this.app
            .service("logger")
            ?.error("Failed to connect to  Temporal:", error);
          throw error;
        }
      },
    });
  }

  boot() {
    // No boot logic needed for Temporal client
  }
}

export default TemporalClientProvider;
