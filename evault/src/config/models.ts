export interface RecordBase{
    id: string,
    created: Date,
    updated: Date
}

export interface User extends RecordBase{
    name: string,
    avatar?: string,
    role: Role,
    email: string
}

export interface Case extends RecordBase{
    name: string,
    description: string,
    lawyer: string
}

export interface CaseAccess extends RecordBase{
    case: string,
    expand: {
        case: Case,
    },
    user: string
}

export type Role = 'admin' | 'lawyer' | 'other';