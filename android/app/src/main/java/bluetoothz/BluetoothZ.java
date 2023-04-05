package bluetoothz;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
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

import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

public class BluetoothZ extends ReactContextBaseJavaModule {
    public static final String BLE_ADAPTER_STATUS_DID_UPDATE = "BLE_ADAPTER_STATUS_DID_UPDATE";
    public static final String BLE_ADAPTER_STATUS_INVALID = "BLE_ADAPTER_STATUS_INVALID";
    public static final String BLE_ADAPTER_STATUS_POWERED_ON = "BLE_ADAPTER_STATUS_POWERED_ON";
    public static final String BLE_ADAPTER_STATUS_POWERED_OFF = "BLE_ADAPTER_STATUS_POWERED_OFF";
    public static final String BLE_ADAPTER_STATUS_UNKNOW = "BLE_ADAPTER_STATUS_UNKNOW";
    public static final String BLE_PERIPHERAL_FOUND = "BLE_PERIPHERAL_FOUND";
    public static final String BLE_PERIPHERAL_CONNECTED = "BLE_PERIPHERAL_CONNECTED";
    public static final String BLE_PERIPHERAL_DISCONNECTED = "BLE_PERIPHERAL_DISCONNECTED";
    public static final String BLE_PERIPHERAL_CONNECT_FAILED = "BLE_PERIPHERAL_CONNECT_FAILED";
    public static final String BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED = "BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED";
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private int listenerCount = 0;
    private ReactApplicationContext reactContext;
    private LocalBroadcastReceiver  mLocalBroadcastReceiver     = new LocalBroadcastReceiver();
    private LocalScanCallback  mScanCallback                    = new LocalScanCallback();
    private LocalBluetoothGattCallback  mBluetoothGATTCallback  = new LocalBluetoothGattCallback();
    private BluetoothGatt currentDeviceGATTServer = null;
//    private boolean isScanning = false;
    public class LocalBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            // It means the user has changed his bluetooth state.
            if (action.equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {
                BluetoothZ.sendBleStatus(bluetoothAdapter.getState(), reactContext);
            }
        }
    }

    // Device scan callback.
    public class LocalScanCallback extends ScanCallback {
        @SuppressLint("MissingPermission")
        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            super.onScanResult(callbackType, result);
            Log.d("SAMUELE", ""+ result.getDevice().getName());
            BluetoothDevice device = result.getDevice();
            if(device.getName() != null && !device.getName().isEmpty()){
                WritableMap params = Arguments.createMap();
                params.putString("uuid", device.getAddress() );
                params.putString("name", device.getName() );
                sendEvent(reactContext, BLE_PERIPHERAL_FOUND, params);
            }
        }
    }

    private class LocalBluetoothGattCallback extends BluetoothGattCallback {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            String uuid = gatt.getDevice().getAddress();
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                WritableMap params = Arguments.createMap();
                params.putString("uuid", uuid);
                Log.w("SAMUELE", "Device CONNECTED!!!!." + uuid);
                sendEvent(reactContext, BLE_PERIPHERAL_CONNECTED, params);
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                // disconnected from the GATT Server
                WritableMap params = Arguments.createMap();
                params.putString("uuid", uuid);
                Log.w("SAMUELE", "Device DISCONNECTED!!!!." + uuid);
                sendEvent(reactContext, BLE_PERIPHERAL_DISCONNECTED, params);
            }
        }
    };

    public BluetoothZ(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        this.reactContext.registerReceiver(mLocalBroadcastReceiver, new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED));
    }

    private static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(BLE_ADAPTER_STATUS_DID_UPDATE, BLE_ADAPTER_STATUS_DID_UPDATE);
        constants.put(BLE_ADAPTER_STATUS_INVALID, BLE_ADAPTER_STATUS_INVALID);
        constants.put(BLE_ADAPTER_STATUS_POWERED_ON, BLE_ADAPTER_STATUS_POWERED_ON);
        constants.put(BLE_ADAPTER_STATUS_POWERED_OFF, BLE_ADAPTER_STATUS_POWERED_OFF);
        constants.put(BLE_ADAPTER_STATUS_UNKNOW, BLE_ADAPTER_STATUS_UNKNOW);
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
            sendEvent(reactContext, BLE_ADAPTER_STATUS_INVALID, null);
            return;
        }
        sendBleStatus(bluetoothAdapter.getState(), reactContext);
    }

    private static void sendBleStatus(int state, ReactContext reactContext){
        WritableMap params = Arguments.createMap();
        switch (state){
            case BluetoothAdapter.STATE_ON: case BluetoothAdapter.STATE_TURNING_ON:
                params.putString("status", BLE_ADAPTER_STATUS_POWERED_ON);
                BluetoothZ.sendEvent(reactContext,BLE_ADAPTER_STATUS_DID_UPDATE, params);
                break;
            case BluetoothAdapter.STATE_OFF: case BluetoothAdapter.STATE_TURNING_OFF:
                params.putString("status", BLE_ADAPTER_STATUS_POWERED_OFF);
                BluetoothZ.sendEvent(reactContext,BLE_ADAPTER_STATUS_DID_UPDATE, params);
                break;
        }
    }

    @ReactMethod
    public void status(Promise promise) {
        if (bluetoothAdapter == null) {
            promise.reject("status", "could not retrieve status");
            return;
        }
        WritableMap params = Arguments.createMap();
        switch (bluetoothAdapter.getState()) {
            case BluetoothAdapter.STATE_ON: case BluetoothAdapter.STATE_TURNING_ON:
                params.putString("status", BLE_ADAPTER_STATUS_POWERED_ON);
                promise.resolve(params);
                break;
            case BluetoothAdapter.STATE_OFF: case BluetoothAdapter.STATE_TURNING_OFF:
                params.putString("status", BLE_ADAPTER_STATUS_POWERED_OFF);
                promise.resolve(params);
                break;
            default:
                params.putString("status", BLE_ADAPTER_STATUS_UNKNOW);
                promise.resolve(params);
        }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void startScan(@Nullable ReadableArray services, @Nullable String filter, @Nullable ReadableMap options, Promise promise) {
        this.bluetoothLeScanner = BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner();
        if(this.bluetoothLeScanner != null) {
            Log.d("START SCAN", " AAAAAAAAAAA");
            ArrayList<ScanFilter> filters = new ArrayList<>();
//            scanFilters = new ArrayList<>()
            ScanSettings settings = new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build();
            this.bluetoothLeScanner.startScan(filters, settings, mScanCallback);
        }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void stopScan() {
        this.bluetoothLeScanner.stopScan(mScanCallback);
        Log.d("SAMUELE","=====> STOP SCAN");
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void connect(String uuid) {
        try {
            Log.d("SAMUELE","=====> CONNECT");
            final BluetoothDevice device = bluetoothAdapter.getRemoteDevice(uuid);
            currentDeviceGATTServer = device.connectGatt(reactContext, false, mBluetoothGATTCallback);
        } catch (IllegalArgumentException exception) {
            WritableMap params = Arguments.createMap();
            params.putString("error", exception.getLocalizedMessage());
            Log.w("SAMUELE", "Device not found with provided address." + uuid);
            sendEvent(reactContext, BLE_PERIPHERAL_CONNECT_FAILED, params);
        }

    }


    @SuppressLint("MissingPermission")
    @ReactMethod
    public void disconnect(String uuid) {
        Log.d("SAMUELE","=====> DISCONNECT");
        if(currentDeviceGATTServer.getDevice().getAddress().compareToIgnoreCase(uuid) == 0){
            Log.d("SAMUELE","=====> DISCONNECT 2");
            currentDeviceGATTServer.close();
//            currentDeviceGATTServer = null;
        }else {
            WritableMap params = Arguments.createMap();
            params.putString("error", "SO NA SEGA");
            Log.w("SAMUELE", "Device not found with provided address." + uuid);
            sendEvent(reactContext, BLE_PERIPHERAL_CONNECT_FAILED, params);
        }
    }


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