interface StatusOption {
  status: string
  emoji: string // replace by color banner of ClickUp API lets us in future
}

export const statuses: Record<string, StatusOption> = {
  success: {
    status: 'Success',
    emoji: '🟢'
  },
  failure: {
    status: 'Failure',
    emoji: '🔴'
  },
  cancelled: {
    status: 'Cancelled',
    emoji: '🟡'
  }
}

export const isValidStatus = (status: string) =>
  Object.keys(statuses).includes(status)
