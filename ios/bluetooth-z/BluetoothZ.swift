//
//  BluetoothZ.swift
//  BleDemo
//
//  Created by Vecchio on 30/03/23.
//

import Foundation
import React
import CoreBluetooth

let BLE_ADAPTER_STATUS_DID_UPDATE           : String  = "BLE_ADAPTER_STATUS_DID_UPDATE"
let BLE_ADAPTER_STATUS_INVALID              : String  = "BLE_ADAPTER_STATUS_INVALID"
let BLE_ADAPTER_STATUS_POWERED_ON           : String  = "BLE_ADAPTER_STATUS_POWERED_ON"
let BLE_ADAPTER_STATUS_POWERED_OFF          : String  = "BLE_ADAPTER_STATUS_POWERED_OFF"
let BLE_ADAPTER_STATUS_UNKNOW               : String  = "BLE_ADAPTER_STATUS_UNKNOW"
let BLE_PERIPHERAL_FOUND                    : String  = "BLE_PERIPHERAL_FOUND"
let BLE_PERIPHERAL_CONNECTING               : String  = "BLE_PERIPHERAL_CONNECTING"
let BLE_PERIPHERAL_CONNECTED                : String  = "BLE_PERIPHERAL_CONNECTED"
let BLE_PERIPHERAL_DISCONNECTED             : String  = "BLE_PERIPHERAL_DISCONNECTED"
let BLE_PERIPHERAL_CONNECT_FAILED           : String  = "BLE_PERIPHERAL_CONNECT_FAILED"
let BLE_PERIPHERAL_DISCONNECT_FAILED        : String  = "BLE_PERIPHERAL_DISCONNECT_FAILED"
let BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED : String  = "BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED"
/// ==============
let BLE_ADAPTER_ALLOW_DUPLICATES            : String  = CBCentralManagerScanOptionAllowDuplicatesKey
let BLE_ADAPTER_SOLICITED_SERVICE           : String  = CBCentralManagerScanOptionSolicitedServiceUUIDsKey


@objc(BluetoothZ)
class BluetoothZ: RCTEventEmitter, CBCentralManagerDelegate, CBPeripheralDelegate
{
  /// PROPS
  var centralManager: CBCentralManager? = nil
  var currentPeripheral: [String:CBPeripheral] = [:]
  var connectionTimer: Timer? = nil
  
