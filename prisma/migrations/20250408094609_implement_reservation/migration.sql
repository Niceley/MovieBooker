-- CreateTable
CREATE TABLE "Reservartion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "movieId" INTEGER NOT NULL,
    "movieName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservartion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservartion" ADD CONSTRAINT "Reservartion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
