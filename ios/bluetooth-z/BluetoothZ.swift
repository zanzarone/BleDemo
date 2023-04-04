//
//  BluetoothZ.swift
//  BleDemo
//
//  Created by Vecchio on 30/03/23.
//

import Foundation
import React
import CoreBluetooth

let BLE_ADAPTER_STATUS_DID_UPDATE:  String  = "BLE_ADAPTER_STATUS_DID_UPDATE"
let BLE_ADAPTER_STATUS_POWERED_ON:  String  = "BLE_ADAPTER_STATUS_POWERED_ON"
let BLE_ADAPTER_STATUS_POWERED_OFF: String  = "BLE_ADAPTER_STATUS_POWERED_OFF"
/// ==============
let BLE_ADAPTER_ALLOW_DUPLICATES            : String  = CBCentralManagerScanOptionAllowDuplicatesKey
let BLE_ADAPTER_SOLICITED_SERVICE           : String  = CBCentralManagerScanOptionSolicitedServiceUUIDsKey
let BLE_PERIPHERAL_FOUND                    : String  = "BLE_PERIPHERAL_FOUND"
let BLE_PERIPHERAL_CONNECTED                : String  = "BLE_PERIPHERAL_CONNECTED"
let BLE_PERIPHERAL_DISCONNECTED             : String  = "BLE_PERIPHERAL_DISCONNECTED"
let BLE_PERIPHERAL_CONNECT_FAILED           : String  = "BLE_PERIPHERAL_CONNECT_FAILED"
let BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED : String  = "BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED"


@objc(BluetoothZ)
class BluetoothZ: RCTEventEmitter, CBCentralManagerDelegate, CBPeripheralDelegate
{
  /// PROPS
  var centralManager: CBCentralManager? = nil
  var currentDevice: CBPeripheral? = nil
  
  @objc
  func setup()
  {
    print("========================>>>> setup")
    if(centralManager == nil) {
      self.centralManager =  CBCentralManager(delegate: self, queue: nil)
    }
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool
  {
    print("========================>>>> requiresMainQueueSetup")
    return false;
  }
  
  override func supportedEvents() -> [String]!
  {
    return [BLE_ADAPTER_STATUS_DID_UPDATE, BLE_PERIPHERAL_FOUND]
  }
  
  @objc
  override func constantsToExport() -> [AnyHashable : Any]!
  {
    print("========================>>>> constantsToExport")

    return [
      BLE_ADAPTER_STATUS_DID_UPDATE: BLE_ADAPTER_STATUS_DID_UPDATE,
      BLE_PERIPHERAL_FOUND : BLE_PERIPHERAL_FOUND,
      BLE_PERIPHERAL_CONNECTED : BLE_PERIPHERAL_CONNECTED,
      BLE_PERIPHERAL_DISCONNECTED : BLE_PERIPHERAL_DISCONNECTED,
      BLE_PERIPHERAL_CONNECT_FAILED: BLE_PERIPHERAL_CONNECT_FAILED,
      // A Boolean value that specifies whether the scan should run without duplicate filtering.
      BLE_ADAPTER_ALLOW_DUPLICATES : CBCentralManagerScanOptionAllowDuplicatesKey,
      // An array of service UUIDs that you want to scan for.
      BLE_ADAPTER_SOLICITED_SERVICE : CBCentralManagerScanOptionSolicitedServiceUUIDsKey,
      BLE_ADAPTER_STATUS_POWERED_ON: NSNumber(value:CBManagerState.poweredOn.rawValue),
      BLE_ADAPTER_STATUS_POWERED_OFF: NSNumber(value:CBManagerState.poweredOff.rawValue)
    ]
  }
  
  @objc(status:reject:)
  func status(_ resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    if let manager = self.centralManager {
      resolve(NSNumber(value:manager.state.rawValue))
    }else{
      reject("status", "could not retrieve status", nil)
    }
  }
  
  @objc(startScan:filter:options:)
  func startScan(_ serviceUUIDs: [String]? = nil, filter:String? = nil, options: [String : Any]? = nil)
  {
    print("========================>>>> startScan")
    var services : [CBUUID] = []
    if let uuids = serviceUUIDs{
      for uuid in uuids {
        services.append(CBUUID(string: uuid))
      }
    }
    self.centralManager?.scanForPeripherals(withServices: services, options: options)
  }
  
  @objc
  func stopScan()
  {
    print("========================>>>> stopScan")
    self.centralManager?.stopScan()
  }
  
  @objc(connect:resolve:reject:)
  func connect(_ uuidString: String, resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock)
  {
    print("========================>>>> connect")
    if let uuid = UUID(uuidString: uuidString){
      let _peripherals : [CBPeripheral]? = self.centralManager?.retrievePeripherals(withIdentifiers:[uuid])
      if let peripherals = _peripherals , peripherals.count > 0 {
        self.currentDevice = peripherals.first!
        self.centralManager?.connect(self.currentDevice!)
        resolve(true)
      }else{
        reject("connect", "could not find devices with id \(uuidString).", nil)
      }
    }else{
      reject("connect", "could not create uuid from \(uuidString).", nil)
    }
  }
  
  @objc
  func discover(_ resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void
  {
    print("========================>>>> setup")
    if(self.currentDevice != nil) {
      self.currentDevice?.discoverServices([])
    }
  }

  
  /// ===============  BLE DELEGATE
  func centralManagerDidUpdateState(_ central: CBCentralManager)
  {
    print("========================>>>> centralManagerDidUpdateState")
    self.sendEvent(withName: BLE_ADAPTER_STATUS_DID_UPDATE, body: ["status":  NSNumber(value:central.state.rawValue)])
  }
  
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber)
  {
    if(peripheral.name != nil)
    {
      self.sendEvent(withName: BLE_PERIPHERAL_FOUND, body: ["uuid":  peripheral.identifier.uuidString , "name":  peripheral.name!])
    }
  }
  
  func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral)
  {
    self.sendEvent(withName: BLE_PERIPHERAL_CONNECTED, body: nil)
  }
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral: CBPeripheral, error: Error?)
  {
    self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECTED, body: ["error": error != nil ? error!.localizedDescription : "Unknow error"])
  }
  
  func centralManager(_ central: CBCentralManager, didFailToConnect: CBPeripheral, error: Error?)
  {
    self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["error": error != nil ? error!.localizedDescription : "Unknow error"])
  }
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?)
  {
    if let err = error {
      self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["error": err.localizedDescription])
      return
    }
  }
}
 
