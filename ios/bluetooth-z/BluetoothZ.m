//
//  BluetoothZ.m
//  BleDemo
//
//  Created by Vecchio on 30/03/23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(BluetoothZ, NSObject)

RCT_EXTERN_METHOD(setup)
RCT_EXTERN_METHOD(status:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(startScan:(NSArray*)serviceUUIDs filter:(NSString*)f options:(NSDictionary*)opt)
RCT_EXTERN_METHOD(stopScan)
RCT_EXTERN_METHOD(connect:(NSString*)uuidString)
RCT_EXTERN_METHOD(disconnect:(NSString*)uuidString)
RCT_EXTERN_METHOD(discover:(NSString*)uuidString)

@end