  @objc
  func setup()
  {
    /// ("========================>>>> setup")
    if(centralManager == nil) {
      self.centralManager =  CBCentralManager(delegate: self, queue: nil)
    }
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool
  {
    /// ("========================>>>> requiresMainQueueSetup")
    return false;
  }
  
  override func supportedEvents() -> [String]!
  {
    return [BLE_ADAPTER_STATUS_DID_UPDATE,
            BLE_PERIPHERAL_FOUND,
            BLE_PERIPHERAL_CONNECTING,
            BLE_PERIPHERAL_CONNECTED,
            BLE_PERIPHERAL_DISCONNECTED,
            BLE_PERIPHERAL_CONNECT_FAILED,
            BLE_PERIPHERAL_DISCONNECT_FAILED,
            BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED
    ]
  }
  
  @objc
  override func constantsToExport() -> [AnyHashable : Any]!
  {
    /// ("========================>>>> constantsToExport")

    return [
      BLE_ADAPTER_STATUS_DID_UPDATE: BLE_ADAPTER_STATUS_DID_UPDATE,
      BLE_PERIPHERAL_FOUND : BLE_PERIPHERAL_FOUND,
      BLE_PERIPHERAL_CONNECTING : BLE_PERIPHERAL_CONNECTING,
      BLE_PERIPHERAL_CONNECTED : BLE_PERIPHERAL_CONNECTED,
      BLE_PERIPHERAL_DISCONNECTED : BLE_PERIPHERAL_DISCONNECTED,
      BLE_PERIPHERAL_CONNECT_FAILED: BLE_PERIPHERAL_CONNECT_FAILED,
      BLE_PERIPHERAL_DISCONNECT_FAILED: BLE_PERIPHERAL_DISCONNECT_FAILED,
      // A Boolean value that specifies whether the scan should run without duplicate filtering.
      BLE_ADAPTER_ALLOW_DUPLICATES : CBCentralManagerScanOptionAllowDuplicatesKey,
      // An array of service UUIDs that you want to scan for.
      BLE_ADAPTER_SOLICITED_SERVICE : CBCentralManagerScanOptionSolicitedServiceUUIDsKey,
      BLE_ADAPTER_STATUS_INVALID: BLE_ADAPTER_STATUS_INVALID,
      BLE_ADAPTER_STATUS_POWERED_ON: BLE_ADAPTER_STATUS_POWERED_ON,
      BLE_ADAPTER_STATUS_POWERED_OFF: BLE_ADAPTER_STATUS_POWERED_OFF
    ]
  }
  
  @objc(status:reject:)
  func status(_ resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    if let manager = self.centralManager {
//      resolve(NSNumber(value:manager.state.rawValue))
      switch manager.state {
      case .poweredOff: resolve( ["status":  BLE_ADAPTER_STATUS_POWERED_OFF] )
        break
      case .poweredOn: resolve( ["status":  BLE_ADAPTER_STATUS_POWERED_ON] )
        break
      default:
        resolve( ["status":  BLE_ADAPTER_STATUS_UNKNOW] )
        break
      }

    }else{
      reject("status", "could not retrieve status", nil)
    }
  }
  
  @objc(startScan:filter:options:)
  func startScan(_ serviceUUIDs: [String]? = nil, filter:String? = nil, options: [String : Any]? = nil)
  {
    /// ("========================>>>> startScan")
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
    /// ("========================>>>> stopScan")
    self.centralManager?.stopScan()
  }
  
  @objc(connect:)
  func connect(_ uuidString: String)
  {
    /// ("========================>>>> connect")
    if let uuid = UUID(uuidString: uuidString){
      /// i'm already connected to a device
      if self.currentPeripheral.contains(where: { (key: String, value: CBPeripheral) -> Bool in
        return key.compare(uuidString) == .orderedSame
      }) {
        return
      }
      let _peripherals : [CBPeripheral]? = self.centralManager?.retrievePeripherals(withIdentifiers:[uuid])
      if let peripherals = _peripherals , peripherals.count > 0 {
        let device = peripherals.first!
        self.currentPeripheral[uuidString] = device
        self.centralManager?.connect(device)
        self.sendEvent(withName: BLE_PERIPHERAL_CONNECTING, body: nil)
      }else{
        self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["error":  "could not find devices with id \(uuidString)."])
      }
    }else{
      self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["error":  "could not create uuid from \(uuidString)."])
    }
  }
  
  @objc(disconnect:)
  func disconnect(_ uuidString: String)
  {
    /// ("========================>>>> disconnect")
    if self.currentPeripheral.contains(where: { (key: String, value: CBPeripheral) -> Bool in
      return key.compare(uuidString) != .orderedSame
    }) {
      /// i need to disconnect the current device before attempting a new connection
      return
    }
    if let peripheral = self.currentPeripheral[uuidString] {
      self.centralManager?.cancelPeripheralConnection(peripheral)
      self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECTED, body: ["uuid": peripheral.identifier.uuidString])
    }else{
      self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECT_FAILED, body: ["error": "peripheral not found with uuid:\(uuidString)"])
    }
  }
  
  @objc
  func discover(_ uuidString: String) -> Void
  {
    /// ("========================>>>> setup")
    if self.currentPeripheral.contains(where: { (key: String, value: CBPeripheral) -> Bool in
      return key.compare(uuidString) != .orderedSame
    }) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED, body: ["error": "peripheral not found with uuid:\(uuidString)"])
      return
    }
    let device = self.currentPeripheral[uuidString]
    device!.discoverServices([])
  }
  
  /// =======================================================================================================================================
  /// =======================================================================================================================================
  /// =======================================================================================================================================
  /// ===============  BLE DELEGATE
  /// =======================================================================================================================================
  /// =======================================================================================================================================
  /// =======================================================================================================================================
  func centralManagerDidUpdateState(_ central: CBCentralManager)
  {
    /// ("========================>>>> centralManagerDidUpdateState")
    switch central.state {
    case .poweredOff: self.sendEvent(withName: BLE_ADAPTER_STATUS_DID_UPDATE, body: ["status":  BLE_ADAPTER_STATUS_POWERED_OFF])
      break
    case .poweredOn: self.sendEvent(withName: BLE_ADAPTER_STATUS_DID_UPDATE, body: ["status":  BLE_ADAPTER_STATUS_POWERED_ON])
      break
    default:
      self.sendEvent(withName: BLE_ADAPTER_STATUS_DID_UPDATE, body: ["status":  BLE_ADAPTER_STATUS_UNKNOW])
      break
    }
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
    if self.currentPeripheral.contains(where: { (key: String, value: CBPeripheral) -> Bool in
      return key.compare(peripheral.identifier.uuidString) != .orderedSame
    }) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["error": "peripheral not found with uuid:\(peripheral.identifier.uuidString)"])
      return
    }
    self.sendEvent(withName: BLE_PERIPHERAL_CONNECTED, body: ["uuid": peripheral.identifier.uuidString])
  }
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?)
  {
    if self.currentPeripheral.contains(where: { (key: String, value: CBPeripheral) -> Bool in
      return key.compare(peripheral.identifier.uuidString) != .orderedSame
    }) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECT_FAILED, body: ["error": "peripheral not found with uuid:\(peripheral.identifier.uuidString)"])
      return
    }
    var body : [String : Any] = ["uuid": peripheral.identifier.uuidString]
    if let error = error {
      body["error"] = error.localizedDescription
    }
    self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECTED, body: body)
  }
  
  func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?)
  {
    self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["uuid": peripheral.identifier.uuidString, "error": error != nil ? error!.localizedDescription : "Unknow error"])
  }
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?)
  {
    if let err = error {
      self.sendEvent(withName: BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED, body: ["uuid": peripheral.identifier.uuidString, "error": err.localizedDescription])
      return
    }
  }
}
