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
let BLE_PERIPHERAL_READY                    : String  = "BLE_PERIPHERAL_READY"
let BLE_PERIPHERAL_CONNECTED                    : String  = "BLE_PERIPHERAL_CONNECTED"
let BLE_PERIPHERAL_DISCONNECTED                 : String  = "BLE_PERIPHERAL_DISCONNECTED"
let BLE_PERIPHERAL_CONNECT_FAILED               : String  = "BLE_PERIPHERAL_CONNECT_FAILED"
let BLE_PERIPHERAL_DISCONNECT_FAILED            : String  = "BLE_PERIPHERAL_DISCONNECT_FAILED"
let BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED     : String  = "BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED"
let BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED    : String  = "BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED"
let BLE_PERIPHERAL_CHARACTERISTIC_READ_OK       : String  = "BLE_PERIPHERAL_CHARACTERISTIC_READ_OK"
let BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED   : String  = "BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED"
let BLE_PERIPHERAL_CHARACTERISTIC_WRITE_OK      : String  = "BLE_PERIPHERAL_CHARACTERISTIC_WRITE_OK"
let BLE_PERIPHERAL_CHARACTERISTIC_WRITE_FAILED  : String  = "BLE_PERIPHERAL_CHARACTERISTIC_WRITE_FAILED"
let BLE_PERIPHERAL_NOTIFICATION_UPDATES         : String  = "BLE_PERIPHERAL_NOTIFICATION_UPDATES"
let BLE_PERIPHERAL_NOTIFICATION_CHANGED         : String  = "BLE_PERIPHERAL_NOTIFICATION_CHANGED"
let BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED   : String  = "BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED"

/// ==============
let BLE_ADAPTER_ALLOW_DUPLICATES            : String  = CBCentralManagerScanOptionAllowDuplicatesKey
let BLE_ADAPTER_SOLICITED_SERVICE           : String  = CBCentralManagerScanOptionSolicitedServiceUUIDsKey

class Peripheral {
  var adapter             : CBPeripheral?
  var discoveredServices  : [String] = []
  var characteristics     : [String:CBCharacteristic] = [:]

  init(_ p:CBPeripheral) {
    adapter = p
  }
  
