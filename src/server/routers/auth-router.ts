import { currentUser } from "@clerk/nextjs/server";
import { router } from "../__internals/router";
import { publicProcedure } from "../procedures";
import { db } from "@/db";

const authRouter = router({
    getDatabaseSyncStatus: publicProcedure.query(async({c,ctx}) => {
        
        const auth  = await currentUser()

        if(!auth){
            return c.json({
                isSynced: false
            })
        }

        const user = await db.user.findFirst({
            where:{
                externalId: auth.id
            }
        })

        if(!user){
            await db.user.create({
                data: {
                    quotaLimit: 100,
                    externalId: auth.id,
                    email: auth.emailAddresses[0].emailAddress,
                }
            })
            return c.json({
                isSynced: true
            })
        }

        return c.json({
            isSynced: true
        })
    })
});

export default authRouter