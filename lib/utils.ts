import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'yyyy年MM月dd日', { locale: zhCN })
  } catch {
    return dateString
  }
}
