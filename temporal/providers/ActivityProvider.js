import { activities } from "../config/activityModules.js";
import Provider from "./Provider.js";

class ActivityProvider extends Provider {
  constructor() {
    super();
    this.activities = activities;
  }

  register() {
    this.registerActivities(this.activities);
    this.app.bindService("activities", this.activities);
  }

  boot() {
    // No boot logic needed for activities
  }

  registerActivity(name, activityFn) {
    this.activities[name] = activityFn;
    return this;
  }

  registerActivities(activitiesObj) {
    for (const [name, activityFn] of Object.entries(activitiesObj)) {
      this.registerActivity(name, activityFn);
    }
    return this;
  }
}

export default ActivityProvider;