  func discover() {
    if let p = self.adapter{
      p.discoverServices([])
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }
  
  func collectServicesAndDiscoverCharacteristics() {
    if let p = self.adapter, let services = p.services{
      for service in services {
        self.discoveredServices.append(service.uuid.uuidString)
        p.discoverCharacteristics([], for: service)
      }
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }
  
  func connect(_ manager:CBCentralManager) {
    if let p = self.adapter{
      manager.connect(p)
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }
  
  func disconnect(_ manager:CBCentralManager) {
    if let p = self.adapter{
      manager.cancelPeripheralConnection(p)
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }
  
  func flush() {
    self.discoveredServices.removeAll()
    self.characteristics.removeAll()
  }
  
  func setCharacteristic(_ c:CBCharacteristic){
    self.characteristics[c.uuid.uuidString] = c
  }
  
  func readCharacteristic(_ uuid:String){
    if let p = self.adapter, let ch = self.characteristics[uuid] {
      p.readValue(for: ch)
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }
  
  func writeCharacteristic(_ uuid:String, value:NSArray){
    if let p = self.adapter, let ch = self.characteristics[uuid] {
      var array : [UInt8] = []
      for i in 0..<value.count {
        array.append(value[i] as! UInt8)
      }
      p.writeValue(Data(array), for: ch, type: .withResponse)
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }
  
  func changeCharacteristicNotification(_ uuid:String, enable:Bool) {
    if let p = self.adapter, let ch = self.characteristics[uuid] {
      p.setNotifyValue(enable, for: ch)
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }
}

@objc(BluetoothZ)
class BluetoothZ: RCTEventEmitter, CBCentralManagerDelegate, CBPeripheralDelegate
{
  /// PROPS
  var centralManager      : CBCentralManager? = nil
  var connectedPeripherals  : [String:Peripheral] = [:]
  var connectionTimer     : Timer? = nil
  
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
    return [
      BLE_ADAPTER_STATUS_DID_UPDATE,
      BLE_ADAPTER_STATUS_INVALID,
      BLE_ADAPTER_STATUS_POWERED_ON,
      BLE_ADAPTER_STATUS_POWERED_OFF,
      BLE_ADAPTER_STATUS_UNKNOW,
      BLE_PERIPHERAL_FOUND,
      BLE_PERIPHERAL_READY,
      BLE_PERIPHERAL_CONNECTED,
      BLE_PERIPHERAL_DISCONNECTED,
      BLE_PERIPHERAL_CONNECT_FAILED,
      BLE_PERIPHERAL_DISCONNECT_FAILED,
      BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED,
      BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED,
      BLE_PERIPHERAL_CHARACTERISTIC_READ_OK,
      BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED,
      BLE_PERIPHERAL_CHARACTERISTIC_WRITE_OK,
      BLE_PERIPHERAL_CHARACTERISTIC_WRITE_FAILED,
      BLE_PERIPHERAL_NOTIFICATION_UPDATES,
      BLE_PERIPHERAL_NOTIFICATION_CHANGED,
      BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED
    ]
  }
  
  @objc
  override func constantsToExport() -> [AnyHashable : Any]!
  {
    /// ("========================>>>> constantsToExport")

    return [
      BLE_ADAPTER_STATUS_DID_UPDATE:BLE_ADAPTER_STATUS_DID_UPDATE,
      BLE_ADAPTER_STATUS_INVALID:BLE_ADAPTER_STATUS_INVALID,
      BLE_ADAPTER_STATUS_POWERED_ON:BLE_ADAPTER_STATUS_POWERED_ON,
      BLE_ADAPTER_STATUS_POWERED_OFF:BLE_ADAPTER_STATUS_POWERED_OFF,
      BLE_ADAPTER_STATUS_UNKNOW:BLE_ADAPTER_STATUS_UNKNOW,
      BLE_PERIPHERAL_FOUND:BLE_PERIPHERAL_FOUND,
      BLE_PERIPHERAL_READY:BLE_PERIPHERAL_READY,
      BLE_PERIPHERAL_CONNECTED:BLE_PERIPHERAL_CONNECTED,
      BLE_PERIPHERAL_DISCONNECTED:BLE_PERIPHERAL_DISCONNECTED,
      BLE_PERIPHERAL_CONNECT_FAILED:BLE_PERIPHERAL_CONNECT_FAILED,
      BLE_PERIPHERAL_DISCONNECT_FAILED:BLE_PERIPHERAL_DISCONNECT_FAILED,
      BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED:BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED,
      BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED:BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED,
      BLE_PERIPHERAL_CHARACTERISTIC_READ_OK:BLE_PERIPHERAL_CHARACTERISTIC_READ_OK,
      BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED:BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED,
      BLE_PERIPHERAL_CHARACTERISTIC_WRITE_OK:BLE_PERIPHERAL_CHARACTERISTIC_WRITE_OK,
      BLE_PERIPHERAL_CHARACTERISTIC_WRITE_FAILED:BLE_PERIPHERAL_CHARACTERISTIC_WRITE_FAILED,
      BLE_PERIPHERAL_NOTIFICATION_UPDATES:BLE_PERIPHERAL_NOTIFICATION_UPDATES,
      BLE_PERIPHERAL_NOTIFICATION_CHANGED:BLE_PERIPHERAL_NOTIFICATION_CHANGED,
      BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED:BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED
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
      if self.connectedPeripherals.contains(where: { (key: String, value: Peripheral) -> Bool in
        return key.compare(uuidString) == .orderedSame
      }) {
        return
      }
      let _peripherals : [CBPeripheral]? = self.centralManager?.retrievePeripherals(withIdentifiers:[uuid])
      if let peripherals = _peripherals , peripherals.count > 0 {
        let p = Peripheral(peripherals.first!)
        self.connectedPeripherals[uuidString] = p
        p.connect(self.centralManager!)
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
    if self.connectedPeripherals.contains(where: { (key: String, value: Peripheral) -> Bool in
      return key.compare(uuidString) != .orderedSame
    }) {
      /// i need to disconnect the current device before attempting a new connection
      return
    }
    if let peripheral : Peripheral = self.connectedPeripherals[uuidString] {
      peripheral.disconnect(self.centralManager!)
      self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECTED, body: ["uuid": uuidString])
    }else{
      self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECT_FAILED, body: ["error": "peripheral not found with uuid:\(uuidString)"])
    }
  }
  
  @objc
  func discover(_ uuidString: String) -> Void
  {
    /// ("========================>>>> setup")
    if self.connectedPeripherals.contains(where: { (key: String, value: Peripheral) -> Bool in
      return key.compare(uuidString) != .orderedSame
    }) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED, body: ["error": "peripheral not found with uuid:\(uuidString)"])
      return
    }
//    let device = self.connectedPeripherals[uuidString]
//    device!.discover()
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
    if self.connectedPeripherals.contains(where: { (key: String, value: Peripheral) -> Bool in
      return key.compare(peripheral.identifier.uuidString) != .orderedSame
    }) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["error": "peripheral not found with uuid:\(peripheral.identifier.uuidString)"])
      return
    }
    self.sendEvent(withName: BLE_PERIPHERAL_CONNECTED, body: ["uuid": peripheral.identifier.uuidString])
    self.connectedPeripherals[peripheral.identifier.uuidString]!.discover()
  }
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?)
  {
    if self.connectedPeripherals.contains(where: { (key: String, value: Peripheral) -> Bool in
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
    self.connectedPeripherals[peripheral.identifier.uuidString]!.flush()
  }
  
  func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?)
  {
    if self.connectedPeripherals.contains(where: { (key: String, value: Peripheral) -> Bool in
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
    self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body:body)
    self.connectedPeripherals[peripheral.identifier.uuidString]!.flush()
  }
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?)
  {
    if let err = error {
      self.sendEvent(withName: BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED, body: ["uuid": peripheral.identifier.uuidString, "error": err.localizedDescription])
      return
    }
    self.connectedPeripherals[peripheral.identifier.uuidString]!.collectServicesAndDiscoverCharacteristics()
  }
  
  func peripheral(_ _peripheral:CBPeripheral, didDiscoverCharacteristicsFor service:CBService, error: Error?){
    if let err = error {
      self.sendEvent(withName: BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED, body: ["uuid": _peripheral.identifier.uuidString, "error": err.localizedDescription])
      return
    }
//    self.connectedPeripherals[_peripheral.identifier.uuidString]!.setCharacteristic()
    //    discoveredServices.removeAll(where: { (key: String) -> Bool in
//      return key.compare(service.uuid.uuidString) == .orderedSame
//    })
//    if discoveredServices.count <= 0 {
//      /// discover finished
//      self.sendEvent(withName: BLE_PERIPHERAL_READY, body: ["uuid": _peripheral.identifier.uuidString])
//    }
  }

}
