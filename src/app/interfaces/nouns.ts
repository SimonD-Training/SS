export interface user {
    email: string,
    password: string
}

export interface scheduleItem {
    class: string,
    day: string,
    time: string,
    teacher: string,
    subject: string
}

export interface staffItem {
    teacher: string,
    subject: string,
    class: string
}