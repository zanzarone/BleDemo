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
let BLE_PERIPHERAL_READ_RSSI                    : String  = "BLE_PERIPHERAL_READ_RSSI"
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

class Peripheral {
  private var gattServer          : CBPeripheral!
  private var services            : [String:CBService] = [:]
  private var characteristics     : [String:CBCharacteristic] = [:]

  init(_ p:CBPeripheral) {
    gattServer = p
  }
  
  func getGATTServer() -> CBPeripheral {
    return self.gattServer
  }
  
  func discoverServices(_ servicesUUIDs:[CBUUID]?) {
    self.gattServer.discoverServices(servicesUUIDs)
  }
  
  func servicesDiscovered() -> Int {
    return services.count
  }
  
  func setServicesAndDiscoverCharacteristics(_ s:[CBService]){
    for i in 0..<s.count {
      let service = s[i]
      self.services[service.uuid.uuidString] = service
    }
    for entry in self.services {
      let service = entry.value
      self.gattServer.discoverCharacteristics([], for: service)
    }
  }
  
  func setCharacteristics(_ c:[CBCharacteristic], forServiceUUID uuid: String){
    for i in 0..<c.count {
      let characteristic = c[i]
      self.characteristics[characteristic.uuid.uuidString] = characteristic
    }
    services.removeValue(forKey: uuid)
  }
  
  func flush() {
    self.characteristics.removeAll()
  }

  func readCharacteristic(_ uuid:String){
    if let ch = self.characteristics[uuid] {
      self.gattServer.readValue(for: ch)
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }

  func writeCharacteristic(_ uuid:String, value:NSArray){
    if let ch = self.characteristics[uuid] {
      var array : [UInt8] = []
      for i in 0..<value.count {
        array.append(value[i] as! UInt8)
      }
      self.gattServer.writeValue(Data(array), for: ch, type: .withResponse)
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }

  func changeCharacteristicNotification(_ uuid:String, enable:Bool) {
    if let ch = self.characteristics[uuid] {
      self.gattServer.setNotifyValue(enable, for: ch)
    }else{
      /// ERRORE DA CONTROLLARE
    }
  }
  
  func isNotifying(_ uuid:String) -> Bool{
    if let ch = self.characteristics[uuid] {
      return ch.isNotifying
    }else{
      /// ERRORE DA CONTROLLARE
      return false
    }
  }
}

@objc(BluetoothZ)
class BluetoothZ: RCTEventEmitter, CBCentralManagerDelegate, CBPeripheralDelegate
{
  /// PROPS
  var centralManager        : CBCentralManager? = nil
  var found                 : [CBPeripheral] = []
  var connectedPeripherals  : [String:Peripheral] = [:]
  var connectionTimer       : Timer? = nil
  var scanFilter            : String? = nil
  
  private func isConnected(uuidString:String) -> Bool {
    return self.connectedPeripherals.contains(where: { (key: String, value: Peripheral) -> Bool in
      return key.compare(uuidString) == .orderedSame
    })
  }

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
      BLE_PERIPHERAL_READ_RSSI,
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
      BLE_PERIPHERAL_READ_RSSI:BLE_PERIPHERAL_READ_RSSI,
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
  
  @objc(startScan:filter:)
  func startScan(_ serviceUUIDs: [String]? = nil, filter:String? = nil)
  {
    /// ("========================>>>> startScan")
    var services : [CBUUID] = []
    if let uuids = serviceUUIDs{
      for uuid in uuids {
        services.append(CBUUID(string: uuid))
      }
    }
    self.scanFilter = filter
    self.centralManager?.scanForPeripherals(withServices: services, options: nil)
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
      if self.isConnected(uuidString: uuidString) {
        return
      }
      let _peripherals : [CBPeripheral]? = self.centralManager?.retrievePeripherals(withIdentifiers:[uuid])
      if let peripherals = _peripherals , peripherals.count > 0 {
        let p : Peripheral = Peripheral(_peripherals!.first!)
        self.connectedPeripherals[uuidString] = p
        self.centralManager?.connect(p.getGATTServer(), options: nil)
        self.connectionTimer = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: false) { timer in
          self.centralManager?.cancelPeripheralConnection(p.getGATTServer())
          self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["error":  "could not find devices with id \(uuidString)."])
        }
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
    if !self.isConnected(uuidString: uuidString) {
      /// i need to disconnect the current device before attempting a new connection
      return
    }
    let p : Peripheral = self.connectedPeripherals[uuidString]!
    self.centralManager?.cancelPeripheralConnection(p.getGATTServer())
    self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECTED, body: ["uuid": uuidString])
  }
  
