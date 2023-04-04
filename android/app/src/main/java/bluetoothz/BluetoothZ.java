package bluetoothz;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.os.Handler;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;


import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.util.Map;
import java.util.HashMap;

public class BluetoothZ extends ReactContextBaseJavaModule {
    public static final String BLE_ADAPTER_STATUS_DID_UPDATE = "BLE_ADAPTER_STATUS_DID_UPDATE";
    public static final String BLE_ADAPTER_STATUS_INVALID = "BLE_ADAPTER_STATUS_INVALID";
    public static final String BLE_ADAPTER_STATUS_POWERED_ON = "BLE_ADAPTER_STATUS_POWERED_ON";
    public static final String BLE_ADAPTER_STATUS_POWERED_OFF = "BLE_ADAPTER_STATUS_POWERED_OFF";
    public static final String BLE_PERIPHERAL_FOUND = "BLE_PERIPHERAL_FOUND";
    public static final String BLE_PERIPHERAL_CONNECTED = "BLE_PERIPHERAL_CONNECTED";
    public static final String BLE_PERIPHERAL_DISCONNECTED = "BLE_PERIPHERAL_DISCONNECTED";
    public static final String BLE_PERIPHERAL_CONNECT_FAILED = "BLE_PERIPHERAL_CONNECT_FAILED";
    public static final String BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED = "BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED";
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private boolean scanning;
    private Handler handler = new Handler();
    private ReactApplicationContext context;

    BluetoothZ(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(BLE_ADAPTER_STATUS_DID_UPDATE, BLE_ADAPTER_STATUS_DID_UPDATE);
        constants.put(BLE_ADAPTER_STATUS_INVALID, BLE_ADAPTER_STATUS_INVALID);
        constants.put(BLE_ADAPTER_STATUS_POWERED_ON, BLE_ADAPTER_STATUS_POWERED_ON);
        constants.put(BLE_ADAPTER_STATUS_POWERED_OFF, BLE_ADAPTER_STATUS_POWERED_OFF);
        constants.put(BLE_PERIPHERAL_FOUND, BLE_PERIPHERAL_FOUND);
        constants.put(BLE_PERIPHERAL_CONNECTED, BLE_PERIPHERAL_CONNECTED);
        constants.put(BLE_PERIPHERAL_DISCONNECTED, BLE_PERIPHERAL_DISCONNECTED);
        constants.put(BLE_PERIPHERAL_CONNECT_FAILED, BLE_PERIPHERAL_CONNECT_FAILED);
        constants.put(BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED, BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED);
        return constants;
    }

    @NonNull
    @Override
    public String getName() {
        return "BluetoothZ";
    }

    @ReactMethod
    public void setup() {
        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null) {
            // Device doesn't support Bluetooth
//            WritableMap params = Arguments.createMap();
//            params.putString("eventProperty", "someValue");
            sendEvent(this.context, BLE_ADAPTER_STATUS_INVALID, null);
            return;
        }
    }

    @ReactMethod
    public void status(Promise promise) {
        if (bluetoothAdapter == null) {
            promise.reject("status", "could not retrieve status");
            return;
        }
        promise.resolve(bluetoothAdapter.getState());
    }

    // Device scan callback.
    private ScanCallback leScanCallback =
        new ScanCallback() {
            @Override
            public void onScanResult(int callbackType, ScanResult result) {
                super.onScanResult(callbackType, result);

//                    leDeviceListAdapter.addDevice(result.getDevice());
//                    leDeviceListAdapter.notifyDataSetChanged();
            }
        };

    @SuppressLint("MissingPermission")
    private void scanLeDevice() {
        this.bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
        this.bluetoothLeScanner.startScan(leScanCallback);
//        if (!scanning) {
//            // Stops scanning after a predefined scan period.
//            handler.postDelayed(new Runnable() {
//                @Override
//                public void run() {
//                    scanning = false;
//                    bluetoothLeScanner.stopScan(leScanCallback);
//                }
//            }, SCAN_PERIOD);
//
//            scanning = true;
//            this.bluetoothLeScanner.startScan(leScanCallback);
//        } else {
//            scanning = false;
//            bluetoothLeScanner.stopScan(leScanCallback);
//        }
    }


    @ReactMethod
    public void startScan(@Nullable String name, @Nullable String filter, @Nullable ReadableMap options, Promise promise) {

    }

    private int listenerCount = 0;

    @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount == 0) {
            // Set up any upstream listeners or background tasks as necessary
        }

        listenerCount += 1;
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        listenerCount -= count;
        if (listenerCount == 0) {
            // Remove upstream listeners, stop unnecessary background tasks
        }
    }

}

