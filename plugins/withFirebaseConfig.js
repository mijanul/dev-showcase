const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withFirebaseConfig = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;
      if (googleServicesJson) {
        const configDir = path.join(config.modRequest.projectRoot, "config");
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
        }
        const filePath = path.join(configDir, "google-services.json");
        const content = atob(googleServicesJson);
        fs.writeFileSync(filePath, content);
        console.log("✅ google-services.json restored from EAS Secret");
      }
      return config;
    },
  ]);
};

const withIOSFirebaseConfig = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const googleServiceInfoPlist = process.env.GOOGLE_SERVICE_INFO_PLIST;
      if (googleServiceInfoPlist) {
        const configDir = path.join(config.modRequest.projectRoot, "config");
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
        }
        const filePath = path.join(configDir, "GoogleService-Info.plist");
        const content = atob(googleServiceInfoPlist);
        fs.writeFileSync(filePath, content);
        console.log("✅ GoogleService-Info.plist restored from EAS Secret");
      }
      return config;
    },
  ]);
};

module.exports = (config) => {
  config = withFirebaseConfig(config);
  config = withIOSFirebaseConfig(config);
  return config;
};
