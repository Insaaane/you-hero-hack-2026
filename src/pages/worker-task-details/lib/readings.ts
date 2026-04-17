import {
  inspectionReadingConfigs,
  type InspectionReadingKey,
  type InspectionReadingValues,
} from '@/entities/inspection'

export type ReadingFormValues = Partial<Record<InspectionReadingKey, string>>

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(value).replace('.', ',')
}

export function getReadingFormValues(
  readings: InspectionReadingValues,
): ReadingFormValues {
  return inspectionReadingConfigs.reduce<ReadingFormValues>((values, config) => {
    const reading = readings[config.key]

    if (typeof reading === 'number') {
      values[config.key] = formatNumber(reading)
    }

    return values
  }, {})
}

export function parseReadingValue(value?: string) {
  if (!value) {
    return undefined
  }

  const normalizedValue = value.replace(',', '.')
  const match = normalizedValue.match(/-?\d+(\.\d+)?/)

  if (!match) {
    return undefined
  }

  const parsedValue = Number(match[0])

  return Number.isNaN(parsedValue) ? undefined : parsedValue
}

export function getReadingsFromForm(values: ReadingFormValues) {
  return inspectionReadingConfigs.reduce<InspectionReadingValues>(
    (readings, config) => {
      const value = parseReadingValue(values[config.key])

      if (typeof value === 'number') {
        readings[config.key] = value
      }

      return readings
    },
    {},
  )
}
