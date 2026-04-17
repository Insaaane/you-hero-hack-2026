import { type MouseEvent, type TouchEvent, useRef, useState } from "react";
import { Modal, type ModalProps } from "antd";
import { MOBILE_MEDIA_QUERY } from "@/shared/model";
import { useMediaQuery } from "@/shared/lib/viewport";
import cls from "./BottomSheetModal.module.css";

type BottomSheetModalProps = ModalProps & {
  mobileBottomSheet?: boolean;
  swipeToClose?: boolean;
};

const SWIPE_CLOSE_THRESHOLD = 120;

function mergeClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export function BottomSheetModal({
  mobileBottomSheet = true,
  swipeToClose = true,
  centered = true,
  width,
  rootClassName,
  onCancel,
  ...props
}: BottomSheetModalProps) {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const shouldUseMobileBottomSheet = mobileBottomSheet && isMobile;
  const startYRef = useRef<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!shouldUseMobileBottomSheet || !swipeToClose) {
      return;
    }

    startYRef.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!shouldUseMobileBottomSheet || !swipeToClose) {
      return;
    }

    if (startYRef.current === null) {
      return;
    }

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!shouldUseMobileBottomSheet || !swipeToClose) {
      return;
    }

    if (translateY >= SWIPE_CLOSE_THRESHOLD) {
      onCancel?.({} as MouseEvent<HTMLButtonElement>);
    }

    startYRef.current = null;
    setTranslateY(0);
  };

  return (
    <Modal
      {...props}
      onCancel={onCancel}
      centered={shouldUseMobileBottomSheet ? false : centered}
      width={shouldUseMobileBottomSheet ? "100%" : width}
      rootClassName={mergeClassNames(
        rootClassName,
        shouldUseMobileBottomSheet && cls.root,
      )}
      modalRender={(modal) =>
        shouldUseMobileBottomSheet ? (
          <div
            className={cls.sheetWrapper}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateY(${translateY}px)`,
              transition: startYRef.current ? "none" : "transform 0.2s ease",
            }}
          >
            <div className={cls.dragHandle} />
            {modal}
          </div>
        ) : (
          modal
        )
      }
    />
  );
}
