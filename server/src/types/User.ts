
import type { PassportLocalMongooseDocument } from 'passport-local-mongoose';

interface UserDocument extends PassportLocalMongooseDocument {
    username: string;
    migrated: boolean;
}

export { UserDocument };