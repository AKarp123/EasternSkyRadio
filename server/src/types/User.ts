
import { PassportLocalDocument } from 'mongoose';

interface UserDocument extends PassportLocalDocument {
    username: string;
}

export { UserDocument }