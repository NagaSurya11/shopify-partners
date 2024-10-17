
export interface UserProfile {
    name: string;
    profilePicture: string;
    email: string;
}

export interface AuthContextInterface {
    getToken: () => string;
    logout: () => void;
    userProfile: UserProfile;
}
