
export const statusColors = {
    inprogress: '#FFD700',
    done: '#00FF00',
    idea: '#ADD8E6',
    shipped: '#008000',
    disclosed: '#800080'
} as const

export type Status = keyof typeof statusColors;
export type StatusColor = typeof statusColors[Status];


