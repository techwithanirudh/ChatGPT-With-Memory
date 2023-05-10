export interface Message {
    text: string;
    withoutSearchQuery?: string;
    createdAt: admin.firestore.Timestamp;
    user: {
        _id: string;
        name: string;
        avatar: string;
    };
}
