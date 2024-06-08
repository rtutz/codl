-- DropForeignKey
ALTER TABLE "UserClassMap" DROP CONSTRAINT "UserClassMap_classID_fkey";

-- DropForeignKey
ALTER TABLE "UserClassMap" DROP CONSTRAINT "UserClassMap_userID_fkey";

-- AddForeignKey
ALTER TABLE "UserClassMap" ADD CONSTRAINT "UserClassMap_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClassMap" ADD CONSTRAINT "UserClassMap_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
