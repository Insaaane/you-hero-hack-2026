import { type ChangeEvent, useRef, useState } from 'react'
import {
  CameraOutlined,
  CloseOutlined,
  PictureOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Flex,
  Form,
  Image,
  Input,
  Space,
  Typography,
} from 'antd'
import type { InspectionDefectInfo } from '@/entities/inspection'
import { BottomSheetModal } from '@/shared/ui'

type TaskDefectFormModalMode = 'add' | 'edit'

type TaskDefectFormModalProps = {
  open: boolean
  mode: TaskDefectFormModalMode
  initialDefect?: InspectionDefectInfo
  onCancel: () => void
  onSubmit: (defect: InspectionDefectInfo) => void
}

type DefectFormValues = {
  title: string
  comment: string
}

type DefectPhotoDraft = {
  id: string
  src: string
  alt: string
}

const { Text } = Typography

function readPhotoFile(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Unexpected file reader result'))
    })

    reader.addEventListener('error', () => {
      reject(new Error('Unable to read selected photo'))
    })

    reader.readAsDataURL(file)
  })
}

function getPhotoId() {
  return `defect-photo-${crypto.randomUUID()}`
}

export function TaskDefectFormModal({
  open,
  mode,
  initialDefect,
  onCancel,
  onSubmit,
}: TaskDefectFormModalProps) {
  const [form] = Form.useForm<DefectFormValues>()
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<DefectPhotoDraft[]>(
    () => initialDefect?.photos ?? [],
  )
  const formValues = Form.useWatch([], form)
  const isFirstStepComplete =
    Boolean(formValues?.title?.trim()) && Boolean(formValues?.comment?.trim())
  const modalTitle = mode === 'add' ? 'Добавить дефект' : 'Редактировать дефект'
  const submitLabel = mode === 'add' ? 'Добавить дефект' : 'Сохранить'

  const appendPhotos = async (files: File[]) => {
    const nextPhotos = await Promise.all(
      files.map(async (file) => ({
        id: getPhotoId(),
        src: await readPhotoFile(file),
        alt: file.name,
      })),
    )

    setPhotos((currentPhotos) => [...currentPhotos, ...nextPhotos])
  }

  const handlePhotoInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])

    event.currentTarget.value = ''

    if (files.length === 0) {
      return
    }

    void appendPhotos(files)
  }

  const handleNext = async () => {
    await form.validateFields(['title', 'comment'])
    setStep(2)
  }

  const handleSubmit = () => {
    const values = form.getFieldsValue(true)
    const title = values.title?.trim()
    const comment = values.comment?.trim()

    if (!title || !comment) {
      setStep(1)
      return
    }

    onSubmit({
      title,
      comment,
      photos,
    })
  }

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((currentPhotos) =>
      currentPhotos.filter((photo) => photo.id !== photoId),
    )
  }

  return (
    <BottomSheetModal
      open={open}
      title={modalTitle}
      className="task-defect-modal"
      rootClassName="task-defect-modal-root"
      width={520}
      destroyOnHidden
      footer={
        step === 1 ? (
          <Button
            type="primary"
            size="large"
            block
            disabled={!isFirstStepComplete}
            onClick={() => void handleNext()}
          >
            Далее
          </Button>
        ) : (
          <Flex gap={12}>
            <Button size="large" block onClick={() => setStep(1)}>
              Назад
            </Button>
            <Button type="primary" size="large" block onClick={handleSubmit}>
              {submitLabel}
            </Button>
          </Flex>
        )
      }
      onCancel={onCancel}
    >
      {step === 1 ? (
        <Space orientation="vertical" size={16} className="task-defect-modal__body">
          <Text type="secondary">Шаг 1. Опишите предполагаемый дефект</Text>
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            initialValues={{
              title: initialDefect?.title ?? '',
              comment: initialDefect?.comment ?? '',
            }}
            className="task-defect-modal__form"
          >
            <Form.Item
              name="title"
              label="Название"
              rules={[{ required: true, message: 'Укажите название дефекта' }]}
            >
              <Input size="large" placeholder="Название дефекта" />
            </Form.Item>

            <Form.Item
              name="comment"
              label="Комментарий"
              rules={[{ required: true, message: 'Добавьте комментарий' }]}
            >
              <Input.TextArea
                rows={5}
                placeholder="Опишите, что произошло"
              />
            </Form.Item>
          </Form>
        </Space>
      ) : (
        <Space orientation="vertical" size={16} className="task-defect-modal__body">
          <Text type="secondary">
            Шаг 2. Загрузите фотографии предполагаемого дефекта
          </Text>

          <Card
            variant="borderless"
            className="task-defect-modal__upload"
            styles={{ body: { padding: 0 } }}
          >
            <Space orientation="vertical" size={16} align="center">
              <span className="task-defect-modal__upload-icon">
                <UploadOutlined />
              </span>
              <Text strong>Загрузите изображения</Text>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="native-file-input"
                onChange={handlePhotoInputChange}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="native-file-input"
                onChange={handlePhotoInputChange}
              />

              <Flex gap={8} wrap justify="center">
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={() => cameraInputRef.current?.click()}
                >
                  Открыть камеру
                </Button>

                <Button
                  icon={<PictureOutlined />}
                  onClick={() => galleryInputRef.current?.click()}
                >
                  Выбрать из галереи
                </Button>
              </Flex>
            </Space>
          </Card>

          {photos.length > 0 && (
            <Flex gap={8} wrap className="task-defect-modal__photos">
              {photos.map((photo) => (
                <div key={photo.id} className="task-defect-modal__photo">
                  <Image
                    preview={false}
                    src={photo.src}
                    alt={photo.alt}
                    className="task-defect-modal__photo-image"
                  />
                  <Button
                    type="text"
                    danger
                    aria-label="Удалить фотографию"
                    className="task-defect-modal__photo-remove"
                    icon={<CloseOutlined />}
                    onClick={() => handleRemovePhoto(photo.id)}
                  />
                </div>
              ))}
            </Flex>
          )}
        </Space>
      )}
    </BottomSheetModal>
  )
}
