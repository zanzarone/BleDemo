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
RCT_EXTERN_METHOD(status:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(startScan:(NSArray*)serviceUUIDs opt:(NSDictionary*)options)
RCT_EXTERN_METHOD(stopScan)

@end

