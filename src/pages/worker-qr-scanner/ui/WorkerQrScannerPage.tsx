import { useEffect, useRef, useState } from "react";
import { CameraOutlined, ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Flex, Spin, Typography } from "antd";
import type { IScannerControls } from "@zxing/browser";
import { useNavigate } from "react-router";

type ScannerState = "starting" | "scanning" | "error";

const inspectorTaskPathPattern =
  /^\/inspector\/rounds\/[^/]+\/tasks\/[^/]+\/?$/;

function getInspectorTaskPathFromQr(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value, window.location.origin);

    if (!inspectorTaskPathPattern.test(url.pathname)) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function getCameraErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return "Нет доступа к камере. Разрешите доступ в настройках браузера и попробуйте снова.";
    }

    if (error.name === "NotFoundError") {
      return "Камера не найдена на устройстве.";
    }

    if (error.name === "NotReadableError") {
      return "Камера уже используется другим приложением или браузером.";
    }
  }

  return "Не удалось открыть камеру. Проверьте доступ к камере и HTTPS-соединение.";
}

export function WorkerQrScannerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const isQrHandledRef = useRef(false);
  const navigate = useNavigate();
  const [scannerState, setScannerState] = useState<ScannerState>("starting");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [invalidQrValue, setInvalidQrValue] = useState<string | null>(null);
  const [scanSession, setScanSession] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return undefined;
    }

    let isMounted = true;
    isQrHandledRef.current = false;

    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    void (async () => {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");

        if (!isMounted) {
          return;
        }

        const codeReader = new BrowserQRCodeReader(undefined, {
          delayBetweenScanAttempts: 250,
        });

        const controls = await codeReader.decodeFromConstraints(
          constraints,
          videoElement,
          (result, _error, controls) => {
            if (!result || isQrHandledRef.current) {
              return;
            }

            const targetPath = getInspectorTaskPathFromQr(result.getText());

            if (!targetPath) {
              setInvalidQrValue(result.getText());
              return;
            }

            isQrHandledRef.current = true;
            controls.stop();
            navigate(targetPath, { replace: true });
          },
        );

        if (!isMounted) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
        setScannerState("scanning");
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setCameraError(getCameraErrorMessage(error));
        setScannerState("error");
      }
    })();

    return () => {
      isMounted = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [navigate, scanSession]);

  const restartScanner = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setScannerState("starting");
    setCameraError(null);
    setInvalidQrValue(null);
    setScanSession((currentSession) => currentSession + 1);
  };

  return (
    <main className="qr-scanner-page">
      <section className="qr-scanner">
        <div className="qr-scanner__viewport">
          <video
            ref={videoRef}
            className="qr-scanner__video"
            muted
            playsInline
            autoPlay
            aria-label="Камера для сканирования QR-кода"
          />

          <div className="qr-scanner__frame" aria-hidden="true" />

          {scannerState === "starting" && (
            <Flex
              vertical
              align="center"
              justify="center"
              gap={12}
              className="qr-scanner__overlay"
            >
              <Spin />
              <Typography.Text>Открываем камеру</Typography.Text>
            </Flex>
          )}
        </div>

        <Card
          className="qr-scanner__status-card"
          variant="borderless"
          styles={{ body: { padding: 0 } }}
        >
          <Flex vertical gap={12}>
            <Flex align="center" gap={8}>
              <CameraOutlined className="qr-scanner__status-icon" />
              <Typography.Text strong>
                Наведите камеру на QR-код задачи
              </Typography.Text>
            </Flex>

            <Typography.Text type="secondary">
              Поддерживается ссылка вида
              /inspector/rounds/:roundId/tasks/:taskId
            </Typography.Text>

            {invalidQrValue && (
              <Alert
                type="warning"
                showIcon
                title="QR-код не похож на ссылку задачи"
                description={invalidQrValue}
              />
            )}

            {cameraError && (
              <Alert
                type="error"
                showIcon
                title="Камера недоступна"
                description={cameraError}
                action={
                  <Button icon={<ReloadOutlined />} onClick={restartScanner}>
                    Повторить
                  </Button>
                }
              />
            )}
          </Flex>
        </Card>
      </section>
    </main>
  );
}
