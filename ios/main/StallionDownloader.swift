//
//  StallionDownloader.swift
//  react-native-stallion
//
//  Created by Thor963 on 17/05/23.
//
import Foundation
import ZIPFoundation

enum StallionError: Error {
    case runtimeError(String)
}

class StallionDownloader: NSObject {
    
    private lazy var urlSession = URLSession(configuration: .default,
                                                 delegate: self,
                                                 delegateQueue: nil)
    
    var downloadTask : URLSessionDownloadTask?;
    var reqJson: [String: Any]?;
    
    var _resolve: RCTPromiseResolveBlock?;
    var _reject: RCTPromiseRejectBlock?;
    
    override init() {
        super.init()
    }

    func load(url: URL, reqBody: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) throws {
            self.reqJson = reqBody
            let reqBody = try? JSONSerialization.data(withJSONObject: reqBody)
            self._resolve = resolve
            self._reject = reject
            
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.httpBody = reqBody
            
            request.setValue(StallionConstants.apiKey, forHTTPHeaderField: StallionConstants.HeaderKeys.ApiKey)
            request.setValue(StallionConstants.secretKey, forHTTPHeaderField: StallionConstants.HeaderKeys.SecretKey)
            request.setValue("application/json", forHTTPHeaderField: StallionConstants.HeaderKeys.ContentType)
        
            let task = urlSession.downloadTask(with: request)
            task.resume()
            self.downloadTask = task
    }
}

extension StallionDownloader: URLSessionDownloadDelegate {

    func urlSession(_ session: URLSession,
                    downloadTask: URLSessionDownloadTask,
                    didWriteData bytesWritten: Int64,
                    totalBytesWritten: Int64,
                    totalBytesExpectedToWrite: Int64) {
        if downloadTask == self.downloadTask {
            let calculatedProgress = Float(totalBytesWritten) / Float(totalBytesExpectedToWrite)
            DispatchQueue.main.async {
                print("progress: \(calculatedProgress)))")
                Stallion.shared?.sendEvent(withName: StallionConstants.DOWNLOAD_PROGRESS_EVENT, body: calculatedProgress)
            }
        }
    }
    
    func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask,
                    didFinishDownloadingTo location: URL) {
        
        let response = downloadTask.response as? HTTPURLResponse
        
        if (response?.statusCode == 200) {
            do  {
                let tempDownloadDirectory = try FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
                    .appendingPathComponent(StallionConstants.FilePaths.DownloadDirectory, isDirectory: true)
                
                if !FileManager.default.fileExists(atPath: tempDownloadDirectory.path) {
                    try FileManager.default.createDirectory(atPath: tempDownloadDirectory.path, withIntermediateDirectories: true, attributes: nil)
                }
                
                let finalDestinationDirectory = try FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
                    .appendingPathComponent(StallionConstants.FilePaths.TargetDirectory, isDirectory: true)
                
                let downloadedBuildDirectory = tempDownloadDirectory.appendingPathComponent(StallionConstants.FilePaths.ZipFolderName, isDirectory: true)
                
                let downloadedZipFilePath = tempDownloadDirectory.appendingPathComponent(StallionConstants.FilePaths.ZipFolderName, isDirectory: false).appendingPathExtension(StallionConstants.FilePaths.ZipExtension)
            
                let fileManager = FileManager()
                
                // if zip already exists, delete the zip
                if FileManager.default.fileExists(atPath: downloadedZipFilePath.path) {
                    try fileManager.removeItem(at: downloadedZipFilePath)
                }
                try FileManager.default.copyItem(at: location, to: downloadedZipFilePath)
                
                // if build already exists in download folder, delete it
                if FileManager.default.fileExists(atPath: downloadedBuildDirectory.path) {
                    try fileManager.removeItem(at: downloadedBuildDirectory)
                }
                try fileManager.unzipItem(at: downloadedZipFilePath, to: tempDownloadDirectory, skipCRC32: false, progress: nil, preferredEncoding: nil)
                try fileManager.removeItem(at: downloadedZipFilePath)
                
                // if build exists in final destination, ovverride it
                if FileManager.default.fileExists(atPath: finalDestinationDirectory.path) {
                    try fileManager.removeItem(at: finalDestinationDirectory)
                }
                try fileManager.moveItem(at: tempDownloadDirectory, to: finalDestinationDirectory)
                let bucketId =  self.reqJson?[StallionConstants.DownloadReqBodyKeys.BucketId] as? String ?? ""
                let receivedVersion =  self.reqJson?[StallionConstants.DownloadReqBodyKeys.Version] as? Int ?? -1
                StallionUtil.setLs(key: StallionUtil.LSKeys.bucketKey, value: bucketId)
                if receivedVersion > -1 {
                    StallionUtil.setLs(key: StallionUtil.LSKeys.versionKey, value: String(receivedVersion))
                }
                self._resolve?(StallionConstants.DownloadPromiseResponses.Success)
            } catch {
                // throw exception here
                let errorString = StallionConstants.DownloadPromiseResponses.FileSystemError
                self._reject?("500", errorString, NSError(domain: errorString, code: 500))
            }
        }
    }
}

