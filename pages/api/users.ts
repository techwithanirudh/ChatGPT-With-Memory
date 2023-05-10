import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { NextApiRequest, NextApiResponse } from "next";

const getUsers = async () => {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    const usersList = usersSnapshot.docs.map((doc) => {
        return { email: doc.id, ...doc.data() };
    });

    return usersList;

};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const users = await getUsers();
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting users" });
    }
}
