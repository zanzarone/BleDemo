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
let BLE_PERIPHERAL_FOUND: String  = "BLE_PERIPHERAL_FOUND"


@objc(BluetoothZ)
class BluetoothZ: RCTEventEmitter, CBCentralManagerDelegate, CBPeripheralDelegate
{
  /// PROPS
  var centralManager: CBCentralManager? = nil

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
      BLE_ADAPTER_STATUS_POWERED_ON: NSNumber(value:CBManagerState.poweredOn.rawValue),
      BLE_ADAPTER_STATUS_POWERED_OFF: NSNumber(value:CBManagerState.poweredOff.rawValue)
    ]
  }
  
  @objc(status:rejecter:)
  func status(_ resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    if let manager = self.centralManager {
      resolve(NSNumber(value:manager.state.rawValue))
    }else{
      reject("status", "could not retrieve status", nil)
    }
  }
  
  @objc(startScan:options:)
  func startScan(_ serviceUUIDs: [NSString]? = nil, options: [String : Any]? = nil)
  {
    print("========================>>>> startScan")
    self.centralManager?.scanForPeripherals(withServices: [])
  }
  
  @objc
  func stopScan()
  {
    print("========================>>>> stopScan")
    self.centralManager?.stopScan()
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
      self.sendEvent(withName: BLE_PERIPHERAL_FOUND, body: ["name":  peripheral.name!, "RSSI": peripheral.rssi])
    }
  }
}
 
