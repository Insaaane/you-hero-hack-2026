import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Flex,
  Image,
  Space,
  Tag,
  Typography,
  Upload,
  type UploadProps,
} from "antd";
import type { CameraStatus } from "../model/types";

const { Paragraph, Text, Title } = Typography;

function formatCapturedAt() {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

function readPhotoFile(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unexpected file reader result"));
    });

    reader.addEventListener("error", () => {
      reject(new Error("Unable to read selected photo"));
    });

    reader.readAsDataURL(file);
  });
}

export function IncidentPhotoCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [capturedAt, setCapturedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const releaseCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      releaseCamera();
    };
  }, []);

  const rememberCaptureTime = () => {
    setCapturedAt(formatCapturedAt());
  };

  const startCamera = async () => {
    setMessage(null);
    setPhotoUrl(null);
    setCapturedAt(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage(
        "Прямой доступ к камере недоступен. Используйте системную камеру или откройте приложение в HTTPS-контексте.",
      );
      return;
    }

    setCameraStatus("starting");
    releaseCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraStatus("ready");
    } catch (error) {
      releaseCamera();
      setCameraStatus("idle");
      setMessage(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Браузер не дал доступ к камере. Проверьте разрешение и HTTPS."
          : "Не удалось открыть камеру. Используйте системную камеру как запасной сценарий.",
      );
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !video ||
      !canvas ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setMessage("Камера еще не готова. Подождите секунду и попробуйте снова.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setMessage("Браузер не смог подготовить снимок.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotoUrl(canvas.toDataURL("image/jpeg", 0.92));
    rememberCaptureTime();
    setMessage(
      "Фото готово. В MVP-заглушке снимок хранится только в текущем окне.",
    );
    releaseCamera();
    setCameraStatus("idle");
  };

  const handleSystemUpload: UploadProps["beforeUpload"] = (file) => {
    void readPhotoFile(file)
      .then((photo) => {
        setPhotoUrl(photo);
        rememberCaptureTime();
        setMessage(
          "Фото готово. В MVP-заглушке снимок хранится только в текущем окне.",
        );
        releaseCamera();
        setCameraStatus("idle");
      })
      .catch(() => {
        setMessage("Не удалось открыть сделанный снимок.");
      });

    return Upload.LIST_IGNORE;
  };

  const isCameraReady = cameraStatus === "ready";
  const isStarting = cameraStatus === "starting";

  return (
    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
      <Card>
        <Space orientation="vertical" size={8}>
          <Tag color="green">MVP-заглушка</Tag>
          <Title level={2} style={{ margin: 0 }}>
            Фотофиксация дефекта
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Тестовый модуль для будущего обхода оборудования: открыть камеру,
            сделать снимок и проверить, что фото отображается в мобильном PWA.
          </Paragraph>
        </Space>
      </Card>

      <Card styles={{ body: { padding: 0 } }}>
        <div className="capture-preview" aria-live="polite">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Сделанная фотофиксация дефекта оборудования"
              preview={false}
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <>
              <video
                ref={videoRef}
                data-ready={isCameraReady}
                muted
                playsInline
                autoPlay
              />
              {!isCameraReady && (
                <div className="capture-placeholder">
                  <Space orientation="vertical" size={4}>
                    <Text type="secondary">Камера еще не открыта</Text>
                    <Text strong>Снимок появится здесь</Text>
                  </Space>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <canvas ref={canvasRef} hidden />

      <Flex gap="small" vertical>
        <Button
          type="primary"
          size="large"
          block
          loading={isStarting}
          onClick={
            photoUrl ? startCamera : isCameraReady ? takePhoto : startCamera
          }
        >
          {photoUrl
            ? "Снять заново"
            : isCameraReady
              ? "Сделать фото"
              : "Открыть камеру"}
        </Button>

        <Upload
          accept="image/*"
          capture="environment"
          beforeUpload={handleSystemUpload}
          maxCount={1}
          showUploadList={false}
          style={{ width: "100%" }}
        >
          <Button size="large" block>
            Снять через системную камеру
          </Button>
        </Upload>
      </Flex>

      {capturedAt && (
        <Alert
          type="success"
          showIcon
          closable={{ closeIcon: true, "aria-label": "close" }}
          title="Снимок получен"
          description={`Время фотофиксации: ${capturedAt}`}
        />
      )}

      {message && <Alert type="info" showIcon title={message} />}
    </Space>
  );
}
