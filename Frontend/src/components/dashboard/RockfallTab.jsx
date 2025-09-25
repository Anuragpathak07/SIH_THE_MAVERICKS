import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image, Video, Brain, Shield, AlertTriangle, CheckCircle, ArrowRight, Mountain, TrendingUp, Play, Camera, StopCircle, Bell, TrendingDown } from 'lucide-react';
import { useDashboard } from '../Dashboard';

export const RockfallTab = () => {
  const { 
    rockfallNotifications, 
    setRockfallNotifications, 
    liveData, 
    setLiveData, 
    confidenceHistory, 
    setConfidenceHistory 
  } = useDashboard();
  
  const [activeTab, setActiveTab] = useState('camera'); // 'video', or 'camera'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const fileInputRef = useRef(null);

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIntervalRef = useRef(null);

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Reset live prediction states
      setLiveData([]);
      setRockfallNotifications({ riskLevel: null, rockSize: null, trajectory: null, recommendations: [] });
      setConfidenceHistory([]);

      // Set camera active state for other components
      localStorage.setItem('rockfallCameraActive', 'true');
      localStorage.setItem('rockfallCameraStream', 'active');
      
      // Dispatch event for LiveMonitoring to listen
      window.dispatchEvent(new CustomEvent('rockfallCameraToggle', {
        detail: { active: true, stream: mediaStream }
      }));

      // Start frame capture every 1 second
      frameIntervalRef.current = setInterval(() => {
        captureFrame();
      }, 1000);

    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }
    
    setIsCameraActive(false);
    
    // Remove camera active state
    localStorage.removeItem('rockfallCameraActive');
    localStorage.removeItem('rockfallCameraStream');
    
    // Dispatch event for LiveMonitoring to listen
    window.dispatchEvent(new CustomEvent('rockfallCameraToggle', {
      detail: { active: false, stream: null }
    }));
    
    // Keep results data for review after stopping camera
  };

  // No need for localStorage loading - React context handles state persistence
  useEffect(() => {
    // Keep camera state handling for hardware management
    const handleBeforeUnload = () => {
      if (isCameraActive) {
        // Only keep essential camera flags for hardware cleanup
        localStorage.setItem('rockfallCameraActive', 'true');
      } else {
        localStorage.removeItem('rockfallCameraActive');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isCameraActive]);

  // No longer need to save to localStorage - React context handles state
  // Remove localStorage functionality completely

  // Helper functions for priority comparison
  const getRiskPriority = (risk) => {
    const priorities = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return priorities[risk?.toLowerCase()] || 0;
  };

  const getRockSizePriority = (size) => {
    const priorities = { 'large': 3, 'medium': 2, 'small': 1 };
    return priorities[size?.toLowerCase()] || 0;
  };

  const getTrajectoryPriority = (trajectory) => {
    const priorities = { 'unstable': 3, 'moderate': 2, 'stable': 1 };
    return priorities[trajectory?.toLowerCase()] || 0;
  };

  const updateNotifications = (data) => {
    const timestamp = Date.now();
    
    setConfidenceHistory(prev => {
      const newHistory = [...prev, { timestamp, confidence: data.confidence }];
      return newHistory.slice(-20);
    });

    setRockfallNotifications(prev => {
      const updates = {};
      
      // Update risk level - keep highest priority
      if (!prev.riskLevel || getRiskPriority(data.riskLevel) > getRiskPriority(prev.riskLevel)) {
        updates.riskLevel = data.riskLevel;
      }

      // Update rock size - keep largest
      if (!prev.rockSize || getRockSizePriority(data.rockSize) > getRockSizePriority(prev.rockSize)) {
        updates.rockSize = data.rockSize;
      }

      // Update trajectory - keep most unstable
      if (!prev.trajectory || getTrajectoryPriority(data.trajectory) > getTrajectoryPriority(prev.trajectory)) {
        updates.trajectory = data.trajectory;
      }

      // Update recommendations - add unique ones
      let updatedRecommendations = prev.recommendations;
      if (data.recommendations && data.recommendations.length > 0) {
        const existingRecs = new Set(prev.recommendations);
        const newRecs = data.recommendations.filter(rec => !existingRecs.has(rec));
        if (newRecs.length > 0) {
          updatedRecommendations = [...prev.recommendations, ...newRecs];
        }
      }

      const newNotifications = {
        ...prev,
        ...updates,
        recommendations: updatedRecommendations
      };
      
      return newNotifications;
    });
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append('file', blob, 'frame.jpg');
        
        try {
          const response = await fetch('http://127.0.0.1:8000/predict_frame', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('Frame prediction result:', result);
            
            if (result.success && result.data) {
              const frameData = {
                timestamp: Date.now(),
                ...result.data
              };
              
              // Add to live data (keep last 50 frames)
              setLiveData(prev => {
                const newData = [...prev, frameData];
                return newData.slice(-50);
              });
              
              // Update notifications
              updateNotifications(result.data);
            }
          }
        } catch (err) {
          console.error('Frame prediction error:', err);
          setError('Connection failed to prediction server');
        }
      }
    }, 'image/jpeg', 0.8);
  };


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file');
        return;
      }
      setUploadedFile(file);
      setError(null);
      setResults(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const isValidType = file.type.startsWith('video/');
      
      if (isValidType) {
        setUploadedFile(file);
        setError(null);
        setResults(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please upload a valid video file');
      }
    }
  };

  const processFile = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError(null);
    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const endpoint = 'predict_vedio';
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      const endTime = Date.now();
      setProcessingTime((endTime - startTime) / 1000);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setResults(result.analysis);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process file. Please check if the backend is running on http://localhost:8000');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'mid': 
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRockSizeColor = (rockSize) => {
    switch (rockSize?.toLowerCase()) {
      case 'small': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'mid': 
      case 'medium': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'large': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadedFilePreview(null);
    setResults(null);
    setError(null);
    setProcessingTime(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      if (activeTab === 'camera') {
        stopCamera();
      }
      setActiveTab(tab);
      resetUpload();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Rockfall Detection</h1>
        <p className="text-foreground/60 text-lg">AI-powered analysis of mine slope videos and live monitoring</p>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <Brain className="h-4 w-4 mr-2 text-primary" />
          <span className="text-primary font-medium">AI Analysis Ready</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="bg-card rounded-lg border p-1 flex">
            <button
              onClick={() => handleTabChange('camera')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'camera'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>Live Camera</span>
            </button>
            <button
              onClick={() => handleTabChange('video')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'video'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Video className="h-4 w-4" />
              <span>Upload Video</span>
            </button>
          </div>

          {/* Upload Area */}
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center">
              {activeTab === 'camera' ? (
                <>
                  <Camera className="h-5 w-5 mr-2 text-primary" />
                  Live Camera Feed
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2 text-primary" />
                  Upload Video
                </>
              )}
            </h3>

            {activeTab === 'camera' ? (
              <div className="space-y-4">
                {/* Camera Feed */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 bg-black rounded-lg object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <Camera className="h-16 w-16 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex gap-3">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Camera</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <StopCircle className="h-4 w-4" />
                      <span>Stop Camera</span>
                    </button>
                  )}
                </div>

                {isCameraActive && (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-green-400 font-medium">Live Monitoring Active</p>
                      </div>
                      <p className="text-green-300 text-sm mt-1">
                        Analyzing frames every second • Anomaly-based segmentation enabled
                      </p>
                    </div>

                     {liveData.length > 0 && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 font-medium">Frames Analyzed</span>
                          <span className="text-blue-300 font-bold">{liveData.length}</span>
                        </div>
                      </div>
                    )}

                    {/* Clear Results Button when camera is stopped */}
                     {!isCameraActive && liveData.length > 0 && (
                       <button
                          onClick={() => {
                           setLiveData([]);
                           const clearedNotifications = { riskLevel: null, rockSize: null, trajectory: null, recommendations: [] };
                           setRockfallNotifications(clearedNotifications);
                           setConfidenceHistory([]);
                          }}
                         className="w-full mt-3 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                       >
                         <span>Clear Results</span>
                       </button>
                     )}
                  </div>
                )}
              </div>
            ) : !uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="space-y-4">
                  <Video className="h-12 w-12 mx-auto text-primary group-hover:scale-110 transition-transform" />
                  
                  <div>
                    <h4 className="text-lg font-medium text-foreground">
                      Drop your video here
                    </h4>
                    <p className="text-foreground/60 mt-2">
                      or <span className="text-primary font-medium">click to browse</span>
                    </p>
                    <p className="text-sm text-foreground/40 mt-2">
                      Supports: MP4, AVI, MOV, WEBM (Max 100MB)
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Info */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Video className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-foreground/60">{formatFileSize(uploadedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* File Preview */}
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    src={uploadedFilePreview}
                    controls
                    className="w-full h-64 object-contain"
                  />
                </div>

                {/* Process Button */}
                <button
                  onClick={processFile}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      <span>Analyze Video</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400 font-medium">Error</p>
              </div>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {/* Results Section */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400 font-medium">Error</p>
              </div>
              <p className="text-red-300 mt-1">{error}</p>
            </div>
          )}

          {/* Live Notifications */}
          {activeTab === 'camera' && (rockfallNotifications.riskLevel || rockfallNotifications.rockSize || rockfallNotifications.trajectory || rockfallNotifications.recommendations.length > 0) && (
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                {isCameraActive ? 'Live Alerts & Notifications' : 'Camera Analysis Results'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Risk Level */}
                {rockfallNotifications.riskLevel && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center text-sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Risk Level
                    </h4>
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border font-medium text-sm ${getRiskLevelColor(rockfallNotifications.riskLevel)}`}>
                      {rockfallNotifications.riskLevel?.toLowerCase() === 'low' && <CheckCircle className="h-3 w-3 mr-2" />}
                      {(rockfallNotifications.riskLevel?.toLowerCase() === 'medium' || rockfallNotifications.riskLevel?.toLowerCase() === 'high') && <AlertTriangle className="h-3 w-3 mr-2" />}
                      {rockfallNotifications.riskLevel?.toLowerCase() === 'critical' && <AlertTriangle className="h-3 w-3 mr-2" />}
                      {rockfallNotifications.riskLevel}
                    </div>
                  </div>
                )}

                {/* Rock Size */}
                {rockfallNotifications.rockSize && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center text-sm">
                      <Mountain className="h-4 w-4 mr-2" />
                      Rock Size
                    </h4>
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border font-medium text-sm ${getRockSizeColor(rockfallNotifications.rockSize)}`}>
                      {rockfallNotifications.rockSize}
                    </div>
                  </div>
                )}

                {/* Trajectory */}
                {rockfallNotifications.trajectory && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center text-sm">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Trajectory
                    </h4>
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border font-medium text-sm ${
                      rockfallNotifications.trajectory?.toLowerCase() === 'stable' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      rockfallNotifications.trajectory?.toLowerCase() === 'moderate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {rockfallNotifications.trajectory}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {rockfallNotifications.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground flex items-center text-sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Active Recommendations
                  </h4>
                  <div className="space-y-2">
                    {rockfallNotifications.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-muted/30 rounded-lg">
                        <ArrowRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-foreground text-xs">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Camera Confidence Graph */}
          {activeTab === 'camera' && confidenceHistory.length > 0 && (
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center mb-4">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                {isCameraActive ? 'Live Confidence Graph' : 'Confidence History'}
              </h3>
              <div className="relative h-32 bg-muted/20 rounded-lg p-4">
                <svg className="w-full h-full" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Smooth curve path */}
                  <path
                    d={confidenceHistory.length > 1 ? (() => {
                      const points = confidenceHistory.map((point, idx) => ({
                        x: (idx / (confidenceHistory.length - 1)) * 400,
                        y: 100 - point.confidence
                      }));
                      
                      // Create smooth curve using quadratic bezier curves
                      let path = `M ${points[0].x} ${points[0].y}`;
                      
                      for (let i = 1; i < points.length; i++) {
                        const prevPoint = points[i - 1];
                        const currentPoint = points[i];
                        
                        if (i === 1) {
                          // First curve segment
                          const midX = (prevPoint.x + currentPoint.x) / 2;
                          const midY = (prevPoint.y + currentPoint.y) / 2;
                          path += ` Q ${prevPoint.x} ${prevPoint.y} ${midX} ${midY}`;
                        } else if (i === points.length - 1) {
                          // Last curve segment
                          path += ` Q ${currentPoint.x} ${currentPoint.y} ${currentPoint.x} ${currentPoint.y}`;
                        } else {
                          // Middle curve segments
                          const midX = (prevPoint.x + currentPoint.x) / 2;
                          const midY = (prevPoint.y + currentPoint.y) / 2;
                          path += ` Q ${currentPoint.x} ${currentPoint.y} ${midX} ${midY}`;
                        }
                      }
                      
                      return path;
                    })() : ''}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-sm"
                  />
                  
                  {/* Area fill under the curve */}
                  {confidenceHistory.length > 1 && (
                    <path
                      d={(() => {
                        const points = confidenceHistory.map((point, idx) => ({
                          x: (idx / (confidenceHistory.length - 1)) * 400,
                          y: 100 - point.confidence
                        }));
                        
                        let path = `M ${points[0].x} ${points[0].y}`;
                        
                        for (let i = 1; i < points.length; i++) {
                          const prevPoint = points[i - 1];
                          const currentPoint = points[i];
                          
                          if (i === 1) {
                            const midX = (prevPoint.x + currentPoint.x) / 2;
                            const midY = (prevPoint.y + currentPoint.y) / 2;
                            path += ` Q ${prevPoint.x} ${prevPoint.y} ${midX} ${midY}`;
                          } else if (i === points.length - 1) {
                            path += ` Q ${currentPoint.x} ${currentPoint.y} ${currentPoint.x} ${currentPoint.y}`;
                          } else {
                            const midX = (prevPoint.x + currentPoint.x) / 2;
                            const midY = (prevPoint.y + currentPoint.y) / 2;
                            path += ` Q ${currentPoint.x} ${currentPoint.y} ${midX} ${midY}`;
                          }
                        }
                        
                        // Close the path to create area
                        const lastPoint = points[points.length - 1];
                        path += ` L ${lastPoint.x} 100 L ${points[0].x} 100 Z`;
                        
                        return path;
                      })()}
                      fill="url(#confidenceGradient)"
                    />
                  )}
                  
                  {/* Subtle glow dots on data points - minimal for smooth look */}
                  {confidenceHistory.map((point, idx) => (
                    <circle
                      key={idx}
                      cx={(idx / (confidenceHistory.length - 1 || 1)) * 400}
                      cy={100 - point.confidence}
                      r="2"
                      fill="hsl(var(--primary))"
                      className="opacity-60"
                      style={{
                        filter: 'drop-shadow(0 0 2px hsl(var(--primary)))'
                      }}
                    />
                  ))}
                </svg>
                <div className="absolute bottom-0 left-0 text-xs text-foreground/60">0%</div>
                <div className="absolute top-0 left-0 text-xs text-foreground/60">100%</div>
                <div className="absolute bottom-0 right-0 text-xs text-foreground/60">Latest</div>
              </div>
            </div>
          )}

          {activeTab === 'video' && results && (
            <div className="bg-card rounded-lg border p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">Analysis Results</h3>
                {processingTime && (
                  <div className="text-sm text-foreground/60">
                    Processed in {processingTime.toFixed(2)}s
                  </div>
                )}
              </div>

              {/* Risk Level */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Risk Assessment
                </h4>
                <div className={`inline-flex items-center px-3 py-2 rounded-lg border font-medium ${getRiskLevelColor(results.riskLevel)}`}>
                  {results.riskLevel?.toLowerCase() === 'low' && <CheckCircle className="h-4 w-4 mr-2" />}
                  {(results.riskLevel?.toLowerCase() === 'medium' || results.riskLevel?.toLowerCase() === 'high') && <AlertTriangle className="h-4 w-4 mr-2" />}
                  {results.riskLevel?.toLowerCase() === 'critical' && <AlertTriangle className="h-4 w-4 mr-2" />}
                  {results.riskLevel || 'Unknown'} Risk
                </div>
              </div>

              {/* Confidence */}
              {results.confidence && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Confidence Level
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${results.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">{results.confidence}%</span>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {results.recommendations && results.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center">
                    <Mountain className="h-4 w-4 mr-2" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-foreground text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Analysis */}
              {results.details && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Detailed Analysis</h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground/80 text-sm leading-relaxed">{results.details}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && !results && (
            <div className="bg-card rounded-lg border p-8 text-center">
              <Brain className="h-16 w-16 mx-auto text-primary/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready for Analysis</h3>
              <p className="text-foreground/60">
                Upload a video to get AI-powered rockfall prediction results.
              </p>
            </div>
          )}

          {activeTab === 'camera' && !isCameraActive && (
            <div className="bg-card rounded-lg border p-8 text-center">
              <Brain className="h-16 w-16 mx-auto text-primary/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready for Analysis</h3>
              <p className="text-foreground/60">
                Start your camera for live monitoring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};