//import android.annotation.SuppressLint;
//import android.bluetooth.BluetoothAdapter;
//import android.bluetooth.BluetoothDevice;
//import android.bluetooth.le.BluetoothLeScanner;
//import android.bluetooth.le.ScanCallback;
//import android.bluetooth.le.ScanFilter;
//import android.bluetooth.le.ScanResult;
//import android.bluetooth.le.ScanSettings;
//import android.os.ParcelUuid;
//
//import androidx.annotation.NonNull;
//import androidx.annotation.Nullable;
//
//import com.facebook.react.bridge.Arguments;
//import com.facebook.react.bridge.ReactContext;
//import com.facebook.react.bridge.ReactContextBaseJavaModule;
//import com.facebook.react.bridge.ReactApplicationContext;
//import com.facebook.react.bridge.ReactMethod;
//import com.facebook.react.bridge.WritableMap;
//import com.facebook.react.modules.core.DeviceEventManagerModule;
////import com.wilsontenantreact.nedap.openGate.log.RNOpenGateLogger;
//import java.util.*;

//public class BluetoothZ extends ReactContextBaseJavaModule {
//
//
//    private BluetoothAdapter bluetoothAdapter;
//    private BluetoothLeScanner scanner;
//
//    private ReactApplicationContext context;
//
////    private final scanCallback = new ScanCallback(){
////        @Override
////        public void onScanResult(int callbackType, scanResult result){
////
////            if(result.getDeice().getName() != null){
////                WritableMap params = Arguments.createMap();
////                params.putString("name", result.getDevice().getName());
////
////                sendEvent("Device", params);
////            }
////        }
////    }
//
//    public BluetoothZ(ReactApplicationContext context) {
//        super(context);
//        this.context = context;
//        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
//        if (bluetoothAdapter == null) {
//            // Device doesn't support Bluetooth
//            return;
//        }
////        bleCallback = new BluetoothScanCallback();
//    }
//
//    @ReactMethod
//    public void status() {
//        if (!bluetoothAdapter.isEnabled()) {
//
//        }
//    }
//
////    To make your app available to devices that don't support Bluetooth classic or BLE, you should still include
////    the <uses-feature> element in your app's manifest, but set required="false".
////    Then, at run-time, you can determine feature availability by using PackageManager.hasSystemFeature()
////    public void bo(){
////        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
////            Toast.makeText(this, R.string.ble_not_supported, Toast.LENGTH_SHORT).show();
////            finish();
////        }
////    }
//
//    @NonNull
//    @Override
//    public String getName() {
//        return "BluetoothZ";
//    }
//
//    @SuppressLint("MissingPermission")
//    @ReactMethod
//    public void startScan() {
//
//        scanner = BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner();
//
//        if(scanner != null) {
//            ArrayList<ScanFilter> filters =new ArrayList<>();
//            ScanSettings settings = new ScanSettings.Builder().
//                    setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).
//                    build();
//
////            scanner.startScan(filters, settings, bleCallback);
//        }
//    }
//
//    private void sendEvent(String eventName, @Nullable WritableMap params) {
//        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
//    }
//
//    @ReactMethod
//    public void stopScan() {
//        if(scanner != null) {
////            scanner.stopScan(bleCallback);
//            scanner = null;
//        }
//    }
//
//
//    // Required for RN built in EventEmitter Calls, otherwise the app will give warnings
//    // (Warning: `new NativeEventEmitter` was called with anon null argument without the required `removeListeners` method.)
//    @ReactMethod
//    public void addListener(String eventName) {
//
//    }
//
//    @ReactMethod
//    public void removeListeners(Integer count) {
//
//    }
//}