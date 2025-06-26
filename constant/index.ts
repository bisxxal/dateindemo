export interface UserProfileProps {
    age?: number | null,
    batch?: number | null,
    gender?: string | null,
    bio?: string | null,
    height?: number | null,
    job?: string | null,
    keywords?: {
        name: string
    }[] | null,
    languages?: string | null,
    livingIn?: string | null,
    lookingFor?: string | null,
    photos?: {
        url: string
    }[] | null,
}