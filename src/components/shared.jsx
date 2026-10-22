import { FileArchive, FileImage, FileSpreadsheet, FileText } from 'lucide-react'
export const initials = name => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
export const formatDate = value => {
  const date = new Date(value), today = new Date()
  if (date.toDateString() === today.toDateString()) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
export const fileIcon = name => /\.(png|jpg|jpeg|webp)$/i.test(name) ? FileImage : /\.(xls|xlsx|csv)$/i.test(name) ? FileSpreadsheet : /\.(zip|fig)$/i.test(name) ? FileArchive : FileText
