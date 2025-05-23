/* eslint-disable import/no-unresolved */
import { ZegoExpressEngine } from 'zego-express-engine-webrtc'

import { ZegoDeviceUpdateType, ZegoMediaOptions, ZegoUser } from './ZegoExpressManager.entity'

export declare class ZegoExpressManager {
  private participantDic
  private streamDic
  private localParticipant
  private roomID
  private streamMap
  private mediaOptions
  private deviceUpdateCallback
  static shared: ZegoExpressManager
  static engine: ZegoExpressEngine
  private constructor()
  static getEngine(): ZegoExpressEngine
  createEngine(appID: number, server: string): void
  checkWebRTC(): Promise<boolean>
  checkCamera(): Promise<boolean>
  checkMicrophone(): Promise<boolean>
  joinRoom(roomID: string, token: string, user: ZegoUser, options?: ZegoMediaOptions[]): Promise<boolean>
  enableCamera(enable: boolean): boolean
  enableMic(enable: boolean): boolean
  getLocalVideoView(): HTMLMediaElement
  getRemoteVideoView(userID: string): HTMLMediaElement
  leaveRoom(): void
  onRoomUserUpdate(fun: (updateType: 'DELETE' | 'ADD', userList: string[], roomID: string) => void): boolean
  onRoomUserDeviceUpdate(fun: (updateType: ZegoDeviceUpdateType, userID: string, roomID: string) => void): boolean
  onRoomTokenWillExpire(fun: (roomID: string) => void): boolean
  private playStream
  private generateStreamID
  private generateVideoView
  private onOtherEvent
  private renderViewHandle
  private transFlutterData
}
