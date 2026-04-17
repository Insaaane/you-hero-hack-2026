export type EquipmentStatus = 'normal' | 'warning' | 'critical' | 'offline'

export type Equipment = {
  id: string
  name: string
  location: string
  status: EquipmentStatus
}
