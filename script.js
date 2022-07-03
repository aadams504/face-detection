const video = document.getElementById('video')


const startCamera = () => {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

Promise.all([
    // Small/Quick face detector
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    // Locate different parts of face
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    // Locate face
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    // Recognize emotions
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startCamera)

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().
            withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})