
import { PassportLocalDocument } from 'mongoose';

interface UserDocument extends PassportLocalDocument {
    username: string;
    migrated: boolean;
}

export { UserDocument };