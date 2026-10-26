export type ControlPanelFieldType = 1 | 2 | 3

export type ControlPanelRecord = {
  id: string
  name: string
  name_prefix: string | null
  fieldtype: ControlPanelFieldType
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type ControlPanelInput = {
  name: string
  name_prefix: string | null
  fieldtype: ControlPanelFieldType
}
