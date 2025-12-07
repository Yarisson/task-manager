export interface Task {
  id: string
  title: string
  description: string
}

export interface Column {
  id: string
  name: string
  color: string
  tasks: Record<string, Task>
  taskOrder: string[]
}

export interface Desk {
  id: string
  name: string
  columns: Record<string, Column>
  columnOrder: string[]
}