  @objc(readCharacteristicValue:charUUID:)
  func readCharacteristicValue(_ uuid:String, charUUID:String)
  {
    /// ("========================>>>> readCharacteristicValue")
    if !self.isConnected(uuidString: uuid) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED, body: ["uuid": uuid, "error": "peripheral not found with uuid:\(uuid)"])
      return
    }
    let p : Peripheral = self.connectedPeripherals[uuid]!
    p.readCharacteristic(charUUID)
  }
  
  @objc(changeCharacteristicNotification:charUUID:enable:)
  func changeCharacteristicNotification(_ uuid:String, charUUID:String, enable:Bool)
  {
    if !self.isConnected(uuidString: uuid) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED, body: ["uuid": uuid, "error": "peripheral not found with uuid:\(uuid)"])
      return
    }
    let p : Peripheral = self.connectedPeripherals[uuid]!
    p.changeCharacteristicNotification(charUUID, enable: enable)
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
      var niceFind = true
      if let pattern = self.scanFilter
      {
        let range = NSRange(location: 0, length: peripheral.identifier.uuidString.count)
        let regex = try! NSRegularExpression(pattern: pattern)
        niceFind = regex.firstMatch(in: peripheral.identifier.uuidString, options: [], range: range) != nil
      }
      if niceFind {
        self.sendEvent(withName: BLE_PERIPHERAL_FOUND, body: ["uuid":  peripheral.identifier.uuidString , "name":  peripheral.name!, "rssi": RSSI])
      }
    }
  }
  
  func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral)
  {
    if self.connectionTimer != nil
    {
      self.connectionTimer?.invalidate()
      self.connectionTimer = nil
    }
    if !self.isConnected(uuidString: peripheral.identifier.uuidString) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body: ["uuid": peripheral.identifier.uuidString, "error": "peripheral not found with uuid:\(peripheral.identifier.uuidString)"])
      return
    }
    self.sendEvent(withName: BLE_PERIPHERAL_CONNECTED, body: ["uuid": peripheral.identifier.uuidString])
    let p = self.connectedPeripherals[peripheral.identifier.uuidString]!
    p.discoverServices([])
  }
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?)
  {
    if self.connectionTimer != nil
    {
      self.connectionTimer?.invalidate()
      self.connectionTimer = nil
    }
    if !self.isConnected(uuidString: peripheral.identifier.uuidString) {
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECT_FAILED, body: ["uuid": peripheral.identifier.uuidString,"error": "peripheral not found with uuid:\(peripheral.identifier.uuidString)"])
      return
    }
    var body : [String : Any] = ["uuid": peripheral.identifier.uuidString]
    if let error = error {
      body["error"] = error.localizedDescription
    }
    self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECTED, body: body)
    let p = self.connectedPeripherals[peripheral.identifier.uuidString]!
    p.flush()
  }
  
  func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?)
  {
    if !self.isConnected(uuidString: peripheral.identifier.uuidString){
      /// i need to disconnect the current device before attempting a new connection
      self.sendEvent(withName: BLE_PERIPHERAL_DISCONNECT_FAILED, body: ["uuid": peripheral.identifier.uuidString,"error": "peripheral not found with uuid:\(peripheral.identifier.uuidString)"])
      return
    }
    var body : [String : Any] = ["uuid": peripheral.identifier.uuidString]
    if let error = error {
      body["error"] = error.localizedDescription
    }
    self.sendEvent(withName: BLE_PERIPHERAL_CONNECT_FAILED, body:body)
    let p = self.connectedPeripherals[peripheral.identifier.uuidString]!
    p.flush()
  }
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?)
  {
    if let err = error {
      self.sendEvent(withName: BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED, body: ["uuid": peripheral.identifier.uuidString, "error": err.localizedDescription])
      return
    }
    let p = self.connectedPeripherals[peripheral.identifier.uuidString]!
    if let services = peripheral.services {
      p.setServicesAndDiscoverCharacteristics(services)
    }
  }
  
  func peripheral(_ _peripheral:CBPeripheral, didDiscoverCharacteristicsFor service:CBService, error: Error?){
    if let err = error {
      self.sendEvent(withName: BLE_PERIPHERAL_DISCOVER_SERVICES_FAILED, body: ["uuid": _peripheral.identifier.uuidString, "error": err.localizedDescription])
      return
    }
    let p = self.connectedPeripherals[_peripheral.identifier.uuidString]!
    if let characteristics = service.characteristics {
      p.setCharacteristics(characteristics, forServiceUUID: service.uuid.uuidString)
      if p.servicesDiscovered() <= 0 {
        self.sendEvent(withName: BLE_PERIPHERAL_READY, body: ["uuid": _peripheral.identifier.uuidString])
      }
    }
  }
  
  func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
    let p = self.connectedPeripherals[peripheral.identifier.uuidString]!
    let charUUID = characteristic.uuid.uuidString
    if let err = error {
      self.sendEvent(withName: p.isNotifying(charUUID) ? BLE_PERIPHERAL_NOTIFICATION_CHANGED : BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED, body: ["uuid": peripheral.identifier.uuidString, "error": err.localizedDescription])
      return
    }
    self.sendEvent(withName: p.isNotifying(charUUID) ? BLE_PERIPHERAL_NOTIFICATION_CHANGED : BLE_PERIPHERAL_CHARACTERISTIC_READ_OK, body: ["uuid": peripheral.identifier.uuidString,"charUUID": charUUID, "value": characteristic.value ?? Data()])
  }
  
  func peripheral(_ peripheral: CBPeripheral, didReadRSSI RSSI: NSNumber, error: Error?){
    self.sendEvent(withName:  BLE_PERIPHERAL_READ_RSSI, body: ["uuid": peripheral.identifier.uuidString, "rssi": RSSI])
  }
}
