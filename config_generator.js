"use strict";

const DefaultSettings = {
   windowPos: {
      edgeUI: [0, 0],
      runeUI: [0, 0],
      fusionUI: [0, 0]
   },
   scale: {
      edgeUI: 0.65,
      runeUI: 0.80,
      fusionUI: 1.0
   },
   draggable: false
};

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
   if (from_ver === undefined) {
      return Object.assign(Object.assign({}, DefaultSettings), settings);
   } else if (from_ver === null) {
      return DefaultSettings;
   } else {

      if (from_ver + 1 < to_ver) {
         settings = MigrateSettings(from_ver, from_ver + 1, settings);
         return MigrateSettings(from_ver + 1, to_ver, settings);
      }

      console.log(`========= EdgeUI Settings Update to v${to_ver}=========`);
      switch (to_ver) {
         case 2:
            settings.windowPos['fusionUI'] = DefaultSettings.windowPos.fusionUI;
            settings.scale['fusionUI'] = DefaultSettings.scale.fusionUI;
            break;
         default:
            let oldsettings = settings;
            settings = Object.assign(DefaultSettings, {});
            for (let option in oldsettings) {
               if (settings[option]) settings[option] = oldsettings[option];
            }
            break;
      }

      return settings;
   }
}
