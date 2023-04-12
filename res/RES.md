## Se non parte Android metro!

https://stackoverflow.com/questions/45940861/android-8-cleartext-http-traffic-not-permitted/50834600#50834600

According to Network security configuration -
Starting with Android 9 (API level 28), cleartext support is disabled by default.
`AndroidManifest.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">api.example.com(to be adjusted)</domain>
    </domain-config>
</network-security-config>
AndroidManifest.xml -

<?xml version="1.0" encoding="utf-8"?>
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        ...
        android:networkSecurityConfig="@xml/network_security_config"
        ...>
        ...
    </application>
</manifest>
```

## expor module

export { Tiger } would be equivalent to module.exports.Tiger = Tiger.

Conversely, module.exports = Tiger would be equivalent to export default Tiger.

So when you use module.exports = Tiger and then attempt import { Tiger } from './animals' you're effectively asking for Tiger.Tiger.

## iOS 16.1.1 Support for XCode run destination

hello, I worked around the same problem. The solution that I found was adding iOS 16.1 the device support file inside the Xcode app in path contents/Developer/platform/iPhoneOS.platform/DeviceSupport You can download it from https://github.com/iGhibli/iOS-DeviceSupport/tree/master/DeviceSupport or you can download the new beta version and grab the directory from it.

## Firma per ios >= 16

https://stackoverflow.com/questions/68467306/the-code-signature-version-is-no-longer-supported
Notice
This answer is mostly for people using older versions of Xcode. My build farm was for a time stuck at Xcode 12.4 because some Mac minis couldn't be upgraded past Catalina. If you are using a recent Xcode 13+ this is not your issue. Probably cruft of some kind in your project.

If you're still using an Xcode 12 release it is time to let go. The only reason to use 12.4 would be because you're stuck on Catalina and new problems are cropping up that will not be worked around so easily.

codesign --generate-entitlement-der
Apple has changed the codesign signature to include DER encoded entitlements in addition to the plist encoded entitlements. This additional DER encoded entitlements section is required in iOS 15 and becomes the default behavior of codesign in the latest Xcode. To use codesign on an older machines with an older version of Xcode add the --generate-entitlement-der flag to your call to codesign.

If signing through Xcode, you can add this flag to the OTHER_CODE_SIGN_FLAGS setting in the Build Settings tab.

## UI

https://dribbble.com/shots/18744170-Fitness-App
https://dribbble.com/shots/19860819-Workout-Mobile-App
https://dribbble.com/shots/20850588-LooizeCare-health-App
https://dribbble.com/shots/19711233-Fitness-App

## queue

```js
const BluetoothOperation = {
  StartScan: 0,
  StopScan: 1,
};

// operation queue, to schedule app's requests to Ble
class BluetoothQueue {
  constructor() {
    // Create an empty array of commands
    this.queue = [];
    // We're inactive to begin with
    this.active = false;
  }

  // Method for adding command chain to the queue
  place(command, callback) {
    // Push the command onto the command array
    this.queue.push({command, callback});
    // If we're currently inactive, start processing
    if (!this.active) this.next();
  }

  // Method for calling the next command chain in the array
  next() {
    // If this is the end of the queue
    if (!this.queue.length) {
      // We're no longer active
      this.active = false;
      // Stop execution
      return;
    }
    // Grab the next command
    const command = this.queue.shift();
    // We're active
    this.active = true;
    // Call the command
    command.callback();
    this.next();
  }

  //Clearing queue
  clear() {
    this.queue.length = 0;
    this.active = false;
  }
}
```
