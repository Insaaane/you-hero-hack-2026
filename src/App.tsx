import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import './App.css'

type CameraStatus = 'idle' | 'starting' | 'ready'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [capturedAt, setCapturedAt] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const releaseCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  useEffect(() => {
    return () => {
      releaseCamera()
    }
  }, [])

  const rememberCaptureTime = () => {
    setCapturedAt(
      new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()),
    )
  }

  const startCamera = async () => {
    setMessage(null)
    setPhotoUrl(null)
    setCapturedAt(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage(
        'Прямой доступ к камере недоступен. Попробуйте кнопку системной камеры ниже.',
      )
      return
    }

    setCameraStatus('starting')
    releaseCamera()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setCameraStatus('ready')
    } catch (error) {
      releaseCamera()
      setCameraStatus('idle')
      setMessage(
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Браузер не дал доступ к камере. Проверьте разрешение и откройте страницу через HTTPS.'
          : 'Не удалось открыть камеру. На телефоне можно использовать системную камеру ниже.',
      )
    }
  }

  const takePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      setMessage('Камера еще не готова. Подождите секунду и попробуйте снова.')
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    if (!context) {
      setMessage('Браузер не смог подготовить снимок.')
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPhotoUrl(canvas.toDataURL('image/jpeg', 0.92))
    rememberCaptureTime()
    setMessage('Фото готово. Оно хранится только в текущем окне.')
    releaseCamera()
    setCameraStatus('idle')
  }

  const handleSystemCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result)
        rememberCaptureTime()
        setMessage('Фото готово. Оно хранится только в текущем окне.')
        releaseCamera()
        setCameraStatus('idle')
      }
    })

    reader.addEventListener('error', () => {
      setMessage('Не удалось открыть сделанный снимок.')
    })

    reader.readAsDataURL(file)
    event.currentTarget.value = ''
  }

  const isCameraReady = cameraStatus === 'ready'
  const isStarting = cameraStatus === 'starting'

  return (
    <main className="app-shell">
      <section className="capture-flow" aria-labelledby="page-title">
        <header className="intro">
          <p className="eyebrow">PWA тест</p>
          <h1 id="page-title">Фотофиксация инцидента</h1>
          <p>
            Откройте камеру, сделайте снимок и сразу проверьте результат на
            экране.
          </p>
        </header>

        <div className="viewer" aria-live="polite">
          {photoUrl ? (
            <img src={photoUrl} alt="Сделанная фотофиксация инцидента" />
          ) : (
            <>
              <video
                ref={videoRef}
                className={isCameraReady ? 'is-visible' : ''}
                muted
                playsInline
                autoPlay
              />
              {!isCameraReady && (
                <div className="placeholder">
                  <span>Камера еще не открыта</span>
                  <strong>Снимок появится здесь</strong>
                </div>
              )}
            </>
          )}

          {isStarting && <div className="status">Запрашиваю камеру...</div>}
        </div>

        <canvas ref={canvasRef} hidden />

        <div className="actions">
          {photoUrl ? (
            <button className="primary-action" type="button" onClick={startCamera}>
              Снять заново
            </button>
          ) : (
            <button
              className="primary-action"
              type="button"
              onClick={isCameraReady ? takePhoto : startCamera}
              disabled={isStarting}
            >
              {isStarting
                ? 'Открываю камеру'
                : isCameraReady
                  ? 'Сделать фото'
                  : 'Открыть камеру'}
            </button>
          )}

          <label className="secondary-action">
            Системная камера
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleSystemCapture}
            />
          </label>
        </div>

        {capturedAt && <p className="stamp">Снимок: {capturedAt}</p>}

        <p className="privacy-note">
          Снимок не отправляется на сервер и пропадет после закрытия страницы.
        </p>

        {message && (
          <p className="message" role="status">
            {message}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
