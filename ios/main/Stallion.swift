import Foundation

@objc(Stallion)
class Stallion: NSObject {
    @objc(downloadPackage:withResolver:withRejecter:)
    func downloadPackage(bundleInfo: NSDictionary, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let receivedBucketId = bundleInfo.value(forKey: StallionConstants.DownloadReqBodyKeys.BucketId) else {return}
        let receivedVersion = bundleInfo.value(forKey: StallionConstants.DownloadReqBodyKeys.Version) as? Int ?? nil
        let bucketId = receivedBucketId as? String ?? ""
        var reqJson: [String: Any] = [
            StallionConstants.DownloadReqBodyKeys.BucketId: bucketId,
            StallionConstants.DownloadReqBodyKeys.Platform: StallionConstants.PlatformValue,
        ]
        if (receivedVersion != nil) {
            reqJson[StallionConstants.DownloadReqBodyKeys.Version] = receivedVersion
        }
        guard let fromUrl = URL(string: StallionConstants.DownloadApiUrl) else { return }
        StallionDownloader.load(
            url: fromUrl,
            reqBody: reqJson,
            completion: {
                resolve(StallionConstants.DownloadPromiseResponses.Success)
                StallionUtil.setLs(key: StallionUtil.LSKeys.bucketKey, value: bucketId)
                if let receivedVersion {
                    StallionUtil.setLs(key: StallionUtil.LSKeys.versionKey, value: String(receivedVersion))
                }
            },
            onError: {errorString in
                reject("500", errorString, NSError(domain: errorString, code: 500))
            }
        )
    }
    
    @objc(toggleStallionSwitch:)
    func toggleStallionSwitch(isOn: Bool) {
        StallionUtil.setLs(key: StallionUtil.LSKeys.switchStateKey, value: isOn ? StallionUtil.SwitchStates.ON : StallionUtil.SwitchStates.OFF)
    }
    
    @objc(getAuthTokens:)
    func getAuthTokens(_ callback: RCTResponseSenderBlock) {
        var authDictionary = [String:Any]()
        authDictionary[StallionConstants.AuthTokens.ApiKey] = StallionConstants.apiKey
        authDictionary[StallionConstants.AuthTokens.SecretKey] = StallionConstants.secretKey
        let stallionAuth = NSDictionary(dictionary: authDictionary)
        callback([stallionAuth])
    }
    
    @objc(getStallionMeta:)
    func getStallionMeta(_ callback: RCTResponseSenderBlock) {
        var metaDictionary = [String:Any]()
        metaDictionary[StallionUtil.LSKeys.bucketKey] = StallionUtil.getLs(key: StallionUtil.LSKeys.bucketKey)
        metaDictionary[StallionUtil.LSKeys.versionKey] = StallionUtil.getLs(key: StallionUtil.LSKeys.versionKey)
        metaDictionary[StallionUtil.LSKeys.switchStateKey] = StallionUtil.getLs(key: StallionUtil.LSKeys.switchStateKey) == StallionUtil.SwitchStates.ON
        let stallionMeta = NSDictionary(dictionary: metaDictionary)
        callback([stallionMeta])
    }
}
