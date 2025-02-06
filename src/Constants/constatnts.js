export const systemRoles = {
    ADMIN: "admin",
    USER: "user",
    SUPER_ADMIN: "super-admin"
}

const { ADMIN, USER, SUPER_ADMIN } = systemRoles

export const ADMIN_USER = [ADMIN, USER]
export const ADMIN_SUPER_ADMIN = [ADMIN, SUPER_ADMIN]
export const USER_SUPER_ADMIN = [USER, SUPER_ADMIN]

export const providers = {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    SYSTEM: 'system'
}

// allow extentions
export const ImageExtentions = ['image/jpg', 'image/jpeg', 'image/png']
export const VideoExtentions = ['video/mp4', 'video/avi', 'video/mov']
export const DocumentExtentions = ['application/pdf', 'application/json', 'application/javascript']